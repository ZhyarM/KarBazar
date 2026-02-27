<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GigResource extends JsonResource
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
        $gallery = $this->gallery;
        if ($gallery && is_array($gallery)) {
            $gallery = array_map(fn($img) => $this->getStorageUrl($img), $gallery);
        }

        // Parse tags - handle both JSON string and array
        $tags = $this->tags;
        if (is_string($tags)) {
            $tags = json_decode($tags, true) ?: [];
        }

        // Parse FAQ
        $faq = $this->faq;
        if (is_string($faq)) {
            $faq = json_decode($faq, true) ?: [];
        }

        return [
            'id' => $this->id,
            'seller_id' => $this->seller_id,
            'category_id' => $this->category_id,
            'title' => $this->title,
            'description' => $this->description,
            'price' => $this->price,
            'delivery_time' => $this->delivery_time,
            'image_url' => $this->getStorageUrl($this->image_url),
            'gallery' => $gallery,
            'tags' => $tags,
            'packages' => $this->packages,
            'requirements' => $this->requirements,
            'faq' => $faq,
            'rating' => $this->rating,
            'review_count' => $this->review_count,
            'order_count' => $this->order_count,
            'view_count' => $this->view_count ?? 0,
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
