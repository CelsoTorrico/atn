<?php

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use Slim\Http\UploadedFile as UploadedFile;

/*########## EMAILS ###############*/

//Grava msg no bd e envia e-mails
$router->post('/projects/sendmail/', function (Request $request, Response $response) {
    $data = $request->getParsedBody();
    return $response->withJson( $this->project->sendMail( $this->user, $this->phpmailer, $data ) );
});

//Retorna msg do BD
$router->get('/projects/sendmail/{type}/{id}', function (Request $request, Response $response) {
    $id  = $request->getAttribute('id');
    $type  = $request->getAttribute('type');
    return $response->withJson( $this->project->getMail( $this->user, $id, $type ));
});