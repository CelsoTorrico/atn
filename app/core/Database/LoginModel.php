<?php

namespace Core\Database;

use Core\Database\UserModel;

class LoginModel extends UserModel
{

    const COLUMNS = [
        'id[Int]',
        'user_login',
        'user_pass',
        'user_email',
        'user_status'
    ];

    const READ_ONLY = true;

}