<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Core\Profile\Login;
use Core\Profile\User;
use Closure;

class UserController extends Controller
{

    protected $user;
    
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(User $user, Request $request)
    {
        //Atribui usuário do contexto
        $this->user = $request->user();
    }

    /** Retorna usuário único  */
    function get(int $id) {

        //Retorna classe de usuário com dados a exibir
        $result = $this->user->getUser($id);

        //Se usuário da query é current_user, não contabilizar view
        if( $result->ID != $this->user->ID ){
            //incrementado qtd view
            $result->increaseView($id);
        }  
        
        //retorna resultado
        return response()->json($result);
    }

    function getPdf(int $id=null) {

        $result = $this->user->getUserPdf($id);

        //Se houve erro
        if(is_array($result) && isset($result['error'])){
            return response()->json($result['error']);
        }
        else{
            //Retorna string com dados
            return response()->json($result);
        }
    }

    function getAll() {
        //Executa metodo que traz lista de usuarios
        $result = $this->user->getFriends();
        //retorna resultado
        return response()->json($result);
    }

    function getSelf() {
        //retorna resultado
        return response()->json($this->user);
    }

    function getSelfDash() {
        //retorna resultado
        return response()->json($this->user->getMinProfile());
    }

    function getStats(int $user_id = null) {
        
        //retorna resultado
        $result = $this->user->getStats($user_id);

        //Se houve erro
        if(is_array($result) && isset($result['error'])){
            return response()->json($result['error']);
        }
        else{
            //Retorna string com dados
            return response()->json($result);
        }
    }

    function getSuggestions() {        
        //retorna resultado
        return response()->json($this->user->getFriendsSuggestions());
    }

    function update(Request $request){

        //Somente permissão de atualização de proprio perfil
        if( !is_null($this->user) ){
            //Retorna erro
            return response()->json(['error' => ['update', 'Você não pode modificar esse perfil.']]);
        } 

        //Atribui dados enviados a var
        $data = $request->all();        

        //incrementado qtd view
        $result = $this->user->update($data);
        
        //retorna resultado
        return response()->json($result);

    }

    function setPassword(Request $request){
        
        //Somente permissão de atualização de proprio perfil
        if( is_null($this->user) ){
            //Retorna erro
            return response()->json(['error' => ['update', 'Você não pode modificar esse perfil.']]);
        } 

        //Verifica se campos obrigatórios estão presentes
        if(!$request->has(['user_pass', 'confirm_pass']) 
        || !$request->filled(['user_pass', 'confirm_pass'])){
            //Melhorar resposta json
            return response()->json(['error' => ["Campos obrigatórios não submetido! Tente novamente!"]]); 
        }

        //Atribui dados enviados a var
        $data = $request->all();        

        //incrementado qtd view
        $result = $this->user->updatePassword($data);
        
        //retorna resultado
        return response()->json($result);
    }

    function delete(){
        
        //Somente permissão de atualização de proprio perfil
        if( !is_null($this->user->ID) ){
            //Desativa o usuário
            $result = $this->user->delete();
        }  
        else{
            //Retorna erro
            $result = ['error' => ['delete', 'Você não pode desativar esse perfil.']];
        }
        
        //retorna resultado
        return response()->json($result);

    }

    function reactive(){
        
        //Somente permissão de atualização de proprio perfil
        if( !is_null($this->user->ID) ){
            //Desativa o usuário
            $result = $this->user->reactivate();
        }  
        else{
            //Retorna erro
            $result = ['error' => ['delete', 'Você não pode reativar esse perfil.']];
        }
        
        //retorna resultado
        return response()->json($result);

    }

    function sendMessage(Request $request, int $id) {

        //Verifica se campos obrigatórios estão presentes
        if(!$request->has('message_content') || !$request->filled('message_content')){
            //Melhorar resposta json
            return response()->json(['error' =>["Campos obrigatórios não submetido! Tente novamente!"]]); 
        }

        //Atribui conteúdo a variável
        $data = ['message_content' => $request->input('message_content')];

        //Executa metodo de envio de mensagem
        $response = $this->user->sendEmail($id, $data);
        
        //retorna resultado
        return response()->json($response);

    }

    function search (Request $request, int $page = 0) {
        //retorna resultado
        return response()->json($this->user->searchUsers($request->all(), $page));
    }

}
