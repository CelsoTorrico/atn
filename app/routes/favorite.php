<?php

/*########## FAVORITE ###############*/

$router->group(['prefix' => 'favorite'], function () use ($router) {

    //Começar a seguir
    $router->get('/', 'FavoriteController@get');

    //Começar a seguir
    $router->get('/{id:[0-9]+}', 'FavoriteController@add');

});
