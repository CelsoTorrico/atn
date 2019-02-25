<?php 

namespace Core\Profile;

use Core\Interfaces\LoginInterface;
use Core\Database\LoginModel;
use Core\Database\UsermetaModel; 
use Core\Utils\PasswordHash;
use Core\Utils\AppValidation;
use Core\Utils\SendEmail;
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

    public function forgetPassword(string $email){
       
        //Se tem token atribuido juntamente com dados
        if(empty($email)) {
            //Executa login social
            return ['error' => ['forget-password' => 'E-mail de usuário não foi submetido']];            
        }

        //aplicando filtro de string
        $email = filter_var($email, FILTER_SANITIZE_EMAIL); 

        //Instancia LoginModel para verificar existencia de usuário via user_login
        $this->model = new LoginModel();

        //Verifica se existe usuário, passando array de dados
        if (!$this->model->load(['user_email' => $email])) {
            return ['error' => ['forget-password' => 'Usuário inexistente.']];
        }

        //Instanciando classe de verificação de passwords Wordpress = (8, true)
        $passwordClass = new PasswordHash(8, true);

        $new_pass = $passwordClass->HashPassword($email);

        //Comparação de senhas
        $sessionAuth = $passwordClass->CheckPassword($email, $new_pass);

        if(!$sessionAuth){
            //Retorna string erro
            return ['error' => ["forget-password" => "Houve um erro em gerar uma nova senha para este usuário. Tente novamente mais tarde."]]; 
        }

        //Instancia usuário com dados do banco
        $user = new User([
            'user_login'=> $this->model->user_login, 
            'user_pass' => $this->model->user_pass  ]);

        //Atribuindo nova senha ao usuário que solicitou reenvio de senha
        $success = $user->update(['user_pass' => $new_pass]);   
        
        //Verifica se hash ocorreu com sucesso
        if (!key_exists('success', $success)) {
            //Retorna string erro
            return ['error' => ["forget-password" => "Houve um erro em gerar uma nova senha para este usuário. Tente novamente mais tarde."]]; 
        }

        //CONTEUDO
        $html = '<html><img width="275" height="38" src="https://www.atletasnow.com/wp-content/uploads/2018/10/rsz_atletasnow_logoprincipal-01.png" title="AtletasNOW"><p>Sua nova senha gerada para acesso a plataforma AtletasNOW é:</p><p><font size="5">' . $new_pass .'</font></p>. <p>Recomendamos após fazer login em sua conta, trocar a senha.</p></html>';

        //SETUP DE EMAIL
        $phpmailer = new SendEmail();
        $phpmailer->setToEmail(['email' => $email, 'name' => $user->display_name]);
        $phpmailer->setFromName('AtletasNOW - Sua hora é agora');
        $phpmailer->setSubject('Nova senha de usuário gerada - AtletasNOW');
        $phpmailer->setContent($html);
        
        //Envio do email
        $result = $phpmailer->send();

        //Se houve sucesso
        if(key_exists('success', $result)){
            //Retorna string erro
            return ['success' => ["forget-password" => "Uma nova senha foi gerada e enviada para o seu e-mail. Bem Vindo a AtletasNOW!"]];
        } else {
            //Retorna string erro
            return ['error' => ["forget-password" => "Houve erro no envio da nova senha. Tente novamente mais tarde."]];
        }         
        
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