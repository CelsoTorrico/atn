<?php

namespace Core\Database;

use aryelgois\Utils;
use aryelgois\Medools;

class ChatRoomModel extends Medools\Model
{
    const TABLE = 'rooms';

    const PRIMARY_KEY = ['room_id'];

    const AUTO_INCREMENT = 'room_id';

    const COLUMNS = [
        'room_id',
        'fuser',
        'suser',
        'created_date',
        'last_update'
    ];

    const OPTIONAL_COLUMNS = [
        ''
    ];

    const STAMP_COLUMNS = [
        'created_date' => 'datetime',
        'last_update' => 'datetime'
    ];

    const FOREIGN_KEYS = [
        'suser' => [
            UserModel::class,
            'ID'
        ]
    ];

}