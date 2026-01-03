<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdvertisementResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'title' => $this->title,
            'description' => $this->description,
            'type' => $this->type,
            'media_url' => $this->media_url,
            'link_url' => $this->link_url,
            'duration' => $this->duration,
            'status' => $this->status,
            'paid_amount' => $this->paid_amount,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'impressions' => $this->impressions,
            'clicks' => $this->clicks,
            'ctr' => $this->getCTR(), // Click Through Rate
            'is_expired' => $this->isExpired(),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'user' => new UserResource($this->whenLoaded('user')),
        ];
    }
}