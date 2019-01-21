<?php 

namespace Core\Profile;

use Core\Interfaces\LoginInterface;
use Core\Database\LoginModel;
use Core\Database\UsermetaModel; 
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

    /* Realiza o login verificando existencia de usuário
    *   E inserindo token no BD
     */
    function setLogin($data) {

        //Se tem token atribuido juntamente com dados
        if (isset($data['token']) && !empty($data['token'])) {
            //Executa login social
            return $this->socialLogin($data);            
        }

        //aplicando filtro de string
        $data['user_email'] = filter_var($data['user_email'], FILTER_SANITIZE_EMAIL); 

        //Instancia LoginModel para verificar existencia de usuário via user_login
        $this->model = new LoginModel();

        //Verifica se existe usuário, passando array de dados
        if (!$this->model->load(['user_email' => $data['user_email']])) {
            return ['error' => ['login' => 'Usuário inexistente.']];
        }

        //Retorna dados localizados
        $this->userData = $this->model->getData();

        //aplicando filtro de string
        $data['user_pass'] = filter_var($data['user_pass'], FILTER_SANITIZE_STRING);

        //Instanciando classe de verificação de passwords Wordpress = (8, true)
        $passwordClass = new PasswordHash(8, true);

        //Comparação de senhas
        $sessionAuth = $passwordClass->CheckPassword($data['user_pass'], $this->userData['user_pass']);

        if(!$sessionAuth){
            //Retorna string erro
            return ['error' => ["login" => "Email ou senha não conferem. Tente novamente."]]; 
        }

        //Gerando hash para token utilizando ArgonDriver
        $bcrypt = app('hash')->createBcryptDriver();
        $hash   = $bcrypt->make($this->userData['user_login']);
        $this->cookieToken = $hash;

        //Verifica se hash ocorreu com sucesso
        if (!$response = app('hash')->check($this->userData['user_login'], $this->cookieToken)) { 
            //Retorna string erro
            return ['error' => ["login" => "Email ou senha não conferem. Tente novamente."]]; 
        }

        /*$this->cookieToken = $passwordClass->HashPassword($this->userData['user_login']);
        $response = $passwordClass->CheckPassword($this->userData['user_login'], $this->cookieToken);*/
        
        if($response):
            //Retornando string sucesso
            return ['success' => ["login" => "Login realizado com sucesso! Bem Vindo."]]; 
        else:
            //Retorna string erro
            return ['error' => ["login" => "Seu acesso não foi permitido."]]; 
        endif;
        
    }

    //Login via API's Sociais
    private function socialLogin(array $userData){

        //Verifica se existem dados válidos
        if(!count($userData) <= 0 && !array_key_exists('user_email', $userData)){
            return ['error' => ['login' => 'Houve um erro em sua autenticação via Login Social. Tente mais tarde.']];
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
        
        //Retorna dados localizados
        $this->userData = $this->model->getData();

        //Armazena dados de token social em array
        $this->cookieToken = array($userData['token'], $userData['expires']);
        
        //Retornando string sucesso
        return ['success' => ["login" => "Login realizado com sucesso! Bem Vindo."]];
        
    }

    public function insertToken(int $id, string $token){
        
        //Inicializa modelo
        $metaModel = new UsermetaModel();

        //Serializando para inserção no bd
        $tokenSerialized = serialize($token);
        
        //Carrega metadados para inserção ou atualizando existente
        $metaModel->load(['user_id' => $id, 'meta_key' => 'session_tokens']);

        //Cria novos atributos e valores para salvar
        $data = [
            'user_id'       => $id,
            'meta_key'      => 'session_tokens',
            'meta_value'    => $tokenSerialized,
            'visibility'    => -1
        ];

        //Preenche modelo com dados
        $metaModel->fill($data);

        //Se atributo já existir
        if($metaModel->isFresh()){
            $response = $metaModel->save();
        }
        else{
            $response = $metaModel->update([
                'user_id', 'meta_key', 'meta_value', 'visibility']);
        }

        return $response;
        
    }

    //Desloga usuário e todas as sessões atuais
    public function setLogout(){

        //Verifica se está logado
        /*if(! self::isLogged() ){
            return ['error' =>['login' => 'Sessão ainda foi não inicializada.']]; 
        }*/

    }

    private function completeProfileNotify() {
        
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

    public function getUserData(){
        return $this->userData;
    }

}