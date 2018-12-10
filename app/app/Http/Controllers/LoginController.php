<?php

namespace App\Http\Controllers;

use Core\Profile\Login;
use Core\Profile\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Middleware\Authenticate;
use Socialite;

class LoginController extends Controller
{

    protected $login;
    protected $user;
    protected $facebookAPI;
    
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(Login $login, User $user)
    {
        $this->login        = $login;
        $this->user         = $user;
        $this->facebookAPI  = config('facebook'); //API Socialize
    }

    /** SOCIALITE: Facebook */
    public function facebookProvider()
    {
        return Socialite::driver('facebook')->stateless()->redirect();
    }

    /** SOCIALITE: Google */
    public function googleProvider()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function facebookCallback()
    {
        //Retorna dados do usuário através da API
        $user = Socialite::driver('facebook')->stateless()->user();

        //Verifica se retorno é objeto
        if (!is_a($user, 'Laravel\Socialite\Two\User')) {
            return ['error' => ['login' => 'Houve um erro em sua autenticação via Facebook. Tente mais tarde.']];
        }
        
        //Adicionando dados importantes
        $userData = [
            'id'            => $user->id,
            'display_name'  => $user->name,
            'user_email'    => $user->email,
            'token'         => $user->token,
            'expires'       => $user->expiresIn,
            'avatar'        => $user->avatar
        ];  

        //Executa função de verificação de login social
        if (!$auth = $this->login->setSocialLogin($userData)) {
            
            //Se usuário não existir na base de dados, redireciona ao registro 
            //juntamente com os dados
            return response()->json(array_only($userData, ['success' => ['social-register' => ['display_name', 'user_email']]]));
        }
        
        //Realiza Login e retorna class User
        $response = $this->login->setSocialLogin($userData);

        //Atribui classe Cookie
        $cookie = $this->login->setSession();
        
        //Retorna resposta
        return response($response)->withCookie($cookie);
        
    }

    public function googleCallback()
    {
        //Retorna dados do usuário através da API
        $user = Socialite::driver('google')->stateless()->user();

        //Verifica se retorno é objeto
        if (!is_a($user, 'Laravel\Socialite\Two\User')) {
            return ['error' => ['login' => 'Houve um erro em sua autenticação via Google. Tente mais tarde.']];
        }
        
        //Adicionando dados importantes
        $userData = [
            'id'            => $user->id,
            'display_name'  => $user->name,
            'user_email'    => $user->email,
            'token'         => $user->token,
            'expires'       => $user->expiresIn,
            'avatar'        => $user->avatar
        ];  

        //Executa função de verificação de login social
        if (!$auth = $this->login->setSocialLogin($userData)) {
            
            //Se usuário não existir na base de dados, redireciona ao registro 
            //juntamente com os dados
            return response()->json(array_only($userData, ['success' => ['social-register' => ['display_name', 'user_email']]]));
        }
        
        //Realiza Login e retorna class User
        $response = $this->login->setSocialLogin($userData);

        //Atribui classe Cookie
        $cookie = $this->login->setSession();
        
        //Retorna resposta
        return response($response)->withCookie($cookie);

    }

    /** Login */
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
        
        //Atribui classe Cookie
        $cookie = $this->login->setSession();
        
        //Retorna resposta
        return response($response)->withCookie($cookie);

    }

    /** Cadastrar / Registrar */
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


    /** Logout */
    function logout(){
        $result = $this->login->setLogout();
        return response()->json($result);
    }

}
