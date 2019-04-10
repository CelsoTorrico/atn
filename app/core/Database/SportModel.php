<?php

namespace Core\Database;

use aryelgois\Utils;
use aryelgois\Medools;

class SportModel extends Medools\Model
{
    const TABLE = 'sports';

    const PRIMARY_KEY = ['ID'];

    const AUTO_INCREMENT = 'ID';

    const COLUMNS = [
        'ID',
        'sport_name'
    ];
}