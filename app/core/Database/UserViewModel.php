<?php

namespace Core\Database;

use aryelgois\Utils;
use aryelgois\Medools;

class UserViewModel extends Medools\Model
{
    const TABLE = 'userview';

    const PRIMARY_KEY = ['ID'];

    const AUTO_INCREMENT = 'ID';

    const COLUMNS = [
        'ID',
        'to_id',
        'from_id',
        'date'
    ];

    const STAMP_COLUMNS = [
        'date' => 'datetime'
    ];

    const FOREIGN_KEYS = [
        'user_id' => [
            UserModel::class,
            'ID'
        ]
    ];

}