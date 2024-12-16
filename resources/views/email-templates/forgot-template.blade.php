<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            max-width: 400px;
            width: 100%;
            text-align: center;
        }
        h2 {
            color: #333;
            font-size: 24px;
            margin-bottom: 10px;
        }
        .message {
            font-size: 16px;
            color: #555;
            margin-bottom: 20px;
            line-height: 1.5;
        }
        .reset-link {
            margin-top: 20px;
        }
        .reset-link a {
            display: inline-block;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            font-weight: bold;
            padding: 10px 20px;
            border-radius: 5px;
            font-size: 16px;
        }
        .reset-link a:hover {
            background-color: #0056b3;
        }
        .footer {
            font-size: 14px;
            color: #888;
            margin-top: 30px;
            line-height: 1.5;
        }
        .footer strong {
            color: #333;
        }
        @media (max-width: 480px) {
            .container {
                padding: 20px;
            }
            h2 {
                font-size: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Hello, {{ $user->username }}</h2>
        <p class="message">
            You recently requested to reset your password for your <strong>TopIt</strong> account. 
            Click the button below to reset it. If you didn't request this, please ignore this email.
        </p>
        <div class="reset-link">
            <a href="{{ $actionLink }}" target="_blank">Reset Password</a>
        </div>
        <p class="footer">
            If you have any questions, feel free to contact our support team.
            <br><br>
            - From <strong>TopIt</strong>
        </p>
    </div>
</body>
</html>
