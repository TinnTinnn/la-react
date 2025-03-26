<?php

return [
    'paths'                    => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods'          => ['*'],
    'allowed_origins'          => [
        'https://react-la.onrender.com', // URL ของ frontend
        'http://localhost:5173',         // เพิ่มบรรทัดนี้
        'http://127.0.0.1:5173',         // เพิ่มบรรทัดนี้
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers'          => ['*'],
    'exposed_headers'          => [],
    'max_age'                  => 0,
    'supports_credentials'     => true,
];
