<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Core\Service\Timeline as Timeline;
use Core\Service\Comment as Comment;
use Core\Profile\User;

use Closure;
use DateTime;
use DateTimeZone;

class TimelineController extends Controller
{

    protected $timeline;
    protected $currentUser;
    
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(Request $request)
    {
        $this->timeline = new Timeline($request->user());
        $this->currentUser = $request->user();
    }

    function get($id){

        $response = $this->timeline->get($id);
        
        return response()->json($response);
    }

    function getAll(int $paged = 0){

        $response = $this->timeline->getAll($paged);

        return response()->json( $response );
    }

    function getAllLast(Request $request) {

        //Criando data atual para filtragem de posts após determinada data
        $current_time = ($request->has('current_time') && $request->filled('current_time'))? date_create($request->input('current_time')) : date_create();

        //Montando filtro para requisição na database
        $filter = ['post_date[>]' => $current_time->format('Y-m-d H:i:s')];

        //Faz requisição dentro da classe passando o parametro
        $response = $this->timeline->getAll(0, $filter);

        //Retorna último item
        return response()->json( $response );
    }

    function getLastAnnunciament(Request $request) {
        
        $filter = [
            'posts.post_author[!]' => $this->currentUser->ID,
            'posts.post_author' => 0,
            'OR'     => [
                'postmeta.meta_key'      => 'post_visibility',
            ],               
            'LIMIT'  => 1,
            'ORDER'  => ['posts.post_date' => 'DESC']
        ];

        //Faz requisição dentro da classe passando o parametro
        $response = $this->timeline->getAll(0, $filter);

        //Retorna último item
        return response()->json( $response );
    }

    function getUserAll(int $user_id, int $paged = 0){

        //Classe de usuário
        $user = new User();
        $profileUser = $user->get($user_id);
        $currentUser = (!is_null($cUser = $this->currentUser))? $cUser->ID : 0;
        $timeline = new Timeline($profileUser);
        
        //Carrega timeline de usuário correspondente
        $response = $timeline->getUserAll($currentUser, $paged);

        return response()->json( $response );
    }

    function getVisibility(){

        $response = $this->timeline->getVisibilityFields();
        
        return response()->json($response);
    }

    function getLastActivity(){

        $response = $this->timeline->getLastActivity();
        
        return response()->json($response);
    }

    function add(Request $request){

        //Atribui conteúdo a variável
        $data = ['post_content' => ($request->has('post_content'))? $request->input('post_content') : ''];

        //Se foi definido a visibilidade do post
        if ($request->has('post_visibility') && $request->filled('post_visibility')) {

            //Atribui a variavel
            $data['post_visibility'] = (int) $request->input('post_visibility');
        }

        //Atribui imagem se tiver upload
        if ($request->hasFile('post_image') && $request->file('post_image')->isValid()) {

            //Atribui caminho a variavel
            $data['post_image'] = $request->file('post_image');
        }

        //Verifica formato da imagem e continua se permitida
        if (isset($data['post_image']) && !empty($data['post_image']) 
        && !in_array($data['post_image']->getClientMimeType(), ['image/jpeg', 'image/gif', 'image/png', 'image/jpg'])) {
            return response()->json(["error" => ["timeline" => "Formato de imagem não suportado."]]);
        }

        $response = $this->timeline->add($data);
        
        return response()->json($response);
    }

    function update(Request $request, int $id){

        //Verifica se campos obrigatórios estão presentes
        if(!$request->has('post_content')){
            //TODO: Melhorar resposta json
            return response("Campo obrigatório não submetido! Tente novamente!"); 
        }

        //Verifica se campos obrigatórios estão presentes
        if(!$request->filled('post_content') ){
            //TODO: Melhorar resposta json
            return response("Falta preencher campos obrigatórios!"); 
        }

        //Executa methodo da classe
        $response = $this->timeline->update($request->input('post_content'), $id);
        
        return response()->json($response);
    }

    function delete(int $id){
        return response($this->timeline->delete($id));
    }

    /** Comentários */

    function addComment(Request $request, int $id){

        //Verifica se campos obrigatórios estão presentes
        if(!$request->has('comment_content')){
            //TODO: Melhorar resposta json
            return response("Campo obrigatório não submetido! Tente novamente!"); 
        }

        //Verifica se campos obrigatórios estão presentes
        if(!$request->filled('comment_content') ){
            //TODO: Melhorar resposta json
            return response("Falta preencher campos obrigatórios!"); 
        }

        //Envia dados submetidos
        $response = $this->timeline->addComment($id, $request->input('comment_content'));
        
        //Resposta da adicão
        return response()->json($response);
    }

    function addResponse(Request $request, $comment_ID){

        //Verifica se campos obrigatórios estão presentes
        if(!$request->has('comment_content')){
            //TODO: Melhorar resposta json
            return response("Campo obrigatório não submetido! Tente novamente!"); 
        }

        //Verifica se campos obrigatórios estão presentes
        if(!$request->filled('comment_content') ){
            //TODO: Melhorar resposta json
            return response("Falta preencher campos obrigatórios!"); 
        }

        //Envia dados submetidos
        $response = $this->timeline->addResponse($comment_ID, $request->input('comment_content'));
        
        //Resposta da adicão
        return response()->json($response);
    }

    function deleteComment(int $id){
        //Instancia classe de comentário
        $comment = new Comment();
        //Executa exclusão e retorna mensagem
        return response($comment->delete($id, $this->currentUser->ID));
    }

}
