<?php

namespace Core\Database;

use Core\Database\UserModel;

class LoginModel extends UserModel
{

    const COLUMNS = [
        'ID',
        'user_login',
        'user_pass',
        'user_email',
        'display_name',
        'user_status',
        'user_activation_key'
    ];

    const READ_ONLY = true;

}