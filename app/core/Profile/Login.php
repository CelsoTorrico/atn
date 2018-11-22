<?php 

namespace Core\Profile;

use Core\Interfaces\LoginInterface as LoginInterface;
use Core\Database\LoginModel as LoginModel; 
use Core\Utils\PasswordHash as PasswordHash;
use Core\Profile\User as User;
use Symfony\Component\HttpFoundation\Cookie;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Session\Session;

class Login implements LoginInterface{

    private $model;
    private $userData;
    private $cookieToken;

    /** Cookies */
    const _APPCOOKIE_   = 'app_atletas_now';    
    const _USERCOOKIE_  = 'app_atletas_now_user_session'; 

    //Construtor da classe
    function __contruct(){
    
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
            return "Usuário inexistente."; //TODO: retornar objeto
        }

        //Retorna dados localizados
        $this->userData = $this->model->getData();

        //aplicando filtro de string
        $login_data['user_pass'] = filter_var($data['user_pass'], FILTER_SANITIZE_STRING);
        
        //Instanciando classe de verificação de passwords Wordpress = (8, true)
        $passwordClass = new PasswordHash(8, true);
        
        //Verifica se usuário existe no banco, comparando senha
        if( $passwordClass->CheckPassword($login_data['user_pass'], $this->userData['user_pass']) ):

            //Retornando string sucesso
            return ['success' => ["login", "Login realizado com sucesso! Bem Vindo."]]; 

        else:
            //Retorna string erro
            return ['error' => ["login", "Seu acesso não foi aprovado."]]; //TODO: retornar objeto

        endif;
        
    }

    //Login via API's Sociais
    public function socialLogin():User{
        
    }

    //Registrando cookies e sessão atual
    public function setSession(){
        //Se sessão inicializada e cookie setado
        return self::initSession();        
    }

    //Inicia sessões registrando cookies e dados na var $_SESSION
    private function initSession():Cookie{

        //Gerando hash
        $cookieToken = password_hash($this->userData['user_login'], CRYPT_BLOWFISH);  
        
        //Instanciando classe de Cookie
        $cookie = new Cookie(self::getCookie(), $cookieToken); 
        
        //Instancia classe de sessão
        $user_cookie = new Session();
        
        //Verifica se iniciou e adiciona valor
        if( $user_cookie->start() ){
            $user_cookie->set(self::userCookie(), $this->userData['user_login']);
        }

        //Retorna classe cookie
        return ( $cookie && $user_cookie ) ? $cookie : false;
    }


    //Desloga usuário e todas as sessões atuais
    public function setLogout(){

        if(! self::isLogged() ){
            return ['error' =>['login' => 'Sessão ainda foi não inicializada.']]; 
        }

        //Inicia classe Session
        $session = new Session();
        
        //Limpa a sessão atual
        $session->clear();

    }

    //Retorna se usuario está logado
    public static function isLogged():bool{      
        return ( self::getSession() && self::isCookieValid() )? true : false;
    }

    //Retorna a sessão atual do usuário
    private static function getSession():bool{ 
        
        //Instanciando classe de Cookie
        $session = new Session();
        
        //Verifica se existe cookie e retorna
        return ( $session->has(self::userCookie()) )? true : false; 
        
    }

    //Retorna se cookie está válido 
    private static function isCookieValid():bool{ 
        
        //Retorna cookie da sessão
        $cookie = (isset($_COOKIE[Login::getCookie()]))? $_COOKIE[Login::getCookie()] : false; 
        
        //Verifica se existe cookie e retorna
        return ( $cookie )? true : false;
    }

    public static function getCookie(){
        return self::_APPCOOKIE_;
    }

    public static function userCookie(){
        return self::_USERCOOKIE_;
    }

}