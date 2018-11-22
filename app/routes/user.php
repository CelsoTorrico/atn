<?php 

/** ######## USER ############ */
$router->group(['prefix' => 'user', 'middleware' => 'authentication'], function () use ($router) {
    
    //Retorna
    $router->get('/{id:[0-9]+}', 'UserController@get');

    //Retorna lista de timelines
    $router->get('/', 'UserController@getAll');

    //Adiciona timeline
    $router->post('/', 'UserController@add');

    //Atualiza timeline
    $router->put('/{id:[0-9]+}', 'UserController@update');

    //Deleta timeline
    $router->delete('/{id:[0-9]+}', 'userController@delete');

});