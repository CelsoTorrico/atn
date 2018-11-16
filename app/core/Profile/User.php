<?php 

namespace Core\Profile;

use Core\Interfaces\UserInterface as UserInterface;
use Core\Database\UserModel as UserModel;
use Core\Profile\PasswordHash as PasswordHash;
use Closure;
use Core\Utils\AppValidation as AppValidation;
use Core\Database\UsermetaModel;


class User{

    private $model;
    private $metaModel;
    public $id;
    public $login;
    public $email;
    public $display_name;
    
    //Contrução da classe
    public function __construct($args = array()){

        $this->model = new UserModel();
        $this->appVal = new AppValidation();
        $this->metaModel = new UsermetaModel();
        
        //Verifica se parametros estão presentes
        if(array_key_exists('user_login', $args) 
        && array_key_exists('user_pass', $args)){

            $this->get(array(
                'user_login' => $args['user_login'], 
                'user_pass' => $args['user_pass']));
        }
    }

    /** Adiciona valores as variaveis publicas */
    private function setVars(Array $data){

        $valid = array(
            'ID' => 'ID',
            'user_login' => 'user_login',
            'user_email' => 'user_email',
            'display_name' => 'display_name'
        );

        foreach ($valid as $key => $value) {
            $this->$key = $data[$value];
        }

    }

    /* Retorna um usuário especifico */
    public function get( $filter = array() ){
        
        //Verifica se existe usuário
        if(!$this->model->load($filter)){
            return "Usuário inexistente."; //TODO: retornar objeto
        }
        
        //Add valores a variaveis
        $this->setVars($this->model->getData());

        return $this->model->getData();

    } 

    /* Retorna lista de usuários */
    public function getFriends( $filter = array() ){
        //Invoca função de retornar lista de usuários
        $friends = new Friends();      
    } 

    /* Atualizar um único usuário */
    public function update( $ID, $data ){
        
        // Retorna id de empresa relacionado ao projeto
        $result = $this->connect->pdo->add('user',
            ['company'],
            ['id' => $ID ]);

        //Se tipo de usuário não foi definido
        if( !isset($data['type_user']) ){
            $data['type_user'] = 0;
        }

        // Se retorno for verdadeiro
        if($result){
            return $this->insertMultipleUsers($data, $projectID, $result['company']);    
        }
    } 

    /* Addicionar um único usuário */
    public function add($data){
        return $this->register($data);
    } 
    
    /* Insere um único usuário */
    function delete( $userID ){ 
        
    }

    /* Adicionar um novo usuário ou atualizar existente no sistema */
    protected function register(Array $data){

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

        //DB::User
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

            //Instanciando classe e Realizando login
            $login = new Login();

            //Envia dados para método de classe (usado $data['user_pass'] para ser verificado)
            $loginResponse = $login->setLogin(['user_email' => $filtered['user_email'], 'user_pass' => $data['user_pass']]);

            //Verifica se houve erro login e mostra mensagem
            if(array_key_exists('error', $loginResponse)){
                return $loginResponse;
            }

            //Mensagem de sucesso no cadastro
            return ['success' => ['register' => 'Seu cadastro foi realizado com sucesso! Bem Vindo!']];

        }
        else{
            //Mensagem de erro no cadastro
            return ['error' => ['register' => 'Houve erro em seu cadastro. Contate nosso administrador.']];
        }

    }

    /*Se usuário não tiver acesso finaliza função */
    function hasPermission($role){

        /*$error = true;

        // Verifica se usuário esta logado
        if (!$this->isLogged()) {
            //TODO: Implementar classe Error e adicionar códigos erro
            $error = '';
        }

        // Verifica se objeto Erro
        if (is_a($error, 'Error')) {
            //TODO: Implementar essa funcionalidade para terminar execucação do código
            die();
        }*/

        return true;
    }

    function notAuthorized(){
        //TODO: Implementar um mensagem de erro de acesso recusado ao post
        $response = ("Você não tem acesso para acessar!");
        return $response;
    }    

    //TODO: Formatar para PHP
    protected function verifySentData($data) {
        
        //Inicia classe Validação
        $val = $this->appVal;
        
        //Executa função de checar inputs
        $filtered = $val->check_user_inputs($data);

        //Checkando data e erros
        return $this->checkSentData($filtered);
    }

    //TODO: Formatar para PHP
    protected function checkSentData($data) {

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

    protected function hashPassword($pass){
        
        //Inicia classe de password. Compatibilidade Wordpress
        $passwordHash = new PasswordHash(8, true);

        //Hasheando password
        return $passwordHash->HashPassword($pass);
    }

}