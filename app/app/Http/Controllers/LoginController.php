<?php

namespace App\Http\Controllers;

use Core\Profile\Login;
use Core\Profile\User;
use Illuminate\Http\Request;
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
            return response()->json(array_intersect_key($userData, ['success' => ['social-register' => ['display_name', 'user_email']]]));
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

    /** 
     * Cadastrar / Registrar 
     * 
     * @since 2.1   Adicionando email de boas-vindas no cadastro
     * @since 2.0
     * */
    function register(Request $request){
        
        //Campos obrigatórios
        $require = ['type', 'display_name', 'sport', 'user_email', 'user_pass', 'confirm_pass'];

        //Verifica se campos obrigatórios estão presentes
        if(!$request->has($require)) {
            return response(['error' =>["register", "Campos não submetidos! Tente novamente!"]]); 
        }

        //Verifica se campos obrigatórios estão presentes
        if(!$request->filled($require)) {
            return response(['error' =>["register", "Falta preencher campos obrigatórios!"]]); 
        }

        //Verifica se já existe usuário com mesmo email
        $exist = $this->isUserExist($request);
        
        //Realiza cadastro e retorna resultado
        if( key_exists('error', $response = $exist) || array_key_exists('error', $response = $this->user->add($request->all())) ){
            return response($response);
        }

        //Enviar email de boas vindas ao novo usuário se cadastro realizado
        $this->doWelcomeEmail($request->input('user_email'), $request->input('display_name')); 

        //Retorna resposta
        return response($response);  
        
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

    /** 
     * Verifica e valida de Cookie 
     * */
    function cookieLogin(Request $request) {
        //Retorna boolean
        return response($this->login->isValidCookie($request->cookie($this->login->getCookieName())));
    }

    /** Validar Email de confirmação */
    function confirmEmail(Request $request) {

        //Verifica se campos obrigatórios estão presentes
        if(!$request->has('token') && !$request->filled('token')) {
            return response(['error' =>["confirm_email", "Não foi possível validar email!"]]); 
        }
        
        //Atribui dados enviados
        $token = $request->input('token');

        //Verifica a validade do token enviado
        $response =  $this->login->confirmUserEmail($token);

        //Se validação foi realizada com sucesso, retorna password
        if(key_exists('user_pass', $response) && !empty($response['user_pass'])) {
            //Adiciona password para realizar login
            return $this->login($request->merge($response));
        }

        //Retorna só em caso de mensagem de erro
        return $response;
    }

    /** Resetar e enviar nova senha para email */
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

    /** 
     * Email de boas vindas
     * 
     * @param string $email Email do usuário
     * @param string $displayName   Nome do usuário
     * @since 2.1
     *  */
    private function doWelcomeEmail(string $email, string $displayName) {

        //Executa metodo de envio de mensagem
       return response($this->login->sendWelcomeEmail($email, $displayName));

    }

}
