<?php

/*########## LEARN / APRENDA ###############*/

$router->group(['prefix' => 'learn'], function () use ($router) {

    //Retorna único
    $router->get('/visibility', 'LearnController@getVisibility');

    //Retorna único
    $router->get('/{id:[0-9]+}', 'LearnController@get');

    //Retorna lista de Learns
    $router->get('/', 'LearnController@getAll');

    //Adiciona Learn
    $router->post('/', 'LearnController@add');

    //Adiciona comentários Learn
    $router->post('/{id:[0-9]+}', 'LearnController@addComment');

    //Adiciona comentários Learn
    $router->post('/comment/{id:[0-9]+}', 'LearnController@addResponse');

    //Atualiza Learn
    $router->put('/{id:[0-9]+}', 'LearnController@update');

    //Deleta Learn
    $router->delete('/{id:[0-9]+}', 'LearnController@delete');

});
