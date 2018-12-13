<?php
use Illuminate\Support\Str;
/* LOCALIZE APPLICATION */
setlocale (LC_ALL, 'pt_BR');
date_default_timezone_set('America/Sao_Paulo');

return [
    'servers' => [
        'default' => [
            // required
            'server' => env('HOST'),
            'username' =>env('DB_USER'),
            'password' => env('DB_PASS'),
            'database_type' => env('DB_TYPE'),

            // [optional]
            'charset' => 'utf8',
            'prefix' => env('PREFIX')
        ],
    ],
    'databases' => [
        'default' => [
            'database_name' => env('DATABASE'),
        ],
    ],
];