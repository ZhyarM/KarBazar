<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Gig;
use App\Models\Order;
use App\Models\Review;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    // Dashboard overview stats
    public function overview()
    {
        $stats = [
            'total_users' => User::count(),
            'total_freelancers' => User::where('role', 'freelancer')->count(),
            'total_clients' => User::where('role', 'client')->count(),
            'total_gigs' => Gig::count(),
            'active_gigs' => Gig::where('is_active', true)->count(),
            'total_orders' => Order::count(),
            'pending_orders' => Order::where('status', 'pending')->count(),
            'in_progress_orders' => Order::where('status', 'in_progress')->count(),
            'completed_orders' => Order::where('status', 'completed')->count(),
            'total_revenue' => Order::where('status', 'completed')->sum('price'),
            'total_reviews' => Review::count(),
            'average_rating' => round(Review::avg('rating'), 2),
            'total_categories' => Category::count(),
        ];

        // New users this month
        $stats['new_users_this_month'] = User::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        // Orders this month
        $stats['orders_this_month'] = Order::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        // Revenue this month
        $stats['revenue_this_month'] = Order::where('status', 'completed')
            ->whereMonth('completed_at', now()->month)
            ->whereYear('completed_at', now()->year)
            ->sum('price');

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }

    // Revenue chart (last 30 days)
    public function revenueChart()
    {
        $data = Order::where('status', 'completed')
            ->where('completed_at', '>=', now()->subDays(30))
            ->selectRaw('DATE(completed_at) as date, SUM(price) as revenue')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    // Orders chart (last 30 days)
    public function ordersChart()
    {
        $data = Order::where('created_at', '>=', now()->subDays(30))
            ->selectRaw('DATE(created_at) as date, COUNT(*) as orders')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    // Top freelancers by earnings
    public function topFreelancers()
    {
        $freelancers = User::where('role', 'freelancer')
            ->with('profile')
            ->withCount('ordersAsSeller')
            ->withSum(['ordersAsSeller' => function ($query) {
                $query->where('status', 'completed');
            }], 'price')
            ->orderBy('orders_as_seller_sum_price', 'desc')
            ->limit(10)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $freelancers->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'username' => $user->profile->username ?? null,
                    'avatar' => $user->profile->avatar_url ?? null,
                    'total_orders' => $user->orders_as_seller_count,
                    'total_earnings' => $user->orders_as_seller_sum_price ?? 0,
                    'rating' => $user->profile->rating ?? 0,
                ];
            }),
        ]);
    }

    // Top gigs by orders
    public function topGigs()
    {
        $gigs = Gig::with(['seller.profile', 'category'])
            ->withCount('orders')
            ->orderBy('orders_count', 'desc')
            ->limit(10)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $gigs->map(function ($gig) {
                return [
                    'id' => $gig->id,
                    'title' => $gig->title,
                    'price' => $gig->price,
                    'seller' => $gig->seller->name,
                    'category' => $gig->category->name,
                    'total_orders' => $gig->orders_count,
                    'rating' => $gig->rating,
                    'review_count' => $gig->review_count,
                ];
            }),
        ]);
    }

    // Category statistics
    public function categoryStats()
    {
        $categories = Category::withCount('gigs')
            ->with(['gigs' => function ($query) {
                $query->withCount('orders');
            }])
            ->get();

        return response()->json([
            'success' => true,
            'data' => $categories->map(function ($category) {
                $totalOrders = $category->gigs->sum(function ($gig) {
                    return $gig->orders_count;
                });

                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'gig_count' => $category->gigs_count,
                    'total_orders' => $totalOrders,
                ];
            }),
        ]);
    }

    // Recent activities
    public function recentActivities()
    {
        $activities = [];

        // Recent orders
        $recentOrders = Order::with(['buyer', 'seller', 'gig'])
            ->latest()
            ->limit(10)
            ->get();

        foreach ($recentOrders as $order) {
            $activities[] = [
                'type' => 'order',
                'message' => "{$order->buyer->name} ordered \"{$order->gig->title}\" from {$order->seller->name}",
                'date' => $order->created_at,
            ];
        }

        // Recent reviews
        $recentReviews = Review::with(['reviewer', 'reviewee', 'gig'])
            ->latest()
            ->limit(5)
            ->get();

        foreach ($recentReviews as $review) {
            $activities[] = [
                'type' => 'review',
                'message' => "{$review->reviewer->name} left a {$review->rating}-star review for \"{$review->gig->title}\"",
                'date' => $review->created_at,
            ];
        }

        // Sort by date
        usort($activities, function ($a, $b) {
            return $b['date'] <=> $a['date'];
        });

        return response()->json([
            'success' => true,
            'data' => array_slice($activities, 0, 15),
        ]);
    }
}