<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\GigController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\UploadController;
use App\Http\Controllers\Api\AnalyticsController;
use App\Http\Controllers\Api\PaymentController;
use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Public categories
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);

// Public gigs browsing
Route::get('/gigs', [GigController::class, 'index']);
Route::get('/gigs/{id}', [GigController::class, 'show'])->where('id', '[0-9]+'); // Only numeric IDs

// Public profiles
Route::get('/profiles/freelancers', [ProfileController::class, 'freelancers']);
Route::get('/profiles/{username}', [ProfileController::class, 'show']);

// Public reviews
Route::get('/reviews/gig/{gigId}', [ReviewController::class, 'gigReviews']);
Route::get('/reviews/user/{userId}', [ReviewController::class, 'userReviews']);

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    
    // Auth
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });

    // Profile
    Route::prefix('profile')->group(function () {
        Route::get('/me', [ProfileController::class, 'me']);
        Route::put('/update', [ProfileController::class, 'update']);
    });

    // Categories (Admin only) ⭐ NOW PROTECTED
    Route::middleware('admin')->prefix('categories')->group(function () {
        Route::post('/', [CategoryController::class, 'store']);
        Route::put('/{id}', [CategoryController::class, 'update']);
        Route::delete('/{id}', [CategoryController::class, 'destroy']);
    });

    // Gigs (Protected Routes)
    Route::prefix('gigs')->group(function () {
        // Get my gigs (MUST come before {id} route)
        Route::get('/my-gigs', [GigController::class, 'myGigs']);
        
        // Only freelancers can create gigs ⭐ NOW PROTECTED
        Route::middleware('freelancer')->post('/', [GigController::class, 'store']);
        
        Route::put('/{id}', [GigController::class, 'update']);
        Route::delete('/{id}', [GigController::class, 'destroy']);
    });

    // Orders
    Route::prefix('orders')->group(function () {
        Route::get('/', [OrderController::class, 'index']);
        Route::get('/{id}', [OrderController::class, 'show']);
        Route::post('/', [OrderController::class, 'store']);
        Route::put('/{id}/status', [OrderController::class, 'updateStatus']);
        Route::put('/{id}/accept', [OrderController::class, 'acceptDelivery']);
        Route::put('/{id}/revision', [OrderController::class, 'requestRevision']);
    });

    // Reviews
    Route::prefix('reviews')->group(function () {
        Route::post('/', [ReviewController::class, 'store']);
        Route::put('/{id}', [ReviewController::class, 'update']);
        Route::delete('/{id}', [ReviewController::class, 'destroy']);
    });

    // Messages
    Route::prefix('messages')->group(function () {
        Route::get('/conversations', [MessageController::class, 'conversations']);
        Route::get('/{userId}', [MessageController::class, 'messages']);
        Route::post('/', [MessageController::class, 'store']);
        Route::put('/{id}/read', [MessageController::class, 'markAsRead']);
        Route::delete('/{id}', [MessageController::class, 'destroy']);
    });

    // Notifications
    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::get('/unread-count', [NotificationController::class, 'unreadCount']);
        Route::put('/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::put('/mark-all-read', [NotificationController::class, 'markAllAsRead']);
        Route::delete('/{id}', [NotificationController::class, 'destroy']);
        Route::delete('/clear-all', [NotificationController::class, 'clearAll']);
    });


    // Favorites
    Route::prefix('favorites')->group(function () {
        Route::get('/gigs', [FavoriteController::class, 'favoriteGigs']);
        Route::get('/freelancers', [FavoriteController::class, 'favoriteFreelancers']);
        Route::post('/gigs/{gigId}', [FavoriteController::class, 'toggleGigFavorite']);
        Route::post('/freelancers/{userId}', [FavoriteController::class, 'toggleFreelancerFavorite']);
        Route::get('/gigs/{gigId}/check', [FavoriteController::class, 'checkGigFavorite']);
        Route::get('/freelancers/{userId}/check', [FavoriteController::class, 'checkFreelancerFavorite']);
    });

    // File Uploads
    Route::prefix('upload')->group(function () {
        Route::post('/profile-picture', [UploadController::class, 'uploadProfilePicture']);
        Route::post('/cover-photo', [UploadController::class, 'uploadCoverPhoto']);
        Route::post('/gig-image', [UploadController::class, 'uploadGigImage']);
        Route::post('/gig-gallery', [UploadController::class, 'uploadGigGallery']);
        Route::post('/delivery-files', [UploadController::class, 'uploadDeliveryFiles']);
        Route::post('/message-attachment', [UploadController::class, 'uploadMessageAttachment']);
        Route::delete('/delete-file', [UploadController::class, 'deleteFile']);
    });

    // Analytics (Admin only)
    Route::middleware('admin')->prefix('analytics')->group(function () {
        Route::get('/overview', [AnalyticsController::class, 'overview']);
        Route::get('/revenue-chart', [AnalyticsController::class, 'revenueChart']);
        Route::get('/orders-chart', [AnalyticsController::class, 'ordersChart']);
        Route::get('/top-freelancers', [AnalyticsController::class, 'topFreelancers']);
        Route::get('/top-gigs', [AnalyticsController::class, 'topGigs']);
        Route::get('/category-stats', [AnalyticsController::class, 'categoryStats']);
        Route::get('/recent-activities', [AnalyticsController::class, 'recentActivities']);
    });

    // Payments
    Route::prefix('payments')->group(function () {
        Route::post('/create-intent', [PaymentController::class, 'createPaymentIntent']);
        Route::post('/confirm', [PaymentController::class, 'confirmPayment']);
        Route::get('/methods', [PaymentController::class, 'paymentMethods']);
    });

    // Webhook (outside auth middleware - at the bottom of file)
    Route::post('/webhook/stripe', [PaymentController::class, 'webhook']);

    // Broadcasting authentication
    Broadcast::routes(['middleware' => ['auth:sanctum']]);
});