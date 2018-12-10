<?php
/** Login Social Credentials */
return [
    'services' => [
        'facebook' => [
            'client_id' => env('FACEBOOK_API_ID'),
            'client_secret' => env('FACEBOOK_API_SECRET'),
            'redirect' => '/login/facebook/authorized',
        ],
        'google' => [
            'client_id' => env('GOOGLE_API_ID'),
            'client_secret' => env('GOOGLE_API_SECRET'),
            'redirect' => '/login/google/authorized',
        ]
    ]
];