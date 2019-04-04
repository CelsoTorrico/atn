<?php

/*########## Notify ###############*/

$router->group(['prefix' => 'notify'], function () use ($router) {

    //Retorna lista de Notificações
    $router->get('/', 'NotifyController@get');

    //Marcar Notificações como Lida
    $router->put('/', 'NotifyController@update');

    //Aprovar Notificação
    $router->post('/{id:[0-9]+}', 'NotifyController@approve');

    //Deleta Notificação
    $router->delete('/{id:[0-9]+}', 'NotifyController@delete');

});
