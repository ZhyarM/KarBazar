<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: #2563EB;
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 10px 10px;
        }
        .status-badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: bold;
            margin: 10px 0;
        }
        .status-in_progress {
            background: #3B82F6;
            color: white;
        }
        .status-delivered {
            background: #10B981;
            color: white;
        }
        .status-completed {
            background: #059669;
            color: white;
        }
        .status-cancelled {
            background: #EF4444;
            color: white;
        }
        .button {
            display: inline-block;
            padding: 12px 30px;
            background: #F97316;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📦 Order Status Updated</h1>
        </div>
        <div class="content">
            <p>Hi {{ $order->buyer->name }},</p>
            
            <p>Your order status has been updated!</p>
            
            <p><strong>Order:</strong> {{ $order->gig->title }}</p>
            <p><strong>Seller:</strong> {{ $order->seller->name }}</p>
            <p>
                <strong>Status:</strong><br>
                <span class="status-badge status-{{ $order->status }}">
                    {{ ucfirst(str_replace('_', ' ', $order->status)) }}
                </span>
            </p>
            
            @if($order->status === 'delivered')
                <p>🎉 Your order has been delivered! Please review the delivery and accept it or request revisions.</p>
                @if($order->delivery_note)
                <p><strong>Delivery Note:</strong></p>
                <p>{{ $order->delivery_note }}</p>
                @endif
            @elseif($order->status === 'in_progress')
                <p>⚙️ The freelancer is now working on your order.</p>
            @elseif($order->status === 'completed')
                <p>✅ Your order is complete! Don't forget to leave a review.</p>
            @elseif($order->status === 'cancelled')
                <p>❌ Your order has been cancelled.</p>
            @endif
            
            <center>
                <a href="{{ config('app.url') }}/orders/{{ $order->id }}" class="button">View Order</a>
            </center>
            
            <p>Best regards,<br>The KarBazar Team</p>
        </div>
    </div>
</body>
</html>