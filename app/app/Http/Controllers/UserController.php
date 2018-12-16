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

    /**  */
    function get(Request $request, $id) {

        $id = (int) $id;
        
        $result = $this->user->get($id);

        //Se usuário da query é current_user, não contabilizar view
        if( $id != $this->user->ID ){
            //incrementado qtd view
            $this->user->increaseView($id);
        }  
        
        return response()->json($result);
    }

    function getPdf() {

        $result = $this->user->getUserPdf();

        //Se houve erro
        if(is_array($result) && isset($result['error'])){
            return $response()->json($result['error']);
        }
        else{
            //Retorna string com dados
            return response()->json($result);
        }
    }

    function getAll(Request $request) {
        
        $result = $this->user->getFriends();
        
        return response()->json($result);
    }

    function getSelf(Request $request) {
        return response()->json($this->user);
    }

    function getStats(Request $request) {
        
        return response()->json($this->user->getStats());
    }

    function update(Request $request){

        //Somente permissão de atualização de proprio perfil
        if( !is_null($this->user->ID) ){
            //incrementado qtd view
            $result = $this->user->update($request->all());
        }  
        else{
            //Retorna erro
            $result = ['error' => ['update', 'Você não pode modificar esse perfil.']];
        }
        
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
        
        return response()->json($result);

    }

}
