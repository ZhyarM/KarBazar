<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_id' => $this->order_id,
            'gig_id' => $this->gig_id,
            'reviewer_id' => $this->reviewer_id,
            'reviewee_id' => $this->reviewee_id,
            'rating' => $this->rating,
            'comment' => $this->comment,
            'created_at' => $this->created_at,
            'reviewer' => new UserResource($this->whenLoaded('reviewer')),
            'reviewee' => new UserResource($this->whenLoaded('reviewee')),
            'gig' => new GigResource($this->whenLoaded('gig')),
        ];
    }
}