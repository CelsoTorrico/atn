<?php

namespace App\Http\Controllers;

use Core\Profile\Login as Login;
use Illuminate\Http\Request;
use Core\Profile\User;


class LoginController extends Controller
{

    protected $login;
    protected $user;
    
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(Login $login, User $user)
    {
        $this->login = $login;
        $this->user = $user;
    }

    function login(Request $request){
        
        //Verifica se campos obrigatórios estão presentes
        if(!$request->has(['user_email', 'user_pass'])){
            return response("Campo obrigatório não enviado!"); //TODO: Melhorar resposta json
        }

        //Verifica se campos obrigatórios estão presentes
        if(!$request->filled(['user_email', 'user_pass'])){
            return response("Falta preencher campo!"); //TODO: Melhorar resposta json
        }
        
        //Realiza Login e retorna class User
        $response = $this->login->setLogin($request->all());

        //TODO: Melhorar isso, adicionar classes AUTH e COOKIE
        if(is_a($response, 'Core\Profile\User')):
            return response($response->id);
        else:
            return response($response);
        endif;

    }

    function logout(){
        $result = $this->login->setLogout();
        return $result;
    }

    function register(Request $request){
        
        //Verifica se campos obrigatórios estão presentes
        if(!$request->has(['type', 'display_name', 'sport', 'birthdate', 'user_email', 'user_pass', 'confirm_pass'])){
            //TODO: Melhorar resposta json
            return response("Campos não submetidos! Tente novamente!"); 
        }

        //Verifica se campos obrigatórios estão presentes
        if(!$request->filled(['type', 'display_name', 'sport', 'birthdate', 'user_email', 'user_pass', 'confirm_pass'])){
            //TODO: Melhorar resposta json
            return response("Falta preencher campos obrigatórios!"); 
        }
        
        //Realiza Login e retorna class User
        $response = $this->user->add($request->all());

        return response($response);
    }

}
