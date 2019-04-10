<?php

namespace Core\Database;

use aryelgois\Utils;
use aryelgois\Medools;

class VisibilityModel extends Medools\Model
{
    const TABLE = 'visibility';

    const PRIMARY_KEY = ['ID'];

    const AUTO_INCREMENT = 'ID';

    const COLUMNS = [
        'ID',
        'visibility'
    ];

    const READ_ONLY = true;
}