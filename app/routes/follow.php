<?php

/*########## FOLLOW ###############*/

$router->group(['prefix' => 'follow'], function () use ($router) {

    //Começar a seguir
    $router->get('/', 'FollowController@get');

    //Começar a seguir
    $router->get('/{id:[0-9]+}', 'FollowController@add');

    //Bloquear seguidor
    $router->put('/{id:[0-9]+}', 'FollowController@update');

    //Deixar de seguir
    $router->delete('/{id:[0-9]+}', 'FollowController@delete');

});
