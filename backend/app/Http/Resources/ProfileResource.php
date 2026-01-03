<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'username' => $this->username,
            'bio' => $this->bio,
            'title' => $this->title,
            'avatar_url' => $this->avatar_url,
            'cover_url' => $this->cover_url,
            'location' => $this->location,
            'website' => $this->website,
            'hourly_rate' => $this->hourly_rate,
            'skills' => $this->skills,
            'languages' => $this->languages,
            'rating' => $this->rating,
            'total_reviews' => $this->total_reviews,
            'total_jobs' => $this->total_jobs,
            'total_earnings' => $this->total_earnings,
            'response_time' => $this->response_time,
            'created_at' => $this->created_at,
            'user' => new UserResource($this->whenLoaded('user')),
        ];
    }
}