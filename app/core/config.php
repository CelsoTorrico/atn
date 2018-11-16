<?php

//Definindo domínio da aplicação
define('_PATH_', 'http://localhost/desenvolvimento/app-atletasnow-2.0/public'); 

/* DATABASE Connection */ 
define('_HOST_', 'localhost'); //Host
define('_DATABASE_', 'app-atletasnow'); //Database
define('_DB_USER_', 'root'); //User
define('_DB_PASS_', 'root'); //Pass
define('_PREFIX_', 'at_'); //Prefixo de tabelas

/** APIS Sociais */
define('FB', array());
define('LD', array());

/* SMTP Send host */
define('_SMTP_HOST_', 'smtp1.example.com;smtp2.example.com'); // HOST de Envio
define('_USER_EMAIL_', 'user@example.com');   //Email de envio
define('_USER_PASS_', 'secret'); //Password de email
define('_SMTP_SECURE_', 'tls');  //Enable TLS encryption, `ssl` also accepted
define('_PORT_', 587);   //Porta

//define Name_Alerts
define('_ACTIVE_', 'Ativo'); //Password de email
define('_OUT_', 'Expirado');  //Enable TLS encryption, `ssl` also accepted

/* LOCALIZE APPLICATION */
setlocale (LC_ALL, 'pt_BR');
date_default_timezone_set('America/Sao_Paulo');


return [
    'servers' => [
        'default' => [
            // required
            'server' => _HOST_,
            'username' => _DB_USER_,
            'password' => _DB_PASS_,
            'database_type' => 'mysql',

            // [optional]
            'charset' => 'utf8',
            'prefix' => _PREFIX_
        ],
    ],
    'databases' => [
        'default' => [
            'database_name' => _DATABASE_,
        ],
    ],
];