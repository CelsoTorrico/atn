<?php 

/** ######## USER ############ */
$router->group(['prefix' => 'user', 'middleware' => 'authentication'], function () use ($router) {
    
    //Retorna
    $router->get('/{id}', 'UserController@get');

});

/** ######## AUTH ############ */

//Post credenciais de login
$router->post('/login', 'LoginController@login');

//Desloga e finaliza sessão
$router->get('/logout', 'LoginController@logout');

//Registrar uma nova conta
$router->post('/register', 'LoginController@register');