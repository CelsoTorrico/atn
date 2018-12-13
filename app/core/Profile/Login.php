<?php 

namespace Core\Profile;

use Core\Interfaces\LoginInterface;
use Core\Database\LoginModel; 
use Core\Utils\PasswordHash;
use Core\Utils\AppValidation;
use Core\Profile\User;
use Illuminate\Http\Request;
use Illuminate\Auth\GenericUser as AppUser;
use Illuminate\Contracts\Auth\Factory as Auth;
use Socialite;

class Login implements LoginInterface{

    private $model;
    private $userData;
    private $cookieToken;
    private $session;
    private $cookie;

    //Construtor da classe
    function __construct(Auth $auth){
        $this->auth = $auth;
    }

    /* Retorna resposta se logado ou não */
    function setLogin($data){

        $login_data = [];

        //aplicando filtro de string
        $login_data['user_email'] = filter_var($data['user_email'], FILTER_SANITIZE_EMAIL); 

        //Instancia LoginModel para verificar existencia de usuário via user_login
        $this->model = new LoginModel();

        //Verifica se existe usuário
        if(!$this->model->load($login_data)){
            return ['error' => ['login' => 'Usuário inexistente.']];
        }

        //Retorna dados localizados
        $this->userData = $this->model->getData();

        //Verifica tipo de login
        if (!isset($data['token']) && empty($data['token'])) {
            
            //aplicando filtro de string
            $login_data['user_pass'] = filter_var($data['user_pass'], FILTER_SANITIZE_STRING);

            //Instanciando classe de verificação de passwords Wordpress = (8, true)
            $passwordClass = new PasswordHash(8, true);

            //Comparação de senhas
            $sessionAuth = $passwordClass->CheckPassword($login_data['user_pass'], $this->userData['user_pass']);

            //Gerando hash
            $this->cookieToken = password_hash($this->userData['user_login'], CRYPT_BLOWFISH);

        } else{
            //Executa login social
            $sessionAuth = $this->socialLogin($data);
        }
        
        if($sessionAuth):
            //Retornando string sucesso
            return ['success' => ["login", "Login realizado com sucesso! Bem Vindo."]]; 
        else:
            //Retorna string erro
            return ['error' => ["login", "Seu acesso não foi aprovado."]]; 
        endif;
        
    }

    //Login via API's Sociais
    public function setSocialLogin(array $userData){

        //Verifica se existem dados válidos
        if(!count($userData) <= 0 && !array_key_exists('user_email', $userData)){
            return ['error' => ['login' => 'Houve um erro em sua autenticação via Facebook. Tente mais tarde.']];
        }
        
        //Verifica se classe já esta instanciada na variavel
        if(!is_a($this->model, 'Core\Database\LoginModel')){
            $this->model = new LoginModel();
            $this->model->load(['user_email' => $userData['user_email']]);
        }
        else{
            $this->model->getInstance(['user_email' => $userData['user_email']]);
        }

        //Verificar se usuário é existente
        if ($this->model->isFresh()) {
            //Se não, retornar false
            return false;
        } 
        
        //Nova classe usuário
        $user = new User(); 

        //Atribui ID usuario
        $user->ID = $this->model->ID; 
        
        //Atribui valor de token se existir
        $socialToken = ($meta = $user->getSocialToken())? 
        unserialize($meta['meta_value']): false;

        //Retorna dados localizados
        $this->userData = $this->model->getData();

        //Atribui valor do token
        $this->cookieToken = $socialToken;
        
        if($socialToken):
            //Retornando string sucesso
            return ['success' => ["login", "Login realizado com sucesso! Bem Vindo."]]; 
        else:
            //Retorna string erro
            return ['error' => ["login", "Seu acesso não foi aprovado."]];
        endif;
        
    }

    //Retorna se usuario está logado
    public static function isLogged():bool{
        return true;
    }

    //Desloga usuário e todas as sessões atuais
    public function setLogout(){

        //Verifica se está logado
        /*if(! self::isLogged() ){
            return ['error' =>['login' => 'Sessão ainda foi não inicializada.']]; 
        }*/

    }

    public static function getCookieName(){
        return env('APPCOOKIE');
    }

    public static function getUserCookieName(){
        return env('USERCOOKIE');
    }

    public function getToken(){
        return $this->cookieToken;
    }

    public function getUser(){
        return [
            'name'       => $this->userData['user_login'], 
            'user_email' => $this->userData['user_email']
        ];
    }

}