<?php

/*########## Notify ###############*/

$router->group(['prefix' => 'notify'], function () use ($router) {

    //Retorna único
    $router->get('/{id:[0-9]+}', 'NotifyController@get');

    //Retorna lista de Notifys
    $router->get('/', 'NotifyController@getAll');

    //Adiciona Notify
    $router->post('/', 'NotifyController@add');

    //Deleta Notify
    $router->delete('/{id:[0-9]+}', 'NotifyController@delete');

    //Adiciona comentários Notify
    $router->post('/approve/{id:[0-9]+}', 'NotifyController@approve');

});
