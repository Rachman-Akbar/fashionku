<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'firebase' => [
        'auth_enabled' => env('FIREBASE_AUTH_ENABLED', false),
    ],

    'shipping' => [
        'key' => env('SHIPPING_API_KEY'),
        'base_url' => env('SHIPPING_BASE_URL'),
    ],

    'emailjs' => [
        'enabled' => (bool) env('EMAILJS_ENABLED', false),
        'url' => env('EMAILJS_URL', 'https://api.emailjs.com/api/v1.0/email/send'),
        'service_id' => env('EMAILJS_SERVICE_ID'),
        'template_id' => env('EMAILJS_TEMPLATE_ID'),
        'public_key' => env('EMAILJS_PUBLIC_KEY'),
        'access_token' => env('EMAILJS_ACCESS_TOKEN'),
        'from_email' => env('EMAILJS_FROM_EMAIL', env('MAIL_FROM_ADDRESS')),
        'from_name' => env('EMAILJS_FROM_NAME', env('MAIL_FROM_NAME', 'Fashionku')),
    ],

];
