<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfileResource extends JsonResource
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
            'user_id' => $this->user_id,
            'username' => $this->username,
            'bio' => $this->bio,
            'title' => $this->title,
            'avatar_url' => $this->getStorageUrl($this->avatar_url),
            'cover_url' => $this->getStorageUrl($this->cover_url),
            'location' => $this->location,
            'website' => $this->website,
            'phone' => $this->phone,
            'hourly_rate' => $this->hourly_rate,
            'skills' => $this->skills ?? [],
            'languages' => $this->languages ?? [],
            'education' => $this->education ?? [],
            'certifications' => $this->certifications ?? [],
            'work_experience' => $this->work_experience ?? [],
            'portfolio' => $this->portfolio ?? [],
            'social_links' => $this->social_links ?? [],
            'rating' => (float) $this->rating,
            'total_reviews' => $this->total_reviews,
            'total_jobs' => $this->total_jobs,
            'total_earnings' => $this->total_earnings,
            'response_time' => $this->response_time,
            'profile_views' => $this->profile_views ?? 0,
            'is_public' => $this->is_public ?? true,
            'is_available' => $this->is_available ?? true,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'user' => new UserResource($this->whenLoaded('user')),
        ];
    }
}
