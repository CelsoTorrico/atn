<?php 

/** ######## USER ############ */
$router->group(['prefix' => 'user'], function () use ($router) {
    
    //Retorna
    $router->get('/{id:[0-9]+}', 'UserController@get');

    //Retorna lista de usuários
    $router->get('/', 'UserController@getAll');

    //Atualiza usuário
    $router->put('/update', 'UserController@update'); //Para atualizações sem arquivos
    $router->post('/update', 'UserController@update'); //Para atualização de conteúdo de texto

    //Deleta usuário
    $router->delete('/delete', 'UserController@delete');

    //Retorna usuário logado
    $router->get('/self', 'UserController@getSelf');

    //Download de PDF
    $router->get('/pdf', 'UserController@getPdf');

    //Retorna estatisticas do usuário logado
    $router->get('/stats', 'UserController@getStats');

    //Retorna estatisticas do usuário logado
    $router->get('/suggestions', 'UserController@getSuggestions');

    //Reativar usuário de posse
    $router->put('/reactive', 'UserController@reactive');

    //CLUBES e CONFEDERAÇÔES
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

    //LISTAGEM DE CLUBES PARA ALIMENTAR CAMPOS DE CADASTRO
    $router->get('/clubs', 'ClubController@listClubs');

    //LISTAGEM DE ESPORTES PARA ALIMENTAR CAMPOS DE CADASTRO
    $router->get('/sports', 'SportController@getAll');


});