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
        $this->cookieToken = $userData['token'];
        
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

    public function forgetPassword(string $email) {
       
        //Se tem token atribuido juntamente com dados
        if(empty($email)) {
            //Executa login social
            return ['error' => ['forgetPassword' => 'E-mail de usuário não foi submetido']];            
        }

        //aplicando filtro de string
        $email = filter_var($email, FILTER_SANITIZE_EMAIL); 

        //Instancia LoginModel para verificar existencia de usuário via user_login
        $this->model = new LoginModel();

        //Verifica se existe usuário, passando array de dados
        if (!$this->model->load(['user_email' => $email])) {
            return ['error' => ['forgetPassword' => 'Usuário inexistente.']];
        }

        //Instanciando classe de verificação de passwords Wordpress = (8, true)
        $passwordClass = new PasswordHash(8, true);

        $new_pass = $passwordClass->HashPassword($email);

        //Comparação de senhas
        $sessionAuth = $passwordClass->CheckPassword($email, $new_pass);

        if(!$sessionAuth){
            //Retorna string erro
            return ['error' => ["forgetPassword" => "Houve um erro em gerar uma nova senha para este usuário. Tente novamente mais tarde."]]; 
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
            return ['error' => ["forgetPassword" => "Houve um erro em gerar uma nova senha para este usuário. Tente novamente mais tarde."]]; 
        }

        //CONTEUDO
        $html = '<div style="font-family: Open Sans, Calibri, Arial, cursive;">
                    <h1 style="font-family:Axiforma;color:#d03014;">Nova senha de acesso gerada!</h1>
                    <p style="color:#444;font-size:14px;">Sua nova senha de acesso à plataforma <b>AtletasNOW</b> esta logo abaixo, Recomendamos após fazer login em sua conta, trocar a senha.</p>
                    <p style=""><font size="5">' . $new_pass . '</font></p>
                    <p style="color:#444;font-size:14px;">Suporte AtletasNOW</p>
                    <img width="137" height="17" src="https://www.atletasnow.com/wp-content/uploads/2018/10/rsz_atletasnow_logoprincipal-01.png" title="AtletasNOW">
                </div>';

        //SETUP DE EMAIL
        $phpmailer = new SendEmail();
        $phpmailer->setToEmail(['email' => $email, 'name' => $user->display_name]);
        $phpmailer->setFromName('AtletasNOW - Sua hora é agora');
        $phpmailer->setSubject('Nova senha de acesso - AtletasNOW');
        //Carrega template prédefinido
        $phpmailer->loadTemplate('recoverPassword', ['newpass' => $new_pass]);
        
        //Envio do email
        $result = $phpmailer->send();

        //Se houve sucesso
        if(key_exists('success', $result)){
            //Retorna string erro
            return ['success' => ["forgetPassword" => "Uma nova senha foi gerada e enviada para o seu e-mail. Bem Vindo a AtletasNOW!"]];
        } else {
            //Retorna string erro
            return ['error' => ["forgetPassword" => "Houve erro no envio da nova senha. Tente novamente mais tarde."]];
        }         
        
    }

    /**
     * Envia ao usuário cadastrado email de bem vindo a plataforma
     * 
     * @param string $string Email do usuário a enviar email
     * @since 2.1
     */
    public function sendWelcomeEmail(string $email, string $displayName = null) {
        return $this->welcomeEmailAfterRegister($email, $displayName);
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

    private function completeProfileNotify() {
        
    }

    /**
     * Envia ao usuário cadastrado email de bem vindo a plataforma
     * 
     * @param string $string Email do usuário a enviar email
     * @since 2.1
     */
    private function welcomeEmailAfterRegister(string $email, string $displayName) {

        //Filtrando e sanitinizando email
        $email = filter_var($email, FILTER_SANITIZE_EMAIL);
        
        //SETUP DE EMAIL
        $phpmailer = new SendEmail();
        $phpmailer->setToEmail(['email' => $email, 'name' => $displayName]);
        $phpmailer->setFromName('AtletasNOW - Sua hora é agora');
        $phpmailer->setSubject('Bemvindo para a AtletasNOW');
        
        //Carrega template prédefinido
        $phpmailer->loadTemplate('welcome', ['email' => $email, 'name' => $displayName]);

        return $phpmailer->send();
        
    }

}