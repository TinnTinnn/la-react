<?php

return [
    'paths'                => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods'      => ['*'],
    'allowed_origins'      => [
        'https://react-la.onrender.com', // URL ของ frontend
    ],
    'allowed_headers'      => ['*'],
    'exposed_headers'      => [],
    'max_age'              => 0,
    'supports_credentials' => true,
];
