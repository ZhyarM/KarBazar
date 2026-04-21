<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Gig;
use App\Models\GigPackageDiscount;
use App\Models\Order;
use App\Models\Review;
use App\Models\Category;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Throwable;

class AnalyticsController extends Controller
{
    private function buildOverviewStats(): array
    {
        $completedOrders = Order::where('status', 'completed');

        return [
            'total_users' => User::count(),
            'total_freelancers' => User::where('role', 'freelancer')->count(),
            'total_clients' => User::where('role', 'client')->count(),
            'total_gigs' => Gig::count(),
            'active_gigs' => Gig::where('is_active', true)->count(),
            'total_orders' => Order::count(),
            'pending_orders' => Order::where('status', 'pending')->count(),
            'in_progress_orders' => Order::where('status', 'in_progress')->count(),
            'completed_orders' => Order::where('status', 'completed')->count(),
            'total_revenue' => (float) $completedOrders->sum('price'),
            'platform_earnings' => (float) $completedOrders->sum('platform_fee_amount'),
            'current_platform_fee' => (float) Setting::getPlatformFee(),
            'maintenance_mode' => (bool) Setting::getValue('platform_maintenance_mode', false),
            'total_reviews' => Review::count(),
            'average_rating' => round((float) (Review::avg('rating') ?? 0), 2),
            'total_categories' => Category::count(),
            'total_ads' => \App\Models\Advertisement::count(),
            'active_ads' => \App\Models\Advertisement::where('status', 'active')->count(),
            'pending_ad_requests' => \App\Models\AdRequest::where('status', 'pending')->count(),
            'ad_revenue' => (float) \App\Models\Advertisement::sum('paid_amount'),
            'active_deals' => GigPackageDiscount::active()->count(),
            'expiring_deals' => GigPackageDiscount::active()->expiringSoon()->count(),
        ];
    }

    private function buildRevenueSeries(): array
    {
        $startDate = now()->subDays(29)->startOfDay();
        $endDate = now()->endOfDay();

        $rows = Order::where('status', 'completed')
            ->where('completed_at', '>=', $startDate)
            ->where('completed_at', '<=', $endDate)
            ->selectRaw('DATE(completed_at) as date_key, SUM(price) as total_value')
            ->groupBy('date_key')
            ->orderBy('date_key')
            ->get()
            ->keyBy('date_key');

        $series = [];
        $cursor = $startDate->copy();

        while ($cursor->lte($endDate->copy()->startOfDay())) {
            $dateKey = $cursor->toDateString();
            $row = $rows->get($dateKey);

            $series[] = [
                'label' => $cursor->format('M j'),
                'value' => (float) ($row->total_value ?? 0),
            ];

            $cursor->addDay();
        }

        return $series;
    }

    private function buildOrdersSeries(): array
    {
        $startDate = now()->subDays(29)->startOfDay();
        $endDate = now()->endOfDay();

        $rows = Order::where('created_at', '>=', $startDate)
            ->where('created_at', '<=', $endDate)
            ->selectRaw('DATE(created_at) as date_key, COUNT(*) as total_value')
            ->groupBy('date_key')
            ->orderBy('date_key')
            ->get()
            ->keyBy('date_key');

        $series = [];
        $cursor = $startDate->copy();

        while ($cursor->lte($endDate->copy()->startOfDay())) {
            $dateKey = $cursor->toDateString();
            $row = $rows->get($dateKey);

            $series[] = [
                'label' => $cursor->format('M j'),
                'value' => (float) ($row->total_value ?? 0),
            ];

            $cursor->addDay();
        }

        return $series;
    }

    private function buildCategorySeries(): array
    {
        return Category::withCount('gigs')
            ->with(['gigs' => function ($query) {
                $query->withCount('orders');
            }])
            ->get()
            ->map(function ($category) {
                $totalOrders = $category->gigs->sum(function ($gig) {
                    return $gig->orders_count;
                });

                return [
                    'id' => $category->id,
                    'label' => $category->name,
                    'value' => (float) $totalOrders,
                    'gig_count' => $category->gigs_count,
                ];
            })
            ->sortByDesc('value')
            ->values()
            ->all();
    }

