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

    /** SOCIALITE: Facebook & GOOGLE */

    /**
     * @param string $driver = [facebook|google] 
     * */
    public function socialProvider($driver)
    {   
        //Se for resposta para ser processada
        if($driver == 'authorized'){
            return $this->socialCallback($driver);
        }

        return Socialite::driver($driver)->stateless()->redirect();
    }

    /**
     * @param string $driver = [facebook|google] 
     * */
    public function socialCallback($driver)
    {
        //Retorna dados do usuário através da API
        $user = Socialite::driver($driver)->stateless()->user();

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
        if (!$auth = $this->login->setLogin($userData)) {
            
            //Se usuário não existir na base de dados, redireciona ao registro 
            //juntamente com os dados
            return response()->json(array_only($userData, ['success' => ['social-register' => ['display_name', 'user_email']]]));
        }
        
        //Retorna resposta
        return response($auth);
        
    }
    /** FIM SOCIALITE */

    /** Login */
    function login(Request $request){

        //Campos obrigatórios
        $require = ['user_email', 'user_pass'];
        
        //Verifica se campos obrigatórios estão presentes
        if(!$request->has($require)){
            return response(['error' => ['login' => "Campo obrigatório não enviado!"]]); //TODO: Melhorar resposta json
        }

        //Verifica se campos obrigatórios estão presentes
        if(!$request->filled($require)){
            return response(['error' => ['login' => "Falta preencher campo!"]]); //TODO: Melhorar resposta json
        }
        
        //Realiza Login e resposta
        $response = $this->login->setLogin($request->all());
        
        //Inicializa sessão atribuindo retornando GenericUser
        return response($response);

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

    /** Verifica se usuário existe */
    function isUserExist(Request $request){
        
        //Campos obrigatórios
        $require = ['user_email'];

        //Verifica se campos obrigatórios estão presentes
        if(!$request->has($require) || !$request->filled($require)){
            return response(['error' => ["register", "Email não fornecido! Tente novamente!"]]); 
        }

        return response($this->user->isUserEmailExist($request->input('user_email')));
        
    }

    /** Logout */
    function forgetPassword(Request $request){
        
        //Verifica se campos obrigatórios estão presentes
        if(!$request->has('user_email')){
            return response(['error' =>["forgetPassword", "Email de usuário não fornecido! Tente novamente!"]]); 
        }

        //Verifica se campos obrigatórios estão presentes
        if(!$request->filled('user_email')){
            return response(['error' =>["forgetPassword", "Email válido não enviado. Tente novamente"]]); 
        }
        
        //Realiza o login
        return $this->login->forgetPassword($request->input('user_email'));
    }

    /** Logout */
    function logout(){
        
        //Expira o cookie atual
        //25.03.2019 = Removido dados especificos do cookie, suporte Edge
        $expiredCookie = app('cookie')->forget(env('APPCOOKIE'), '/', env('APP_DOMAIN'));

        //Retorna resposta com cookie expirado
        return response(['success' => ['logout' => 'Deslogado com sucesso!']])->withCookie($expiredCookie);
    }

    //Retorna token na classe 'Login'
    public function getToken(){
        return $this->login->getToken();
    }

    //Retorna token na classe 'Login'
    public function insertToken($id, $token){
        return $this->login->insertToken($id, $token);
    }

    //Retorna token na classe 'Login'
    public function getUserData(){
        return $this->login->getUserData();
    }

}
