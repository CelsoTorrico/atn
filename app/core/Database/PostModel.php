<?php

namespace Core\Database;

use aryelgois\Utils;
use aryelgois\Medools;

class PostModel extends Medools\Model
{
    const TABLE = 'posts';

    const PRIMARY_KEY = ['ID'];

    const AUTO_INCREMENT = 'ID';

    const COLUMNS = [
        'ID',
        'post_author',
        'post_date',
        'post_modified',
        'post_content',
        'post_type',
        'guid',
        'post_mime_type',
        'post_parent',
    ];

    const OPTIONAL_COLUMNS = [
        'post_title',
        'post_parent',
        'post_mime_type',
        'guid'
    ];

    const STAMP_COLUMNS = [
        'post_date' => 'datetime',
        'post_modified' => 'auto'
    ];

    const FOREIGN_KEY = [
        'ID' => [
            'Core\Database\PostmetaModel',
            'post_id'
        ]
    ];

}