    private function buildTopFreelancers(): array
    {
        return User::where('role', 'freelancer')
            ->with('profile')
            ->withCount('ordersAsSeller')
            ->withSum(['ordersAsSeller' => function ($query) {
                $query->where('status', 'completed');
            }], 'price')
            ->orderBy('orders_as_seller_sum_price', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'username' => $user->profile->username ?? null,
                    'avatar' => $user->profile->avatar_url ?? null,
                    'total_orders' => $user->orders_as_seller_count,
                    'total_earnings' => (float) ($user->orders_as_seller_sum_price ?? 0),
                    'rating' => (float) ($user->profile->rating ?? 0),
                ];
            })
            ->all();
    }

    private function buildTopGigs(): array
    {
        return Gig::with(['seller.profile', 'category'])
            ->withCount('orders')
            ->orderBy('orders_count', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($gig) {
                return [
                    'id' => $gig->id,
                    'title' => $gig->title,
                    'price' => (float) $gig->price,
                    'seller' => $gig->seller->name,
                    'category' => $gig->category->name,
                    'total_orders' => $gig->orders_count,
                    'rating' => (float) $gig->rating,
                    'review_count' => $gig->review_count,
                ];
            })
            ->all();
    }

    private function buildRecentActivities(): array
    {
        $activities = [];

        $recentOrders = Order::with(['buyer', 'seller', 'gig'])
            ->latest()
            ->limit(10)
            ->get();

        foreach ($recentOrders as $order) {
            $buyerName = $order->buyer?->name ?? 'Unknown buyer';
            $sellerName = $order->seller?->name ?? 'Unknown seller';
            $gigTitle = $order->gig?->title ?? 'Untitled gig';

            $activities[] = [
                'type' => 'order',
                'message' => "{$buyerName} ordered \"{$gigTitle}\" from {$sellerName}",
                'date' => $order->created_at,
            ];
        }

        $recentReviews = Review::with(['reviewer', 'reviewee', 'gig'])
            ->latest()
            ->limit(5)
            ->get();

        foreach ($recentReviews as $review) {
            $reviewerName = $review->reviewer?->name ?? 'Unknown reviewer';
            $gigTitle = $review->gig?->title ?? 'Untitled gig';

            $activities[] = [
                'type' => 'review',
                'message' => "{$reviewerName} left a {$review->rating}-star review for \"{$gigTitle}\"",
                'date' => $review->created_at,
            ];
        }

        usort($activities, function ($a, $b) {
            return $b['date'] <=> $a['date'];
        });

        return array_slice($activities, 0, 15);
    }

    public function dashboard()
    {
        return response()->json([
            'success' => true,
            'data' => [
                'stats' => $this->buildOverviewStats(),
                'charts' => [
                    'revenue' => $this->buildRevenueSeries(),
                    'orders' => $this->buildOrdersSeries(),
                    'categories' => $this->buildCategorySeries(),
                    'freelancers' => $this->buildTopFreelancers(),
                ],
                'tables' => [
                    'top_freelancers' => $this->buildTopFreelancers(),
                    'top_gigs' => $this->buildTopGigs(),
                    'recent_activities' => $this->buildRecentActivities(),
                ],
            ],
        ]);
    }

    // Public homepage stats
    public function publicStats()
    {
        $computeStats = function () {
            return [
                // Backend role remains freelancer for compatibility, UI labels this as business
                'active_businesses' => User::where('role', 'freelancer')
                    ->where(function ($query) {
                        $query->whereNull('is_active')->orWhere('is_active', true);
                    })
                    ->count(),
                'projects_completed' => Order::where('status', 'completed')->count(),
                'projects_live' => Gig::where('is_active', true)->count(),
                'average_rating' => round((float) (Review::avg('rating') ?? 0), 1),
            ];
        };

        try {
            // Use file cache explicitly so missing DB cache table does not break public stats.
            $stats = Cache::store('file')->remember('homepage_public_stats', 300, $computeStats);
        } catch (Throwable $e) {
            report($e);
            $stats = $computeStats();
        }

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }

    // Dashboard overview stats
    public function overview()
    {
        $stats = $this->buildOverviewStats();

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
        return response()->json([
            'success' => true,
            'data' => $this->buildRecentActivities(),
        ]);
    }
}
