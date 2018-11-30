<?php 

/** ######## USER ############ */
$router->group(['prefix' => 'user', 'middleware' => 'authentication'], function () use ($router) {
    
    //Retorna
    $router->get('/{id:[0-9]+}', 'UserController@get');

    //Retorna
    $router->get('/pdf/{id:[0-9]+}', 'UserController@getPdf');

    //Retorna lista de usuários
    $router->get('/', 'UserController@getAll');

    //Retorna usuário logado
    $router->get('/self', 'UserController@getSelf');

    //Atualizar usuário de posse
    //TODO: Válido apenas para Instituições(Clube, Confederação e Faculdade)
    $router->put('/update/{id:[0-9]+}', 'UserController@updateUser');

    $router->put('/update', 'UserController@update');

    //Deleta usuário
    $router->delete('/{id:[0-9]+}', 'userController@delete');

});