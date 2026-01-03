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
            background: #10B981;
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
        .success-box {
            background: #D1FAE5;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
            border-left: 4px solid #10B981;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✅ Advertisement Request Approved!</h1>
        </div>
        <div class="content">
            <p>Hi {{ $adRequest->name }},</p>
            
            <div class="success-box">
                <p><strong>Great news!</strong> Your advertisement request has been approved.</p>
            </div>
            
            <p>We will contact you shortly with the next steps to proceed with your advertisement.</p>
            
            <p><strong>Request Details:</strong></p>
            <ul>
                <li>Ad Type: {{ ucfirst($adRequest->ad_type) }}</li>
                <li>Duration: {{ $adRequest->duration_days }} days</li>
                @if($adRequest->budget)
                <li>Budget: ${{ number_format($adRequest->budget, 2) }}</li>
                @endif
            </ul>
            
            @if($adRequest->admin_notes)
            <p><strong>Admin Notes:</strong></p>
            <p>{{ $adRequest->admin_notes }}</p>
            @endif
            
            <p>Thank you for choosing KarBazar!</p>
            
            <p>Best regards,<br>The KarBazar Team</p>
        </div>
    </div>
</body>
</html>