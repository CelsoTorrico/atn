<?php

namespace Core\Database;

use aryelgois\Utils;
use aryelgois\Medools;

class UserModel extends Medools\Model
{
    const TABLE = 'users';

    const PRIMARY_KEY = ['ID'];

    const AUTO_INCREMENT = 'ID';

    const COLUMNS = [
        'ID',
        'user_login',
        'user_pass',
        'user_email',
        'display_name',
        'user_registered'
    ];

    const OPTIONAL_COLUMNS = [
        'user_nicename',
        'user_url',
        'user_activation_key',
        'user_status'
    ];

    const STAMP_COLUMNS = [
        'user_registered' => 'datetime'
    ];

}