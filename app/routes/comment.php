<?php

/*########## COMMENT ###############*/

$router->group(['prefix' => 'comment'], function () use ($router) {

    //Adiciona comentários timeline
    // id = id da timeline
    $router->post('/{id:[0-9]+}', 'TimelineController@addComment');

    //Adiciona comentários timeline
    // id = id da timeline
    $router->post('/response/{id:[0-9]+}', 'TimelineController@addResponse');

    //Deleta comentário
    // id = id do comentário
    $router->delete('/{id:[0-9]+}', 'TimelineController@deleteComment');

});
