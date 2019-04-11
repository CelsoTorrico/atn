<?php

/*########## CHAT ###############*/

$router->group(['prefix' => 'chat'], function () use ($router) {

    //Retorna todas as conversas do usuário
    $router->get('/', 'ChatController@getAllRooms');

    //Retorna mensagens de única room
    $router->get('/{suser_id:[0-9]+}', 'ChatController@get');

    //Retorna id da room baseado em id de usuario
    $router->get('/room/{suser_id:[0-9]+}', 'ChatController@getRoom');

    //Retorna channel da room baseado em id de usuario
    $router->get('/room/channel/{suser_id:[0-9]+}', 'ChatController@getChannel');

    //Retorna últimas mensagens da room
    $router->get('/message/{room_id:[0-9]+}', 'ChatController@getMessage');

    //Adiciona mensagem
    $router->post('/{user_id:[0-9]+}', 'ChatController@addMessage');

    //Deleta timeline
    $router->delete('/message/{id:[0-9]+}', 'ChatController@deleteMessage');

});
