<?php 

/** ######## AUTH ############ */
$router->group(['prefix' => 'login'], function () use ($router) {

    //Post credenciais de login
    $router->post('/', 'LoginController@login');

    //SOCIAL LOGIN
    $router->get('/{social:facebook|google|authorized}',  'LoginController@socialProvider');

});

/** ####### REGISTER ################# */
$router->group(['prefix' => 'register'], function () use ($router) {

    //Verifica se existe usuário com email
    $router->post('/exist', 'LoginController@isUserExist');

    //Registrar uma nova conta
    $router->post('/', 'LoginController@register');

});

/** ####### LOGOUT ################# */
$router->get('/logout', 'LoginController@logout');

/** ####### FORGET PASSWORD ################# */
$router->post('/forget-pass', 'LoginController@forgetPassword');


