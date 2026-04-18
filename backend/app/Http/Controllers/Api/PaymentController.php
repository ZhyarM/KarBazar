<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Notification;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Stripe\Webhook;

class PaymentController extends Controller
{
    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    // Create payment intent
    public function createPaymentIntent(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
        ]);

        $order = Order::with('gig')->findOrFail($request->order_id);

        // Check if user is the buyer
        if ($order->buyer_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        // Check if order is already paid
        if ($order->payment_status === 'paid') {
            return response()->json([
                'success' => false,
                'message' => 'Order is already paid',
            ], 400);
        }

        try {
            $paymentIntent = PaymentIntent::create([
                'amount' => $order->price * 100, // Convert to cents
                'currency' => 'usd',
                'metadata' => [
                    'order_id' => $order->id,
                    'buyer_id' => $order->buyer_id,
                    'seller_id' => $order->seller_id,
                    'gig_title' => $order->gig->title,
                ],
            ]);

            return response()->json([
                'success' => true,
                'data' => [
                    'client_secret' => $paymentIntent->client_secret,
                    'amount' => $order->price,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Payment failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    // Confirm payment
    public function confirmPayment(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'payment_intent_id' => 'required|string',
        ]);

        $order = Order::findOrFail($request->order_id);

        // Check authorization
        if ($order->buyer_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        try {
            $paymentIntent = PaymentIntent::retrieve($request->payment_intent_id);

            if ($paymentIntent->status === 'succeeded') {
                // Update order
                $order->update([
                    'payment_status' => 'paid',
                    'payment_intent_id' => $request->payment_intent_id,
                    'paid_at' => now(),
                ]);

                // Create notification for seller
                Notification::create([
                    'user_id' => $order->seller_id,
                    'type' => 'payment',
                    'title' => 'Payment Received',
                    'message' => 'You received $' . $order->price . ' for order #' . $order->id,
                    'link' => '/orders/' . $order->id,
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Payment successful',
                    'data' => [
                        'order_id' => $order->id,
                        'amount' => $order->price,
                        'status' => 'paid',
                    ],
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Payment not completed',
            ], 400);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Payment verification failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    // Webhook handler
    public function webhook(Request $request)
    {
        $payload = $request->getContent();
        $sig_header = $request->header('Stripe-Signature');
        $endpoint_secret = config('services.stripe.webhook_secret');

        try {
            $event = Webhook::constructEvent($payload, $sig_header, $endpoint_secret);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Webhook signature verification failed'], 400);
        }

        // Handle the event
        switch ($event->type) {
            case 'payment_intent.succeeded':
                $paymentIntent = $event->data->object;
                
                // Find order by payment intent ID
                $order = Order::where('payment_intent_id', $paymentIntent->id)->first();
                
                if ($order) {
                    $order->update([
                        'payment_status' => 'paid',
                        'paid_at' => now(),
                    ]);
                }
                break;

            case 'payment_intent.payment_failed':
                $paymentIntent = $event->data->object;
                
                $order = Order::where('payment_intent_id', $paymentIntent->id)->first();
                
                if ($order) {
                    $order->update([
                        'payment_status' => 'failed',
                    ]);
                }
                break;
        }

        return response()->json(['status' => 'success']);
    }

    // Get payment methods
    public function paymentMethods(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => [
                'methods' => [
                    'card' => [
                        'enabled' => true,
                        'types' => ['visa', 'mastercard', 'amex'],
                    ],
                    'paypal' => [
                        'enabled' => false,
                    ],
                ],
            ],
        ]);
    }
}