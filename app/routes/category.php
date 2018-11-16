<?php

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use Slim\Http\UploadedFile as UploadedFile;

/* ########## CATEGORY ROUTES ###############*/

//Retorna um modelo baseado num id
$router->get('/model/{id}', function (Request $request, Response $response) {
    $id  = $request->getAttribute('id');
    return $response->withJson($this->model->getModel( $this->user, $id ));
});

//Retorna um modelo baseado num id
$router->put('/model/{id}', function (Request $request, Response $response) {
    $id  = $request->getAttribute('id');
    $data = $request->getParsedBody();
    return $response->withJson($this->model->updateModel( $this->user, $id, $data ));
});

//Retorna lista de modelos baseados em ordenação
$router->get('/model/[/{order}[/{by}]]', function (Request $request, Response $response, $args){
    $order = [
        'order' => ($request->getAttribute('order')) ? $request->getAttribute('order') : 'date_created',
        'by'    => ($request->getAttribute('by'))? $request->getAttribute('by') : 'DESC',
    ];
    return $response->withJson($this->model->getListModels( $this->user, $order ));

})->setName('models');

$router->get('/model/fields/{wichData}', function (Request $request, Response $response, $args){
    
    $wichData = $request->getAttribute('wichData');
    return $response->withJson($this->model->getProjectFields( $this->user, $wichData ));  

})->setName('models');

//Retorna lista de modelos para determinado plano
$router->get('/model/plan/{id}', function (Request $request, Response $response, $args){
    
    $id  = $request->getAttribute('id');
    $response = $response->withJson($this->model->getProjectDataExistActivity( $this->user, $id ));
    return $response;

})->setName('models');

//Adiciona um modelo
$router->post('/model', function (Request $request, Response $response) {
    
    $data = $request->getParsedBody(); //Retorna os dados serializado em array

    $result = $this->model->addModel( $this->user, $data ); //Executa query
    
    $response->getBody()->write($result); //Retorna os dados

    return $response;
});

//Deleta modelo
$router->delete('/model/delete/{id}', function (Request $request, Response $response, $args){    
    $id = $request->getAttribute('id');
    return $response->withJson($this->model->deleteModel( $this->user, $id ));

})->setName('Delete Model');