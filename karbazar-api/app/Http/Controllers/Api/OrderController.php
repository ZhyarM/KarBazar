<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\Gig;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\OrderPlacedEmail;
use App\Mail\OrderStatusUpdatedEmail;
use App\Events\NotificationSent;

class OrderController extends Controller
{
    // Get user's orders
    public function index(Request $request)
    {
        $user = $request->user();
        
        $query = Order::with(['gig.seller.profile', 'buyer.profile', 'seller.profile']);

        // Filter by role
        if ($user->role === 'client' || $request->get('as') === 'buyer') {
            $query->where('buyer_id', $user->id);
        } elseif ($user->role === 'freelancer' || $request->get('as') === 'seller') {
            $query->where('seller_id', $user->id);
        } else {
            // Admin sees all
            $query;
        }

        // Status filter
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $orders = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json([
            'success' => true,
            'data' => OrderResource::collection($orders),
            'meta' => [
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
                'per_page' => $orders->perPage(),
                'total' => $orders->total(),
            ],
        ]);
    }

    // Get single order
    public function show(Request $request, $id)
    {
        $order = Order::with(['gig.seller.profile', 'buyer.profile', 'seller.profile', 'review'])
            ->findOrFail($id);

        // Check authorization
        if ($order->buyer_id !== $request->user()->id && 
            $order->seller_id !== $request->user()->id && 
            $request->user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => new OrderResource($order),
        ]);
    }

    // Create order
    public function store(Request $request)
    {
        $request->validate([
            'gig_id' => 'required|exists:gigs,id',
            'requirements' => 'nullable|string',
        ]);

        $gig = Gig::findOrFail($request->gig_id);

        // Check if user is trying to order their own gig
        if ($gig->seller_id === $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot order your own gig',
            ], 400);
        }

        $order = Order::create([
            'gig_id' => $gig->id,
            'buyer_id' => $request->user()->id,
            'seller_id' => $gig->seller_id,
            'price' => $gig->price,
            'delivery_time' => $gig->delivery_time,
            'requirements' => $request->requirements,
            'status' => 'pending',
        ]);

        // Update gig order count
        $gig->increment('order_count');

        // Create notification for seller
        $notification = Notification::create([
            'user_id' => $gig->seller_id,
            'type' => 'order',
            'title' => 'New Order Received',
            'message' => 'You have received a new order for: ' . $gig->title,
            'link' => '/orders/' . $order->id,
        ]);

        // Broadcast notification in real-time
        broadcast(new NotificationSent($notification));

        // Send email to seller
        Mail::to($gig->seller->email)->send(new OrderPlacedEmail($order->load(['gig', 'buyer', 'seller'])));

        return response()->json([
            'success' => true,
            'message' => 'Order placed successfully',
            'data' => new OrderResource($order->load(['gig', 'buyer.profile', 'seller.profile'])),
        ], 201);
    }

    // Update order status
    public function updateStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $request->validate([
            'status' => 'required|in:pending,in_progress,delivered,revision,completed,cancelled',
            'delivery_note' => 'nullable|string',
            'delivery_files' => 'nullable|array',
        ]);

        // Check authorization
        if ($order->seller_id !== $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Only the seller can update order status',
            ], 403);
        }

        // Store old status for email
        $oldStatus = $order->status;

        $order->update([
            'status' => $request->status,
            'delivery_note' => $request->delivery_note ?? $order->delivery_note,
            'delivery_files' => $request->delivery_files ?? $order->delivery_files,
        ]);

        // If completed, update completed_at
        if ($request->status === 'completed') {
            $order->update(['completed_at' => now()]);
            
            // Update seller's profile stats
            $seller = $order->seller;
            $seller->profile->increment('total_jobs');
            $seller->profile->increment('total_earnings', $order->price);
        }

        // Create notification
        $message = match($request->status) {
            'in_progress' => 'Your order is now in progress',
            'delivered' => 'Your order has been delivered',
            'completed' => 'Your order has been completed',
            'cancelled' => 'Your order has been cancelled',
            default => 'Your order status has been updated',
        };

        $notification = Notification::create([
            'user_id' => $order->buyer_id,
            'type' => 'order',
            'title' => 'Order Status Updated',
            'message' => $message,
            'link' => '/orders/' . $order->id,
        ]);

        // Broadcast notification in real-time
        broadcast(new NotificationSent($notification));

        // Send email to buyer
        Mail::to($order->buyer->email)->send(new OrderStatusUpdatedEmail($order->load(['gig', 'buyer', 'seller']), $oldStatus));

        return response()->json([
            'success' => true,
            'message' => 'Order status updated successfully',
            'data' => new OrderResource($order->load(['gig', 'buyer.profile', 'seller.profile'])),
        ]);
    }

    // Accept delivery (buyer)
    public function acceptDelivery(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        // Check authorization
        if ($order->buyer_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Only the buyer can accept delivery',
            ], 403);
        }

        $order->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);

        // Update stats
        $order->seller->profile->increment('total_jobs');
        $order->seller->profile->increment('total_earnings', $order->price);

        // Notification
        $notification = Notification::create([
            'user_id' => $order->seller_id,
            'type' => 'order',
            'title' => 'Order Completed',
            'message' => 'The buyer has accepted your delivery',
            'link' => '/orders/' . $order->id,
        ]);

        // Broadcast notification in real-time
        broadcast(new NotificationSent($notification));

        return response()->json([
            'success' => true,
            'message' => 'Delivery accepted successfully',
            'data' => new OrderResource($order->load(['gig', 'buyer.profile', 'seller.profile'])),
        ]);
    }

    // Request revision (buyer)
    public function requestRevision(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $request->validate([
            'requirements' => 'required|string',
        ]);

        // Check authorization
        if ($order->buyer_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Only the buyer can request revision',
            ], 403);
        }

        $order->update([
            'status' => 'revision',
            'requirements' => $order->requirements . "\n\n--- REVISION REQUEST ---\n" . $request->requirements,
        ]);

        // Notification
        $notification = Notification::create([
            'user_id' => $order->seller_id,
            'type' => 'order',
            'title' => 'Revision Requested',
            'message' => 'The buyer has requested a revision',
            'link' => '/orders/' . $order->id,
        ]);

        // Broadcast notification in real-time
        broadcast(new NotificationSent($notification));

        return response()->json([
            'success' => true,
            'message' => 'Revision requested successfully',
            'data' => new OrderResource($order->load(['gig', 'buyer.profile', 'seller.profile'])),
        ]);
    }
}