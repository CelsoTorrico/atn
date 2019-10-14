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

    //Retorna dashboard(dados basicos) do usuário logado
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

    /**
     * Faz login na plataforma Affinibox
     * @version v2.2 - Criado
     */
    $router->get('/benefits', 'UserController@loginBenefits');

    //CLUBES e CONFEDERAÇÔES
    $router->group(['prefix' => 'self'], function() use ($router){
        
        /**
         *  Listar membros da instituição
         *  @version v2.1 - Alterado o método para POST para suportar filtragem 
         */        
        //$router->get('/club_user[/{id:[0-9]+}]', 'ClubController@getAll');
        $router->get('/club_user/{id:[0-9]+}[/paged/{page_number:[0-9]+}]', 'ClubController@getAll');
        $router->post('/club_user/search[/paged/{id:[0-9]+}]', 'ClubController@getAll');

        //Adicionar usuário de posse
        $router->post('/club_user', 'ClubController@addClubUser');

        //Atualizar usuário de posse
        $router->put('/club_user/{id:[0-9]+}', 'ClubController@updateUser');

        //Deletar usuário de posse
        $router->delete('/club_user/{user_id:[0-9]+}', 'ClubController@deleteUser');

        //Reativar usuário de posse
        $router->put('/club_user/active/{id:[0-9]+}', 'ClubController@activeUser');         

    });

    /** CONFIGURAÇÕES
     *  Registrar configurações do usuário
     *  @since v2.1 - Criado
     *  @todo: Implementar
     */ 
    $router->group(['prefix' => 'settings'], function() use ($router){
               
        //Autorizar notificação push
        $router->post('/push-authorize', 'UserController@setPushSettings');

        //Desautorizar notificação push
        $router->post('/push-disauthorize', 'UserController@unsetPushSettings');

        //Retorna usuário logado
        $router->put('/update-password', 'UserController@setPassword');

    });

    /** MEMBROS
     *  Setar como membro da instituição
     *  @since v2.1 - Criado
     *  @todo: Implementar
     */ 
    $router->group(['prefix' => 'add_team'], function() use ($router){
               
        //Define usuário como integreante da instituição
        $router->get('/{user_id:[0-9]+}', 'ClubController@setToTeam');

    });

    //LISTAGEM DE CLUBES PARA ALIMENTAR CAMPOS DE CADASTRO
    $router->get('/clubs', 'ClubController@listClubs');

    //LISTAGEM DE ESPORTES PARA ALIMENTAR CAMPOS DE CADASTRO
    $router->get('/sports', 'SportController@getAll');

    //LISTAGEM DE ESPORTES PARA ALIMENTAR CAMPOS DE CADASTRO
    $router->get('/sport-stats', 'SportController@getSportStats');


});