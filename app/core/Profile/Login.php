<?php 

namespace Core\Profile;

use Core\Interfaces\LoginInterface as LoginInterface;
use Core\Database\LoginModel as LoginModel; 
use Core\Profile\PasswordHash as PasswordHash;
use Core\Profile\User as User;
use Closure;

class Login implements LoginInterface{

    private $next;
    private $request;
    private $model;
    private $userData;
    private $cookieToken;

    /** Cookies */
    const _APPCOOKIE_   = 'app_atletas_now';    
    const _USERCOOKIE_  = 'app_atletas_now_user_session'; 

    function __contruct(Closure $next){
        $this->next = $next;
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

            //Adiciona token cookie
            $this->cookieToken = $this->setSession();
            
            //Retorna objeto User
            return ['success' => ["login", "Login realizado com sucesso! Bem Vindo."]]; 

        else:
            //Retorna string erro
            return ['error' => ["login", "Seu acesso não foi aprovado."]]; //TODO: retornar objeto

        endif;
        
    }

    //Login via API's Sociais
    private function socialLogin():User{
        
    }

    //Registrando cookies e sessão atual
    protected function setSession(){

        //Gerando hash
        $cookieToken = password_hash( $this->userData['user_pass'], CRYPT_BLOWFISH);

        //Se sessão inicializada e cookie setado
        if( $cookieToken ):
            $this->initSession();
            return $cookieToken;
        else:
            return false;
        endif;

    }

    //Se usuario deslogado, direciona para tela de login
    //TODO: Melhorar implementação
    public function setLogout(){

        if(! $this->isLogged() ){
            return 'Sessão ainda foi não inicializada.'; //TODO: Melhorar resposta
        }

        ob_end_clean();
        session_destroy();
        setcookie(self::getCookie());
        setcookie(self::getUserCookie());
        
        return response('logout'); 
    }

    //Retorna a sessão atual do usuário
    public function getSession(){ 
        return $_SESSION['user'];
    }

    //Retorna se usuario está logado
    public function isLogged(){        
        if( isset($_SESSION['user']) && is_array($_SESSION['user']) ):
            return true;
        else:
            return false;
        endif;
    }

    /*
        ##### Funções de verificação de login
        Retorna se usuarios esta logado, sim ou não
    */

    protected function initSession(){
        if(!session_status()){
            ob_start();
            session_start();
        }
    }

    //COOKIES

    public function getCookie(){
        return $this->cookieToken;
    }

    private function isCookieValid(){ 
        if( isset($_COOKIE[$this->appCookie()]) && password_verify( $_SESSION['user']['user_email'], $_COOKIE[$this->appCookie()]) ):
            return true;
        else:
            return false;
        endif;
    }

    private function appCookie(){
        return self::_APPCOOKIE_;
    }

    private function userCookie(){
        return self::_USERCOOKIE_;
    }

}