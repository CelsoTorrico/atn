<?php 

/** ######## USER ############ */
$router->group(['prefix' => 'user', 'middleware' => 'authentication'], function () use ($router) {
    
    //Retorna
    $router->get('/{id:[0-9]+}', 'UserController@get');

    //Retorna lista de usuários
    $router->get('/', 'UserController@getAll');

    //Retorna usuário logado
    $router->get('/self', 'UserController@getSelf');

    //INSTITUTE
    $router->group(['prefix' => 'self'], function() use ($router){
        
        //Atualizar usuário de posse
        $router->get('/user', 'ClubController@getAll');

        //Atualizar usuário de posse
        $router->get('/user/{id:[0-9]+}', 'ClubController@get');

        //Atualizar usuário de posse
        $router->post('/user', 'ClubController@add');

        //Atualizar usuário de posse
        $router->put('/update/{id:[0-9]+}', 'ClubController@update');

        //Atualizar usuário de posse
        $router->delete('/user/{id:[0-9]+}', 'ClubController@delete');

    });

    //Retorna estatisticas do usuário logado
    $router->get('/stats', 'UserController@getStats');

    //Retorna
    $router->get('/pdf', 'UserController@getPdf');

    //
    $router->put('/update', 'UserController@update');

    //Deleta usuário
    $router->delete('/{id:[0-9]+}', 'userController@delete');

});