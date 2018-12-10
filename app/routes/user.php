<?php 

/** ######## USER ############ */
$router->group(['prefix' => 'user', 'middleware' => 'authentication'], function () use ($router) {
    
    //Retorna
    $router->get('/{id:[0-9]+}', 'UserController@get');

    //Retorna lista de usuários
    $router->get('/', 'UserController@getAll');

    //Retorna usuário logado
    $router->get('/self', 'UserController@getSelf');

    $router->group(['prefix' => 'self'], function() use ($router){
        //INSTITUTE USER
        //Atualizar usuário de posse
        //TODO: Válido apenas para Instituições(Clube, Confederação e Faculdade)
        $router->put('/update/{id:[0-9]+}', 'ClubController@update');
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