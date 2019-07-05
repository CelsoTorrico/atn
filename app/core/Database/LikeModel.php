<?php

namespace Core\Database;

use aryelgois\Utils;
use aryelgois\Medools;

class LikeModel extends Medools\Model
{
    const TABLE = 'likes';

    const PRIMARY_KEY = ['ID'];

    const AUTO_INCREMENT = 'ID';

    const COLUMNS = [
        'ID',
        'from_id',
        'post_id',
        'date'
    ];

    const STAMP_COLUMNS = [
        'date' => 'datetime'
    ];

    const FOREIGN_KEYS = [
        'from_id' => [
            UserModel::class,
            'ID'
        ],
        'post_id' => [
            PostModel::class,
            'ID'
        ]
    ];

}