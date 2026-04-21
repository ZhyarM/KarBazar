<?php

namespace App\Http\Middleware;

use App\Models\Setting;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckPlatformMaintenance
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $maintenanceEnabled = (bool) Setting::getValue('platform_maintenance_mode', false);

        if (!$maintenanceEnabled) {
            return $next($request);
        }

        $user = $request->user() ?? Auth::guard('sanctum')->user();

        if ($user && $user->role === 'admin') {
            return $next($request);
        }

        return response()->json([
            'success' => false,
            'message' => 'The platform is currently under maintenance.',
        ], 503);
    }
}
