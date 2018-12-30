<?php 

/** ######## AUTH ############ */
$router->group(['prefix' => 'login'], function () use ($router) {

    //Post credenciais de login
    $router->post('/', 'LoginController@login');

    //SOCIAL LOGIN
    $router->group(['prefix' => 'facebook'], function() use ($router) {
        $router->get('/',  'LoginController@facebookProvider');
        $router->get('/authorized',  'LoginController@socialCallback');
    }); //facebook

    $router->group(['prefix' => 'google'], function() use ($router) {
        $router->get('/',  'LoginController@googleProvider');
        $router->get('/authorized',  'LoginController@socialCallback');
    }); //google

});

/** ####### REGISTER ################# */
$router->group(['prefix' => 'register'], function () use ($router) {

    //Registrar uma nova conta
    $router->post('/', 'LoginController@register');

});

//Desloga e finaliza sessão
$router->get('/logout', 'LoginController@logout');