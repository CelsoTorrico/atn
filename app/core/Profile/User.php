<?php 

namespace Core\Profile;

use Core\Interfaces\UserInterface as UserInterface;
use Core\Database\UserModel as UserModel;
use Core\Utils\PasswordHash as PasswordHash;
use Core\Utils\AppValidation as AppValidation;
use Core\Database\UsermetaModel;
use Symfony\Component\HttpFoundation\Session\Session;

use Closure;


class User{

    protected $model; //db user model
    protected $metaModel; //db usermeta model
    protected $appVal; //class validation
    
    public $ID;
    public $user_login;
    public $user_email;
    public $display_name;
    public $type; //usermeta
    public $sport; //usermeta
    
    //Contrução da classe
    public function __construct($args = array()){

        $this->model = new UserModel();
        $this->appVal = new AppValidation();
        $this->metaModel = new UsermetaModel();
        
        //Verifica se parametros estão presentes
        if(array_key_exists('user_login', $args) 
        && array_key_exists('user_pass', $args))
        {

            $this->get(array(
                'user_login' => $args['user_login'], 
                'user_pass' => $args['user_pass']));
        }
        else{
            return;
        }
    }

    //Retorna usuário atual baseado em ID e Cookie
    //Para ser acessado fora da classe
    public static function get_current_user($id = null){

        //Verifica se sessão foi inicializada
        if(! Login::isLogged()){
            return null;
        }

        //Retorna usuário
        $session = new Session();

        //Verifica se existe sessão ativa
        if(!$session->has(Login::userCookie())){
            return null;
        }

        //Instancia classe User
        $user = new User();

        //Retorna dados armazenados
        $data = $session->get(Login::userCookie(), null);

        //Instanciando classe de Cookie
        $cookie = (isset($_COOKIE[Login::getCookie()]))? $_COOKIE[Login::getCookie()] : false; 

        //Verifica dados do cookie com banco
        if(!is_null($data) && password_verify($data, $cookie)){
            
            //Retorna dados do banco
            $fields = $user->get([
                'user_login' => $data
            ]);

            //Instancia classe para utilização
            return $user = new User([
                'user_login' => $fields['user_login'], 
                'user_pass' => $fields['user_pass']
            ]);
        }
        else{
            
            return null;
        }
            
    }

    /** Adiciona valores as variaveis publicas */
    private function setVars(Array $data){

        $valid = array(
            'ID'            => 'ID',
            'user_login'    => 'user_login',
            'user_email'    => 'user_email',
            'display_name'  => 'display_name',
            'type'          => 'type',
            'sport'         => 'sport',
            'cpf'           => 'cpf',
            'city'          => 'city'
        );

        foreach ($valid as $key => $value) {
            if(!array_key_exists($key, $data)){
                continue;
            }
            $this->$key = $data[$value];
        }

    }

    /* Retorna um usuário especifico */
    public function get( $id ){

        $filter = ['id' => (int) $id];
        $usermetaFilter = ['user_id' => (int) $id];
        
        //Verifica se existe usuário
        if(!$this->model->load($filter)){
            return "Usuário inexistente."; //TODO: retornar objeto
        }

        //Verifica se existe usuário
        $usermeta = $this->metaModel->load($usermetaFilter);
        
        //Add valores a variaveis
        $this->setVars($this->model->getData());

        //Add valores a variaveis
        if($usermeta){
            $this->setVars($this->metaModel->getData());
        }

        return [ $this->model->getData(), $this->metaModel->getData() ];

    } 

    /* Retorna lista de usuários */
    public function getFriends( $filter = array() ){
        
        //Invoca função de retornar lista de usuários
        $friendsList = new Friends($this->ID, $filter);
        
        return $friendsList;      
    } 

    /* Addicionar um único usuário */
    public function add($data){
        return $this->register($data);
    } 

    /* Atualizar um único usuário */
    public function update( $ID, $data ){
        
    } 
    
