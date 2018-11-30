<?php

namespace App\Http\Controllers;

use Core\Profile\Login as Login;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Core\Profile\User;
use App\Http\Middleware\Authenticate;

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

        //Campos obrigatórios
        $require = ['user_email', 'user_pass'];
        
        //Verifica se campos obrigatórios estão presentes
        if(!$request->has($require)){
            return response("Campo obrigatório não enviado!"); //TODO: Melhorar resposta json
        }

        //Verifica se campos obrigatórios estão presentes
        if(!$request->filled($require)){
            return response("Falta preencher campo!"); //TODO: Melhorar resposta json
        }
        
        //Realiza Login e retorna class User
        $response = $this->login->setLogin($request->all());

        //Retorna resposta
        return response($response)->withCookie($this->login->setSession());

    }

    function register(Request $request){
        
        //Campos obrigatórios
        $require = ['type', 'display_name', 'sport', 'user_email', 'user_pass', 'confirm_pass'];

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
        if( array_key_exists('error', $response = $this->user->add($request->all())) ){
            return response($response);
        }

        //Realiza o login
        return $this->login($request);
        
    }

    function logout(){
        $result = $this->login->setLogout();
        return $result;
    }

}
