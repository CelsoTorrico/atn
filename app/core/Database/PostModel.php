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
        'post_title',
        'post_excerpt',
        'post_status'
    ];

    const OPTIONAL_COLUMNS = [
        'post_parent',
        'post_mime_type',
        'guid',
        'post_title',
        'post_excerpt'
    ];

    const STAMP_COLUMNS = [
        'post_date' => 'datetime',
        'post_modified' => 'datetime'
    ];

    const FOREIGN_KEYS = [
        'post_id' => [
            PostmetaModel::class,
            'meta_id'
        ]
    ];

    const SOFT_DELETE = 'post_status';

    const SOFT_DELETE_MODE = 'deleted';

}