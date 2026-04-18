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
        .order-box {
            background: white;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
            border: 1px solid #ddd;
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
            <h1>🎉 New Order Received!</h1>
        </div>
        <div class="content">
            <p>Hi {{ $order->seller->name }},</p>
            
            <p>Great news! You have received a new order.</p>
            
            <div class="order-box">
                <h3>Order Details:</h3>
                <p><strong>Order ID:</strong> #{{ $order->id }}</p>
                <p><strong>Gig:</strong> {{ $order->gig->title }}</p>
                <p><strong>Buyer:</strong> {{ $order->buyer->name }}</p>
                <p><strong>Price:</strong> ${{ $order->price }}</p>
                <p><strong>Delivery Time:</strong> {{ $order->delivery_time }} days</p>
                @if($order->requirements)
                <p><strong>Requirements:</strong></p>
                <p>{{ $order->requirements }}</p>
                @endif
            </div>
            
            <center>
                <a href="{{ config('app.url') }}/orders/{{ $order->id }}" class="button">View Order</a>
            </center>
            
            <p>Please review the requirements and start working on this order.</p>
            
            <p>Best regards,<br>The KarBazar Team</p>
        </div>
    </div>
</body>
</html>