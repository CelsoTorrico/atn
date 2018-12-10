<?php 

namespace Core\Profile;

use Core\Interfaces\LoginInterface;
use Core\Database\LoginModel; 
use Core\Utils\PasswordHash;
use Core\Utils\AppValidation;
use Core\Profile\User;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Session\Session;
use Socialite;

class Login implements LoginInterface{

    private $model;
    private $userData;
    private $cookieToken;
    private $session;
    private $cookie;

    /** Cookies */
    const _APPCOOKIE_   = 'app_atletas_now';    
    const _USERCOOKIE_  = 'app_atletas_now_user_session'; 

    //Construtor da classe
    function __construct(){
        $this->session  = new Session();
        $this->cookie   = new Cookie(self::getCookieName());
    }

    /* Retorna resposta se logado ou não */
    //TODO: Implementar validação de TOKEN via Social Login
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
            $this->cookieToken = [
                'token' => password_hash($this->userData['user_login'], CRYPT_BLOWFISH),
                'expire' => 5115774
            ];

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

    //Registrando cookies e sessão atual
    public function setSession(){
        //Se sessão inicializada e cookie setado
        return self::startSession();        
    }

    //Inicia sessões registrando cookies e dados na var $_SESSION
    private function startSession():Cookie{
        
        //Instanciando classe de Cookie     
        $this->cookie = new Cookie(self::getCookieName(), $this->cookieToken['token'], $this->cookieToken['expire']); 
        
        //Verifica se iniciou e adiciona valor
        if ( !$this->session->isStarted() ) {
            $this->session->start();
            $this->session->set(self::userCookieName(), $this->userData['user_login']);
        }

        //Retorna classe cookie
        return $this->cookie;
    }

    //Retorna se usuario está logado
    public static function isLogged():bool{      
        return ( self::getSession() && self::isCookieValid() )? true : false;
    }

    //Retorna a sessão atual do usuário
    private static function getSession():bool{ 
        //Retorna sessão
        $session = (new Login)->session->has(self::userCookieName());

        //Retorna se sessão foi inicializada
        return $session;         
    }

    //Retorna objeto Session()
    public static function getSessionInstance(){
        return (new Login)->session;
    }

    //Retorna se cookie está válido 
    private static function isCookieValid():bool{ 
        
        //Retorna cookie da sessão
        $cookie = (new Login)->cookie->getName(); 
        
        //Verifica se existe cookie e retorna
        return ( $cookie )? true : false;
    }

    //Retorna objeto Cookie()
    public static function getCookieInstance(){
        return (new Login)->cookie;
    }

    //Desloga usuário e todas as sessões atuais
    public function setLogout(){

        if(! self::isLogged() ){
            return ['error' =>['login' => 'Sessão ainda foi não inicializada.']]; 
        }
        
        //Limpa a sessão atual
        $this->session->clear();
        $this->session->save();

    }

    public static function getCookieName(){
        return self::_APPCOOKIE_;
    }

    public static function userCookieName(){
        return self::_USERCOOKIE_;
    }

}