<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Core\Service\Learn;
use Core\Profile\User;

use Closure;

class LearnController extends Controller
{

    protected $learn;
    
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(Request $request)
    {
        $this->learn = new Learn($request->user());
    }

    function get($id){

        $response = $this->learn->get($id);
        
        return response()->json($response);
    }

    function getAll(int $paged = 0){
        
        $response = $this->learn->getAll($paged);

        return response()->json( $response );
    }

    function getVisibility(){

        $response = $this->learn->getVisibilityFields();
        
        return response()->json($response);
    }

    function add(Request $request){

        //Verifica se campos obrigatórios estão presentes
        if(!$request->has('post_title') || !$request->filled('post_title')){
            //TODO: Melhorar resposta json
            return response("Campo obrigatório não submetido! Tente novamente!"); 
        }

        //Verifica se campos obrigatórios estão presentes
        if(!$request->has('post_content') || !$request->filled('post_content')){
            //TODO: Melhorar resposta json
            return response("Campo obrigatório não submetido! Tente novamente!"); 
        }

        //Atribui conteúdo a variável
        //O ideal é ser um conteúdo estruturado em html
        $data = [
            'post_title'        => $request->input('post_title'),
            'post_excerpt'      => $request->input('post_excerpt'),
            'post_content'      => $request->input('post_content')
        ];

        //Se foi definido a visibilidade do post
        if ($request->has('post_visibility') && $request->filled('post_visibility')) {
            //Atribui a variavel
            $data['post_visibility'] = (int) $request->input('post_visibility');
        }

        //Atribui imagem se tiver upload
        if ($request->hasFile('post_image') && $request->file('post_image')->isValid()) {
            //Atribui fn a var
            $data['post_image'] = $request->file('post_image');
        }

        //Atribui URL de Video ao Post
        if ($request->has('post_video_url') && $request->filled('post_video_url')) {
            //Atribui fn a var
            $data['post_video_url'] = (string) $request->input('post_video_url');
        }

        $response = $this->learn->add($data);
        
        return response()->json($response);
    }

    function update(Request $request, $id){

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
        $response = $this->learn->update($request->input('post_content'), $id);
        
        return response()->json($response);
    }

    function delete(Request $request, $id){
        return response($this->learn->delete($id));
    }

    /** Comentários */

    function addComment(Request $request, $id){

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
        $response = $this->learn->addComment($id, $request->input('comment_content'));
        
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
        $response = $this->learn->addResponse($comment_ID, $request->input('comment_content'));
        
        //Resposta da adicão
        return response()->json($response);
    }

}
