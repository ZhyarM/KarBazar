<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Convert a relative path to a full storage URL
     */
    private function getStorageUrl($path): ?string
    {
        if (!$path) {
            return null;
        }

        // If already a full URL, return as is
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        // If it's a relative path without /storage prefix, add it
        if (!str_starts_with($path, '/storage/')) {
            return '/storage/' . $path;
        }

        // If it's already /storage/..., return as is
        return $path;
    }

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'image' => $this->getStorageUrl($this->image),
            'role' => $this->role,
            'is_active' => $this->is_active,
            'email_verified_at' => $this->email_verified_at,
            'created_at' => $this->created_at,
            'profile' => new ProfileResource($this->whenLoaded('profile')),
            'followers_count' => $this->followers()->count(),
            'following_count' => $this->following()->count(),
        ];
    }
}
