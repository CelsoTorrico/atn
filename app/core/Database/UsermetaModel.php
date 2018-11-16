<?php

namespace Core\Database;

use aryelgois\Utils;
use aryelgois\Medools;

class UsermetaModel extends Medools\Model
{
    const TABLE = 'usermeta';

    const PRIMARY_KEY = ['umeta_id'];

    const AUTO_INCREMENT = 'umeta_id';

    const COLUMNS = [
        'umeta_id',
        'user_id',
        'meta_key',
        'meta_value'
    ];

}