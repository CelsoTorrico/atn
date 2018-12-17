<?php

namespace Core\Database;

use aryelgois\Utils;
use aryelgois\Medools;

class NotifyModel extends Medools\Model
{
    const TABLE = 'notifications';

    const PRIMARY_KEY = ['ID'];

    const AUTO_INCREMENT = 'ID';

    const COLUMNS = [
        'ID',
        'type',
        'approve',
        'read',
        'user_id',
        'from_id',
        'date'
    ];

    const OPTIONAL_COLUMNS = [
        'approve',
        'read'
    ];

    const STAMP_COLUMNS = [
        'date' => 'datetime',
    ];

    const SOFT_DELETE = 'read';

    const SOFT_DELETE_MODE = 'deleted';

}