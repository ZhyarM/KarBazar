<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'gig_id' => $this->gig_id,
            'buyer_id' => $this->buyer_id,
            'seller_id' => $this->seller_id,
            'status' => $this->status,
            'price' => $this->price,
            'platform_fee_percentage' => $this->platform_fee_percentage ?? 0,
            'platform_fee_amount' => $this->platform_fee_amount ?? 0,
            'seller_earnings' => $this->seller_earnings ?? $this->price,
            'delivery_time' => $this->delivery_time,
            'requirements' => $this->requirements,
            'delivery_note' => $this->delivery_note,
            'delivery_files' => $this->delivery_files,
            'completed_at' => $this->completed_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'gig' => new GigResource($this->whenLoaded('gig')),
            'buyer' => new UserResource($this->whenLoaded('buyer')),
            'seller' => new UserResource($this->whenLoaded('seller')),
            'review' => new ReviewResource($this->whenLoaded('review')),
        ];
    }
}