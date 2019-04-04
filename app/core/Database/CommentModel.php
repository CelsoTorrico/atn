<?php

namespace Core\Database;

use aryelgois\Utils;
use aryelgois\Medools;

class CommentModel extends Medools\Model
{
    const TABLE = 'comments';

    const PRIMARY_KEY = ['comment_ID'];

    const AUTO_INCREMENT = 'comment_ID';

    const COLUMNS = [
        'comment_ID',
        'comment_post_ID',
        'comment_author',
        'comment_date',
        'comment_content',
        'user_id',
        'comment_parent',
        'comment_status'
    ];

    const OPTIONAL_COLUMNS = [
        'comment_parent'
    ];

    const STAMP_COLUMNS = [
        'comment_date' => 'datetime'
    ];

    const FOREIGN_KEY = [
        'comment_post_ID' => [
            'Core\Database\PostModel',
            'ID'
        ]
    ];

    const SOFT_DELETE = 'comment_status';

    const SOFT_DELETE_MODE = 'deleted';

}