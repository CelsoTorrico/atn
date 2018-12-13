<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Core\Profile\Login;
use Core\Profile\UserClub;
use Closure;

class ClubController extends Controller
{

    protected $club;
    
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(UserClub $userclub)
    {
        //Verifica se classe de usuário corresponde a necessária
        //execução dos métodos
        $this->club = $this->isClass($userclub);
    }

    //Retorna lista de usuário que pertencem ao usuario master
    function getAll() {
        
        //Verifica se é array ao invés de objeto
        if (is_array($this->club) && isset($this->club['error']) || is_null($this->club)) {
            return $this->club;
        }

        //Atribui resposta
        $result = $this->club->getUsers();
        
        //Retorna resposta
        return response()->json($result);
    }

    //Adiciona um usuário 
    function addClubUser(Request $request){

        //Verifica se é array ao invés de objeto
        if (is_array($this->club) && isset($this->club['error']) || is_null($this->club)) {
            return $this->club;
        }
        
        //Campos obrigatórios
        $require = ['display_name', 'user_email', 'user_pass', 'confirm_pass'];

        //Verifica se campos obrigatórios estão presentes
        if(!$request->has($require)){
            //TODO: Melhorar resposta json
            return response(['error' =>["register", "Campos não submetidos! Tente novamente!"]]); 
        }

        //Verifica se campos obrigatórios estão presentes
        if(!$request->filled($require)){
            //TODO: Melhorar resposta json
            return response(['error' =>["register", "Falta preencher campos obrigatórios!"]]); 
        }

        //Realiza cadastro e retorna resultado
        if( array_key_exists('error', $response = $this->club->addUser($request->all())) ){
            return response($response);
        }

        //Realiza o login
        return $response;
    }

    //Atualiza informações de usuário
    function updateUser(Request $request, $id){

        //Verifica se é array ao invés de objeto
        if (is_array($this->club) && isset($this->club['error']) || is_null($this->club)) {
            return $this->club;
        }

        //Atualizando perfil
        $result = $this->club->updateUser($request->all(), $id);
        
        //Retorna resposta
        return response()->json($result);

    }

    //Desativa um usuário
    function deleteUser($id) {

        //Verifica se é array ao invés de objeto
        if (is_array($this->club) && isset($this->club['error']) || is_null($this->club)) {
            return $this->club;
        }

        //Atualizando perfil
        $result = $this->club->deleteUser($id);
        
        //Retorna resposta
        return response()->json($result);

    }

    //Reativa um usuário
    function activeUser($id) {

        //Verifica se é array ao invés de objeto
        if (is_array($this->club) && isset($this->club['error']) || is_null($this->club)) {
            return $this->club;
        }

        //Atualizando perfil
        $result = $this->club->activeUser($id);
        
        //Retorna resposta
        return response()->json($result);
    }

    /** Verifica se a classe é do tipo UserClub */
    private function isClass($class){
        //Verifica se é classe necessária
        if (!is_a($class, 'Core\Profile\UserClub')) {
            return ['error' => ['club' => 'Você não tem previlégio para acessar essas funcionalidades!']];
            exit;
        }

        //retorna classe
        return $class;
    }
    
}
