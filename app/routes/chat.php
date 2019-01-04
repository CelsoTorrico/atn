<?php

/*########## CHAT ###############*/

$router->group(['prefix' => 'chat'], function () use ($router) {

    //Retorna único
    $router->get('/', 'ChatController@getAllRooms');

    //Retorna único
    $router->get('/{user_id:[0-9]+}', 'ChatController@get');

    //Retorna últimas mensagens da room
    $router->get('/message/{room_id:[0-9]+}', 'ChatController@getMessage');

    //Adiciona mensagem
    $router->post('/{room_id:[0-9]+}', 'ChatController@addMessage');

    //Deleta timeline
    $router->delete('/message/{id:[0-9]+}', 'ChatController@deleteMessage');

});
