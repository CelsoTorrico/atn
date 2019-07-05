<?php

/*########## Calendar / Calendário ###############*/

$router->group(['prefix' => 'calendar'], function () use ($router) {

    //Retorna único
    $router->get('/{id:[0-9]+}', 'CalendarController@get');

    $router->get('/types', 'CalendarController@getTypes');

    //Retorna lista de calendários
    $router->get('/[paged[/{paged:[0-9]+}]]', 'CalendarController@getAll');
    $router->get('/', 'CalendarController@getAll');

    //Adicionar Calendário
    $router->post('/', 'CalendarController@add');

    //Atualizar Calendário
    $router->put('/{id:[0-9]+}',  'CalendarController@update');
    $router->post('/{id:[0-9]+}', 'CalendarController@update');

    //Deletar Calendário
    $router->delete('/{id:[0-9]+}', 'CalendarController@delete');

});
