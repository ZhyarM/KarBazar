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
        .button {
            display: inline-block;
            padding: 12px 30px;
            background: #F97316;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #666;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to KarBazar! 🎉</h1>
        </div>
        <div class="content">
            <p>Hi {{ $user->name }},</p>
            
            <p>Thank you for joining KarBazar! We're excited to have you as part of our community.</p>
            
            @if($user->role === 'freelancer')
                <p>As a freelancer, you can now:</p>
                <ul>
                    <li>Create gigs and showcase your services</li>
                    <li>Receive orders from clients worldwide</li>
                    <li>Build your reputation with reviews</li>
                    <li>Earn money doing what you love</li>
                </ul>
            @else
                <p>As a client, you can now:</p>
                <ul>
                    <li>Browse thousands of talented freelancers</li>
                    <li>Order services for your projects</li>
                    <li>Track your orders in real-time</li>
                    <li>Leave reviews and build relationships</li>
                </ul>
            @endif
            
            <center>
                <a href="{{ config('app.url') }}" class="button">Get Started</a>
            </center>
            
            <p>If you have any questions, feel free to contact our support team.</p>
            
            <p>Best regards,<br>The KarBazar Team</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} KarBazar. All rights reserved.</p>
        </div>
    </div>
</body>
</html>