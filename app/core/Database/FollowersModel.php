<?php

namespace Core\Database;

use aryelgois\Utils;
use aryelgois\Medools;

class FollowersModel extends Medools\Model
{
    const TABLE = 'followers';

    const PRIMARY_KEY = ['ID'];

    const AUTO_INCREMENT = 'ID';

    const COLUMNS = [
        'ID',
        'from_id',
        'to_id'
    ];

}