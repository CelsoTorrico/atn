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
        'comment_parent'
    ];

    const OPTIONAL_COLUMNS = [
        'comment_parent'
    ];

    const STAMP_COLUMNS = [
        'comment_date' => 'datetime'
    ];

}