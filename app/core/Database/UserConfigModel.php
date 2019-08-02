<?php

namespace Core\Database;

use aryelgois\Utils;
use aryelgois\Medools;

class UserConfigModel extends Medools\Model
{
    const TABLE = 'userconfig';

    const PRIMARY_KEY = ['ID'];

    const AUTO_INCREMENT = 'ID';

    const COLUMNS = [
        'ID',
        'user_id',
        'config_type',
        'config_value'
    ];

    const FOREIGN_KEYS = [
        'user_id' => [
            UserModel::class,
            'ID'
        ]
    ];

}