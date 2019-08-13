<?php 

namespace Core\Profile;

use Core\Profile\User;
use Core\Database\UserConfigModel;

/**
 * Classe para gerenciar dados de configuração do usuário 
 * 
 * @since 2.1
 * @param   User $user  Classe de usuário de contexto
 */
class UserSettings {

    private $config;
    private $model;
    private $user;

    //Contrução da classe
    public function __construct(User $user) {
        
        //Inicializa modelos e classes        
        $this->model    = new UserConfigModel(); 
        $this->config   = null;
        $this->user     = $user;

        //Atribui dados de usuário
        $this->model->load(['user_id' => $user->ID]);
    }

    /** Retorna valor pelo tipo */
    function __get(string $name)
    {
        //Retorna configuração pelo nome
        $this->__getConfig($name);

        //Retorna ultima valor buscado
        return $this->getLastValue();
    }

    /** Retorna ultimo valor inserido ou requisitado */
    function getLastValue() {
        return $this->config;
    }

    /** Retorna todos os tipos e valores de configuração do usuário */
    function getAllUserConfig():array{

        //Instanciando novo modelo
        $model = new UserConfigModel();
        
        //Retorna objeto de dados
        $allUserconfig = $model->getIterator(['user_id' => $this->user->ID]);
        
        //array de atribuicao
        $configArray = [];

        //Atribuindo cada configuracao ao array
        foreach($allUserconfig as $config){
            
            if(!$allUserconfig->valid()) continue;

            $configArray[] = $config->getData();

        }

        //Retorna array
        return $configArray;
    }

    function __set(string $name, $value = null)
    {
        return $this->__setConfig($name, $value);
    }

    /** Retorna dados pelo config_type */
    private function __getConfig(string $config_type) {
        
        //Verifica se tipo de dados existe
        if(!$this->model->load(['user_id' => $this->user->ID, 'config_type' => $config_type])) {
            return null;
        }

        //Atribui dados encontrados ao var
        $this->config = $this->model->config_value;
        
    }

    /** Seta/Cria dados pelo config_type */
    private function __setConfig(string $config_type, $config_value = null) {

        //Array de data da configuração
        $data = ['user_id' => $this->user->ID, 'config_type' => $config_type];

        //Verifica se tipo de dados existe
        $this->model->load($data);

        //Verifica se é inserção de novo tipo de dado
        if ($this->model->isFresh()) {
            
            //preenche o modelo para adicionar ao banco
            $this->model->fill(array_merge($data,['config_value' => $config_value]));

            //Insere no BD
            $saved = $this->model->save();

        } else {
            
            //Preenche apenas o dado a atualizar
            $this->model->config_value = $config_value;
            
            //Atualiza no BD
            $saved = $this->model->update('config_value');
        }

        //Atribui dados encontrados ao var
        $this->config = $this->model->config_value;
        
        //Retorna dados
        return $saved;

    }

    


}