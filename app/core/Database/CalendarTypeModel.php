<?php

namespace Core\Database;

use aryelgois\Utils;
use aryelgois\Medools;

class CalendarTypeModel extends Medools\Model
{
    const TABLE = 'calendartype';

    const PRIMARY_KEY = ['ID'];

    const AUTO_INCREMENT = 'ID';

    const COLUMNS = [
        'ID',
        'type'
    ];

    const READ_ONLY = true;
}