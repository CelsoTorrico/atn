<?php

namespace Core\Database;

use aryelgois\Utils;
use aryelgois\Medools;

class UsertypeModel extends Medools\Model
{
    const TABLE = 'usertype';

    const PRIMARY_KEY = ['ID'];

    const AUTO_INCREMENT = 'ID';

    const COLUMNS = [
        'ID',
        'type'
    ];

    const READ_ONLY = true;
}