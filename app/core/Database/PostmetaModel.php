<?php

namespace Core\Database;

use aryelgois\Utils;
use aryelgois\Medools;

class PostmetaModel extends Medools\Model
{
    const TABLE = 'postmeta';

    const PRIMARY_KEY = ['meta_id'];

    const AUTO_INCREMENT = 'meta_id';

    const COLUMNS = [
        'meta_id',
        'post_id',
        'meta_key',
        'meta_value'
    ];

    const FOREIGN_KEY = [
        'post_id' => [
            'Core\Database\PostModel',
            'ID'
        ]
    ];

}