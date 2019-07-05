<?php

namespace Core\Database;

use aryelgois\Utils;
use aryelgois\Medools;

class FavoriteModel extends Medools\Model
{
    const TABLE = 'favorites';

    const PRIMARY_KEY = ['ID'];

    const AUTO_INCREMENT = 'ID';

    const COLUMNS = [
        'ID',
        'from_id',
        'to_id',
        'date'
    ];

    const STAMP_COLUMNS = [
        'date' => 'datetime'
    ];

    const FOREIGN_KEYS = [
        'to_id' => [
            UserModel::class,
            'ID'
        ]
    ];

}