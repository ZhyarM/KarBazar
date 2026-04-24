<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\AdminAuditLog;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AdminUserController extends Controller
{
    private function buildQuery(Request $request)
    {
        $query = User::query()->with('profile')->orderByDesc('created_at');

        if ($request->filled('role')) {
            $query->where('role', $request->string('role'));
        }

        if ($request->has('is_active')) {
            $query->where('is_active', filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN));
        }

        if ($request->filled('search')) {
            $search = trim((string) $request->input('search'));
            $query->where(function ($innerQuery) use ($search) {
                $innerQuery
                    ->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        return $query;
    }

    public function index(Request $request)
    {
        $query = $this->buildQuery($request);
        $perPage = min(max((int) $request->input('per_page', 20), 1), 100);
        $users = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => UserResource::collection($users),
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ],
        ]);
    }

    public function export(Request $request): StreamedResponse
    {
        $users = $this->buildQuery($request)->get();
        $fileName = 'users-export-' . now()->format('Y-m-d_His') . '.csv';

        return response()->streamDownload(function () use ($users) {
            $output = fopen('php://output', 'w');

            fputcsv($output, [
                'id',
                'name',
                'email',
                'role',
                'status',
                'username',
                'created_at',
            ]);

            foreach ($users as $user) {
                fputcsv($output, [
                    $user->id,
                    $user->name,
                    $user->email,
                    $user->role,
                    $user->is_active ? 'active' : 'inactive',
                    $user->profile?->username,
                    optional($user->created_at)->toDateTimeString(),
                ]);
            }

            fclose($output);
        }, $fileName, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    public function admins(Request $request)
    {
        $request->merge(['role' => 'admin']);

        return $this->index($request);
    }

    public function storeAdmin(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/',
            ],
        ]);

        $adminUser = DB::transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => 'admin',
                'is_active' => true,
            ]);

            Profile::create([
                'user_id' => $user->id,
                'username' => strtolower(str_replace(' ', '_', $validated['name'])) . '_' . $user->id,
            ]);

            return $user;
        });

        $adminUser->load('profile');

        $this->logAction(
            $request,
            'admin_account_created',
            $adminUser,
            null,
            [
                'name' => $adminUser->name,
                'email' => $adminUser->email,
                'role' => $adminUser->role,
                'is_active' => $adminUser->is_active,
            ],
            'Admin account created by admin panel.'
        );

        return response()->json([
            'success' => true,
            'message' => 'Admin account created successfully.',
            'data' => new UserResource($adminUser),
        ], 201);
    }

    public function updateStatus(Request $request, int $id)
    {
        $validated = $request->validate([
            'is_active' => 'required|boolean',
        ]);

        $targetUser = User::findOrFail($id);

        if ((int) $request->user()->id === (int) $targetUser->id && !$validated['is_active']) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot deactivate your own account.',
            ], 422);
        }

        $before = [
            'is_active' => (bool) $targetUser->is_active,
        ];

        $targetUser->update([
            'is_active' => $validated['is_active'],
        ]);

        $after = [
            'is_active' => (bool) $targetUser->is_active,
        ];

        $this->logAction(
            $request,
            $validated['is_active'] ? 'user_reactivated' : 'user_deactivated',
            $targetUser,
            $before,
            $after,
            $validated['is_active'] ? 'User account reactivated by admin.' : 'User account deactivated by admin.'
        );

        return response()->json([
            'success' => true,
            'message' => $validated['is_active']
                ? 'User account has been reactivated successfully.'
                : 'User account has been deactivated successfully.',
            'data' => new UserResource($targetUser->load('profile')),
        ]);
    }

    public function updateRole(Request $request, int $id)
    {
        $validated = $request->validate([
            'role' => 'required|in:client,freelancer,admin',
        ]);

        $targetUser = User::findOrFail($id);

        if ((int) $request->user()->id === (int) $targetUser->id && $validated['role'] !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'You cannot remove your own admin role.',
            ], 422);
        }

        $before = [
            'role' => $targetUser->role,
        ];

        $targetUser->update([
            'role' => $validated['role'],
        ]);

        $after = [
            'role' => $targetUser->role,
        ];

        $this->logAction(
            $request,
            'user_role_updated',
            $targetUser,
            $before,
            $after,
            'User role updated by admin.'
        );

        return response()->json([
            'success' => true,
            'message' => 'User role updated successfully.',
            'data' => new UserResource($targetUser->load('profile')),
        ]);
    }

    public function destroy(Request $request, int $id)
    {
        $targetUser = User::findOrFail($id);

        if ((int) $request->user()->id === (int) $targetUser->id) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot delete your own account.',
            ], 422);
        }

        if ($targetUser->role === 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Admin accounts cannot be hard deleted from this endpoint.',
            ], 422);
        }

        $before = [
            'name' => $targetUser->name,
            'email' => $targetUser->email,
            'role' => $targetUser->role,
            'is_active' => (bool) $targetUser->is_active,
        ];

        $targetUserId = $targetUser->id;
        $targetUser->delete();

        $this->logAction(
            $request,
            'user_deleted',
            null,
            $before,
            null,
            'User hard deleted by admin.',
            User::class,
            $targetUserId
        );

        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully.',
        ]);
    }

    private function logAction(
        Request $request,
        string $action,
        ?User $target,
        ?array $beforeData = null,
        ?array $afterData = null,
        ?string $description = null,
        ?string $targetType = null,
        ?int $targetId = null
    ): void {
        AdminAuditLog::create([
            'admin_id' => $request->user()->id,
            'action' => $action,
            'target_type' => $targetType ?? ($target ? User::class : null),
            'target_id' => $targetId ?? ($target?->id),
            'description' => $description,
            'before_data' => $beforeData,
            'after_data' => $afterData,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);
    }
}
