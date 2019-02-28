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

    //Desativar perfil de usuário
    $router->delete('/delete', 'UserController@delete');

    //Retorna usuário logado
    $router->get('/self', 'UserController@getSelf');

    //Retorna usuário logado
    $router->get('/dashboard', 'UserController@getSelfDash');

    //Download de PDF
    $router->get('/pdf[/{id:[0-9]+}]', 'UserController@getPdf');

    //Retorna estatisticas do usuário logado
    $router->get('/stats[/{user_id:[0-9]+}]', 'UserController@getStats');

    //Retorna sugestões de usuários a seguir
    $router->get('/suggestions', 'UserController@getSuggestions');

    //Reativar perfil de usuário
    $router->put('/reactive', 'UserController@reactive');

    //Envia mensagem de e-mail a usuário
    $router->post('/message/{id:[0-9]+}', 'UserController@sendMessage');

    //Faz pesquisas de usuário
    $router->post('/search/paged/{page:[0-9]+}', 'UserController@search');
    $router->post('/search', 'UserController@search');

    //CLUBES e CONFEDERAÇÔES
    $router->group(['prefix' => 'self'], function() use ($router){

        //Atualizar usuário de posse
        $router->get('/club_user[/{id:[0-9]+}]', 'ClubController@getAll');

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