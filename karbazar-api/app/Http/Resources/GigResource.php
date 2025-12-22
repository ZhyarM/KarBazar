<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GigResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'seller_id' => $this->seller_id,
            'category_id' => $this->category_id,
            'title' => $this->title,
            'description' => $this->description,
            'price' => $this->price,
            'delivery_time' => $this->delivery_time,
            'image_url' => $this->image_url,
            'gallery' => $this->gallery,
            'tags' => $this->tags,
            'packages' => $this->packages,
            'requirements' => $this->requirements,
            'faq' => $this->faq,
            'rating' => $this->rating,
            'review_count' => $this->review_count,
            'order_count' => $this->order_count,
            'is_active' => $this->is_active,
            'is_featured' => $this->is_featured,
            'is_trending' => $this->is_trending,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'seller' => new UserResource($this->whenLoaded('seller')),
            'category' => new CategoryResource($this->whenLoaded('category')),
            'reviews' => ReviewResource::collection($this->whenLoaded('reviews')),
        ];
    }
}