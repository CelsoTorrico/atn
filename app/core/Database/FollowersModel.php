<?php

namespace Core\Database;

use aryelgois\Utils;
use aryelgois\Medools;

class FollowersModel extends Medools\Model
{
    const TABLE = 'followers';

    const PRIMARY_KEY = ['ID'];

    const AUTO_INCREMENT = 'ID';

    const COLUMNS = [
        'ID',
        'from_id',
        'to_id',
        'has_block',
        'date'
    ];

    const STAMP_COLUMNS = [
        'date' => 'datetime'
    ];

    const OPTIONAL_COLUMNS = [
        'has_block'
    ];

    const FOREIGN_KEYS = [
        'to_id' => [
            UserModel::class,
            'ID'
        ]
    ];

}