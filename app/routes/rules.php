<?php 

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use Slim\Http\UploadedFile as UploadedFile;

/*########## RULES ROUTES ###############*/

//Inserir e atualizar as regras de datas
$router->get('/projects/rules/{id}', function (Request $request, Response $response) {
    $id  = $request->getAttribute('id');
    return $response->withJson($this->project->getRuleProject( $this->user, $id));
});

//Inserir e atualizar as regras de datas
$router->put('/projects/rules/{id}', function (Request $request, Response $response) {
    $id  = $request->getAttribute('id');
    $data = $request->getParsedBody();
    return $response->withJson($this->project->updateRuleProject( $this->user, $id, $data ));
});