    /* Insere um único usuário */
    function delete( $userID ){ 
        
    }

    /* Adicionar um novo usuário ou atualizar existente no sistema */
    protected function register(Array $data):array{

        //Verifica se password está correta
        if( $data['user_pass'] != $data['confirm_pass'] ){
            return ['error' => ['confirm_pass' => 'Confirme a senha corretamente.']];
        }

        //Filtrar inputs e validação de dados
        $filtered = $this->verifySentData($data);

        //Verifica se houve erro retorna
        if( array_key_exists('error', $filtered) && count($filtered['error']) > 0 ){
            return array('error' => $filtered['error']);
        }

        //Converte password em hash
        $filtered['user_pass'] = $this->hashPassword($filtered['user_pass']);

        //Colunas válidas
        $userColumns = array(
            'user_login','user_pass','user_email','display_name'
        );

        //Valido colunas de 'usermeta'
        $usermetaColumns = array(
            'type','sport','birthdate','cpf','telefone','weight','gender','state'
        );

        //Preenche colunas com valores
        $this->model->fill(array_only($filtered, $userColumns)); 

        //Salva os dados no banco
        $result = $this->model->save();

        //SE resultado for true, continua execução
        if($result){

            $primaryKey = $this->model->getPrimaryKey();
            $usermetaID = [];

            //Percorre array
            foreach ($usermetaColumns as $key) {
                
                //Se não existir no array -> pula
                if(!array_key_exists($key, $filtered) ){
                    continue;
                }                

                //Adicionando valores as colunas
                $this->metaModel->user_id     = $primaryKey['ID'];
                $this->metaModel->meta_key    = $key;
                $this->metaModel->meta_value  = $filtered[$key];
                
                //Aplica salvar no BD
                if( $this->metaModel->save() ){
                    $usermetaID[$key] = $this->metaModel->getPrimaryKey();
                }
                
                //Reseta classe Model
                $this->metaModel = new UsermetaModel();
            }

            //Mensagem de sucesso no cadastro
            return ['success' => ['register' => 'Seu cadastro foi realizado com sucesso! Bem Vindo!']];

        }
        else{
            //Mensagem de erro no cadastro
            return ['error' => ['register' => 'Houve erro em seu cadastro. Contate nosso administrador.']];
        }

    }   

    //Verifica os dados enviados pelo usuário, faz validação e formata
    protected function verifySentData($data):array{
        
        //Inicia classe Validação
        $val = $this->appVal;
        
        //Executa função de checar inputs
        $filtered = $val->check_user_inputs($data);

        //Checkando data e erros
        return $this->checkSentData($filtered);
    }

    //TODO: Formatar para PHP
    protected function checkSentData($data):array{

        //Inicia classe Validation
        $val = $this->appVal;

        //Executa função de checar inputs
        $checked = $val->check_filtered_inputs($data);

        //Montando query e executando
        $searchQuery = $this->model->load([
            'user_email' => $checked['user_email']
        ]);

        //Verificando se resposta foi verdadeira
        if($searchQuery){            
            //Adicionando ERRO
            $checked['error'][] = array('user_email' => "E-mail já atribuido a um usuário."); 
        }
        
        return $checked;

    }

    //Instancia classe PasswordHash e retorna string hashead
    protected function hashPassword($pass):string{
        
        //Inicia classe de password. Compatibilidade Wordpress
        $passwordHash = new PasswordHash(8, true);

        //Hasheando password
        return $passwordHash->HashPassword($pass);
    }

    /* Se usuário não tiver acesso finaliza função */
    //TODO: Implementar lógica
    function hasPermission( $exist = 'ID', Array $data):bool{
        
        //Verifica se existe no array
        if(!array_key_exists($exist, $data)){
            return false;
        }

        //Verifica se ID é igual
        if($data[$exist] != $this->ID){
            return false;
        }

        //retorna resultado
        return true;
        
    }

}