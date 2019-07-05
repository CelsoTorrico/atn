<?php 
/**  
*  Exportar Relatório de Membros
*  @since 2.1
*/
$router->group(['prefix' => 'report'], function () use ($router) {
    
    //Retorna
    $router->post('/', 'ReportController@get');

    //Retorna
    $router->post('/report.xlsx', 'ReportController@getFile');

    //Retorna
    $router->post('/report.pdf', 'ReportController@getFile');

});