<?php

namespace Core\Database;

use aryelgois\Utils;
use aryelgois\Medools;

class ClubModel extends Medools\Model
{
    const TABLE = 'clubs';

    const PRIMARY_KEY = ['ID'];

    const AUTO_INCREMENT = 'ID';

    const COLUMNS = [
        'ID',
        'user_id',
        'club_name'
    ];

    const READ_ONLY = true;
}