<?php

namespace Core\Database;

use aryelgois\Utils;
use aryelgois\Medools;

class PrivatemetaModel extends Medools\Model
{
    const TABLE = 'privatemeta';

    const PRIMARY_KEY = ['ID'];

    const AUTO_INCREMENT = 'ID';

    const COLUMNS = [
        'ID',
        'usertype',
        'meta_key',
        'meta_value'
    ];

    const FOREIGN_KEYS = [
        'usertype' => [
            UserModel::class,
            'ID'
        ]
    ];

}