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

    private function getPackagesArray(): array
    {
        $packages = $this->packages;

        if (is_string($packages)) {
            $packages = json_decode($packages, true) ?: [];
        }

        return is_array($packages) ? $packages : [];
    }

    public function toArray(Request $request): array
    {
        $gallery = $this->gallery;
        if ($gallery && is_array($gallery)) {
            $gallery = array_map(fn($img) => $this->getStorageUrl($img), $gallery);
        }

        $packages = $this->getPackagesArray();
        $basicPackage = $packages['basic'] ?? [];
        $standardPackage = $packages['standard'] ?? [];
        $premiumPackage = $packages['premium'] ?? [];

        $basicPrice = $basicPackage['price'] ?? $this->price;
        $basicDeliveryTime = $basicPackage['delivery_time'] ?? $this->delivery_time;
        $basicDescription = $basicPackage['description'] ?? '';

        $standardPrice = $standardPackage['price'] ?? null;
        $standardDeliveryTime = $standardPackage['delivery_time'] ?? null;
        $standardDescription = $standardPackage['description'] ?? null;

        $premiumPrice = $premiumPackage['price'] ?? null;
        $premiumDeliveryTime = $premiumPackage['delivery_time'] ?? null;
        $premiumDescription = $premiumPackage['description'] ?? null;

        $activePackageDiscounts = [];
        $maxDiscountPercentage = null;

        if ($this->relationLoaded('packageDiscounts')) {
            foreach ($this->packageDiscounts as $discount) {
                $packageKey = $discount->package_key;
                $packagePrice = $packages[$packageKey]['price'] ?? null;
                $discountPercentage = (float) $discount->discount_percentage;

                $activePackageDiscounts[$packageKey] = [
                    'discount_percentage' => $discountPercentage,
                    'expires_at' => $discount->expires_at?->toIso8601String(),
                    'discounted_price' => $packagePrice !== null
                        ? round($packagePrice - ($packagePrice * ($discountPercentage / 100)), 2)
                        : null,
                ];

                if ($maxDiscountPercentage === null || $discountPercentage > $maxDiscountPercentage) {
                    $maxDiscountPercentage = $discountPercentage;
                }
            }
        }

        $discountedStartingPrice = $basicPrice;
        if (isset($activePackageDiscounts['basic']['discounted_price']) && $activePackageDiscounts['basic']['discounted_price'] !== null) {
            $discountedStartingPrice = $activePackageDiscounts['basic']['discounted_price'];
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
            'starting_price' => $basicPrice,
            'discounted_starting_price' => $discountedStartingPrice,
            'has_active_discount' => !empty($activePackageDiscounts),
            'max_discount_percentage' => $maxDiscountPercentage,
            'active_package_discounts' => $activePackageDiscounts,
            'basic_price' => $basicPrice,
            'basic_delivery_time' => $basicDeliveryTime,
            'basic_description' => $basicDescription,
            'standard_price' => $standardPrice,
            'standard_delivery_time' => $standardDeliveryTime,
            'standard_description' => $standardDescription,
            'premium_price' => $premiumPrice,
            'premium_delivery_time' => $premiumDeliveryTime,
            'premium_description' => $premiumDescription,
            'delivery_time' => $this->delivery_time,
            'image_url' => $this->getStorageUrl($this->image_url),
            'gallery' => $gallery,
            'tags' => $tags,
            'packages' => $packages,
            'requirements' => $this->requirements,
            'faq' => $faq,
            'rating' => $this->rating,
            'review_count' => $this->review_count,
            'total_reviews' => $this->review_count,
            'order_count' => $this->order_count,
            'total_orders' => $this->order_count,
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
