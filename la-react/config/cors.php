<?php

return [
    'paths'                => ['*'],
    'allowed_methods'          => ['*'],
    'allowed_origins'          => [
        'https://react-la.onrender.com', // URL ของ frontend
        'http://localhost:5173',
        'http://127.0.0.1:5173',
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers'          => ['*'],
    'exposed_headers'          => [],
    'max_age'                  => 0,
    'supports_credentials'     => true,
];
