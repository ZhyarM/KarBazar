<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GigDealResource extends JsonResource
{
    private function getStorageUrl($path): ?string
    {
        if (!$path) {
            return null;
        }

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        if (!str_starts_with($path, '/storage/')) {
            return '/storage/' . $path;
        }

        return $path;
    }

    public function toArray(Request $request): array
    {
        $gig = $this->gig->loadMissing(['seller.profile', 'category']);
        $packages = is_array($gig->packages) ? $gig->packages : [];
        $package = $packages[$this->package_key] ?? [];
        $packagePrice = isset($package['price']) ? (float) $package['price'] : 0;
        $discountPercentage = (float) $this->discount_percentage;
        $discountedPrice = $packagePrice > 0
            ? round($packagePrice - ($packagePrice * ($discountPercentage / 100)), 2)
            : 0;

        return [
            'id' => $this->id,
            'gig_id' => $gig->id,
            'package_key' => $this->package_key,
            'package_label' => ucfirst($this->package_key),
            'discount_percentage' => $discountPercentage,
            'original_price' => $packagePrice,
            'discounted_price' => $discountedPrice,
            'expires_at' => $this->expires_at?->toIso8601String(),
            'is_expiring_soon' => $this->expires_at?->between(now(), now()->addHours(48)) ?? false,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at?->toIso8601String(),
            'gig' => [
                'id' => $gig->id,
                'title' => $gig->title,
                'description' => $gig->description,
                'image_url' => $this->getStorageUrl($gig->image_url),
                'rating' => $gig->rating,
                'review_count' => $gig->review_count,
                'seller' => new UserResource($gig->seller),
                'category' => new CategoryResource($gig->category),
                'packages' => $gig->packages,
            ],
        ];
    }
}
