<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Core\Profile\User as User;
use Closure;

class UserController extends Controller
{

    protected $user;
    
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->user = User::get_current_user();
    }

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

    function getPdf(Request $request, $id) {

        $id = (int) $id;
        
        $result = $this->user->getUserPdf($id);

        if(is_array($result)){
            return $response()->json($result);
        }
        else{
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

    function update(Request $request, $id){

        //Somente permissão de atualização de proprio perfil
        if( $id == $this->user->ID ){
            //incrementado qtd view
            $result = $this->user->update($request->all());
        }  
        else{
            //Retorna erro
            $result = ['error' => ['update', 'Você não pode modificar esse perfil.']];
        }
        
        return response()->json($result);

    }

    //TODO: Verifica esse redirecionamento e fazer funcionar
    function updateUser(Request $request, $id){
        //TODO: Fazer verificação de autenticação se usuário tem
        //permissão para fazer update
    }
}
