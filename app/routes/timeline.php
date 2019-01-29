<?php

/*########## TIMELINE ###############*/

$router->group(['prefix' => 'timeline'], function () use ($router) {

    //Retorna único
    $router->get('/visibility', 'TimelineController@getVisibility');

    //Retorna único
    $router->get('/{id:[0-9]+}', 'TimelineController@get');

    //Retorna lista de timelines
    $router->get('/', 'TimelineController@getAll');
    $router->get('/paged/{paged:[0-9]+}', 'TimelineController@getAll');
    $router->get('/user/{user_id:[0-9]+}[/paged/{paged:[0-9]+}]', 'TimelineController@getUserAll'); //Outros Usuários

    //Adiciona timeline
    $router->post('/', 'TimelineController@add');

    //Adiciona comentários timeline
    $router->post('/{id:[0-9]+}', 'TimelineController@addComment');

    //Adiciona comentários timeline
    $router->post('/comment/{id:[0-9]+}', 'TimelineController@addResponse');

    //Atualiza timeline
    $router->put('/{id:[0-9]+}', 'TimelineController@update');

    //Deleta timeline
    $router->delete('/{id:[0-9]+}', 'TimelineController@delete');

});
