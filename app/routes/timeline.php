<?php

/*########## TIMELINE ###############*/

$router->group(['prefix' => 'timeline', 'middleware' => 'authentication'], function () use ($router) {

    //Retorna único
    $router->get('/{id:[0-9]+}', 'TimelineController@get');

    //Retorna lista de timelines
    $router->get('/', 'TimelineController@getAll');

    //Adiciona timeline
    $router->post('/', 'TimelineController@add');

    //Atualiza timeline
    $router->put('/{id:[0-9]+}', 'TimelineController@update');

    //Deleta timeline
    $router->delete('/{id:[0-9]+}', 'TimelineController@delete');

});
