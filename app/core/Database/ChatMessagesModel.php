<?php

namespace Core\Database;

use aryelgois\Utils;
use aryelgois\Medools;

class ChatMessagesModel extends Medools\Model
{
    const TABLE = 'room_messages';

    const PRIMARY_KEY = ['message_id'];

    const AUTO_INCREMENT = 'message_id';

    const COLUMNS = [
        'message_id',
        'room_id',
        'date',
        'content',
        'author_id',
        'read'
    ];

    const OPTIONAL_COLUMNS = [
        'read'
    ];

    const STAMP_COLUMNS = [
        'date' => 'datetime'
    ];

    const SOFT_DELETE = 'read';

    const SOFT_DELETE_MODE = 'deleted';

}