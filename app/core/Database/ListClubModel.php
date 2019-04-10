<?php

namespace Core\Database;

use aryelgois\Utils;
use aryelgois\Medools;

class ListClubModel extends UsermetaModel
{
    const COLUMNS = [
        'umeta_id',
        'user_id',
        'meta_key',
        'meta_value'
    ];

    const FOREIGN_KEYS = [
        'user_id' => [
            'Core\Database\UserModel',
            'ID'
        ]
    ];

    const READ_ONLY = true;
}