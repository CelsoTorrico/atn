<?php

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use Slim\Http\UploadedFile as UploadedFile;

/*##### BUSINESS ROUTES ############# */

//Retorna um projeto especifica
$router->get('business/{id}', function (Request $request, Response $response, $args){     
    //Variaveis
    $id = $request->getAttribute('id');
    return $response->withJson($this->project->getProject( $this->user, $id ));

})->setName('Project');

//Adiciona um projeto
$router->put('/projects/{id}', function (Request $request, Response $response, $args){     
    //Variaveis
    $id = $request->getAttribute('id');
    $data = $request->getParsedBody();
    return $response->withJson($this->project->updateProject( $this->user, $id, $data ));

})->setName('Update Project');

//Reordenando lista de projetos ordenados
$router->get('/business/', function (Request $request, Response $response){    
    return $response->withJson($this->project->getListProjects( $this->user ));
})->setName('projects');

//Retorna campos especificos de projectos
$router->get('/projects/fields/{wichData}', function (Request $request, Response $response){    
    $wichData = $request->getAttribute('wichData');
    return $response->withJson($this->project->getProjectFields( $this->user, $wichData ));
})->setName('projects');

//Deleta projeto
$router->delete('/projects/delete/{id}', function (Request $request, Response $response, $args){    
    $id = $request->getAttribute('id');
    return $response->withJson($this->model->deleteProject( $this->user, $id ));

})->setName('Delete Project');

//Adicionar campos de novos projetos
$router->post('/projects/fields[/{wichData}]', function (Request $request, Response $response, $args) {

    $directory = $this->get('upload_directory'); //Definindo diretório para upload
    $upFiles = $request->getUploadedFiles(); //Pega arquivo submetido
    $data = $request->getParsedBody(); //Pega dados submetidos via POST

    //Se não tiver arquivo de upload, adiciona os dados padrão
    if(count($upFiles) > 0): 
        $data['uploadFile'] = $upFiles;
    endif;
    
    //Executa função determinada pela váriavel e retorna json de resultado
    return $response->withJson(
        $this->project->addProjectFields( 
            $this->user,
            $request->getAttribute('wichData'), 
            $data));
    
});