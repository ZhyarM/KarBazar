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
        .info-box {
            background: white;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
            border: 1px solid #ddd;
        }
        .info-row {
            margin: 10px 0;
        }
        .label {
            font-weight: bold;
            color: #2563EB;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 New Advertisement Request</h1>
        </div>
        <div class="content">
            <p>You have received a new advertisement request on KarBazar.</p>
            
            <div class="info-box">
                <h3>Request Details:</h3>
                
                <div class="info-row">
                    <span class="label">Name:</span> {{ $adRequest->name }}
                </div>
                
                <div class="info-row">
                    <span class="label">Email:</span> {{ $adRequest->email }}
                </div>
                
                @if($adRequest->company_name)
                <div class="info-row">
                    <span class="label">Company:</span> {{ $adRequest->company_name }}
                </div>
                @endif
                
                @if($adRequest->phone)
                <div class="info-row">
                    <span class="label">Phone:</span> {{ $adRequest->phone }}
                </div>
                @endif
                
                <div class="info-row">
                    <span class="label">Ad Type:</span> {{ ucfirst($adRequest->ad_type) }}
                </div>
                
                <div class="info-row">
                    <span class="label">Duration:</span> {{ $adRequest->duration_days }} days
                </div>
                
                @if($adRequest->budget)
                <div class="info-row">
                    <span class="label">Budget:</span> ${{ number_format($adRequest->budget, 2) }}
                </div>
                @endif
                
                <div class="info-row">
                    <span class="label">Message:</span>
                    <p>{{ $adRequest->message }}</p>
                </div>
            </div>
            
            <p>Please review this request and take appropriate action in the admin panel.</p>
            
            <p>Best regards,<br>KarBazar System</p>
        </div>
    </div>
</body>
</html>