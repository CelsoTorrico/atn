<?php 

/** ######## AUTH ############ */
$router->group(['prefix' => 'login'], function () use ($router) {

    //Post credenciais de login
    $router->post('/', ['as' => 'login', 'uses' => 'LoginController@login']);

    //SOCIAL LOGIN
    $router->get('/{social:facebook|google|authorized}',  'LoginController@socialProvider');

    //Verifica e válida cookie, se autenticação permitir requisição
    $router->get('/cookie', 'LoginController@cookieLogin');

});

/** ####### REGISTER ################# */
$router->group(['prefix' => 'register'], function () use ($router) {

    //Verifica se existe usuário com email
    $router->post('/exist', 'LoginController@isUserExist');

    //Registrar uma nova conta
    $router->post('/', ['as' => 'register', 'uses' => 'LoginController@register']);

});

/** ####### LOGOUT ################# */
$router->get('/logout', 'LoginController@logout');

/** ####### FORGET PASSWORD ################# */
$router->post('/forget-pass', 'LoginController@forgetPassword');

/** ####### CONFIRM EMAIL ################# */
$router->post('/confirm-email', 'LoginController@confirmEmail');


