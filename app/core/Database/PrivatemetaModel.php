<?php

namespace Core\Database;

use aryelgois\Utils;
use aryelgois\Medools;

class PrivatemetaModel extends Medools\Model
{
    const TABLE = 'usertype';

    const PRIMARY_KEY = ['ID'];

    const AUTO_INCREMENT = 'ID';

    const COLUMNS = [
        'ID',
        'usertype',
        'meta_key',
        'meta_value'
    ];

    /*const FOREIGN_KEY = [
        'usertype' => [
            'Core\Database\UserModel',
            'ID'
        ]
    ];*/

}