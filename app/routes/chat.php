<?php 

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use Slim\Http\UploadedFile as UploadedFile;

/*########## PRODUCT ROUTES ###############*/

//Retorna uma plan especifica
$router->add($auth)->get('/product/{id}', function (Request $request, Response $response, $args){    
    //Variaveis
    $id = $request->getAttribute('id');
    $product = $this->app->product();
    return $response->withJson($product->getProduct($id));

})->setName('Get Product');

//Adiciona um plano novo
$router->post('/product', function (Request $request, Response $response, $args){     
    
    $data = $request->getParsedBody();
    return $response->withJson($this->plan->addPlan( $this->user, $data ));

})->setName('Update Add Plans');

//Atualiza ou adiciona um plano novo
$router->put('/product/{id}', function (Request $request, Response $response, $args){     
    
    $id = $request->getAttribute('id');
    $data = $request->getParsedBody();
    return $response->withJson($this->plan->updatePlan( $this->user, $id, $data ));

})->setName('Update Plans');

//Deleta plano
$router->delete('/product/{id}', function (Request $request, Response $response, $args){    
    $id = $request->getAttribute('id');
    return $response->withJson($this->plan->deletePlan( $this->user, $id ));
})->setName('Delete Plans');


//Retorna lista de planos
$router->get('/product/list/{id}', function (Request $request, Response $response, $args){    
    //Variaveis
    $id = $request->getAttribute('id');
    return  $response->withJson($this->plan->getListPlans( $this->user, $id ));
})->setName('Lista de Plans');

//Atualização de Status
$router->put('/product/status/{id}', function (Request $request, Response $response, $args){     
    //Variaveis
    $id = $request->getAttribute('id');
    $data = $request->getParsedBody();
    return $response->withJson($this->plan->updatePlanStatus( $this->user, $id, $data ));
})->setName('Update Plans Status');