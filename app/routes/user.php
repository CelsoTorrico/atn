<?php 

/** ######## USER ############ */
$router->group(['prefix' => 'user'], function () use ($router) {
    
    //Retorna
    $router->get('/{id:[0-9]+}', 'UserController@get');

    //Retorna lista de usuários
    $router->get('/', 'UserController@getAll');

    //Retorna usuário logado
    $router->get('/self', 'UserController@getSelf');

    //INSTITUTE
    $router->group(['prefix' => 'self'], function() use ($router){

        //Atualizar usuário de posse
        $router->get('/club_user', 'ClubController@getAll');

        //Atualizar usuário de posse
        $router->post('/club_user', 'ClubController@addClubUser');

        //Atualizar usuário de posse
        $router->put('/club_user/{id:[0-9]+}', 'ClubController@updateUser');

        //Deletar usuário de posse
        $router->delete('/club_user/{id:[0-9]+}', 'ClubController@deleteUser');

        //Reativar usuário de posse
        $router->put('/club_user/active/{id:[0-9]+}', 'ClubController@activeUser');

    });

    //Retorna estatisticas do usuário logado
    $router->get('/stats', 'UserController@getStats');

    //Retorna
    $router->get('/pdf', 'UserController@getPdf');

    //
    $router->put('/update', 'UserController@update');

    //Deleta usuário
    $router->delete('/delete', 'UserController@delete');

    //Reativar usuário de posse
    $router->put('/reactive', 'UserController@reactive');

});