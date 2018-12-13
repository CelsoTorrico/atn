<?php 

namespace Core\Profile;
use Core\Database\PrivatemetaModel;
use Core\Database\UsermetaModel;
use Core\Database\UserModel;

class UserClub extends User{

    protected $max_users;
    protected $current_users;
    protected $userModel;
    protected $metaModel;
    protected $fixedParam;
    const     TYPE_CHILD = 2;

    private function _initClasses(){

        //parent_user => Id do clube
        //type => tipo de usuario profissional do esporte
        $this->fixedParam = [
            'meta_key'      => 'parent_user',
            'meta_value'    => (int) $this->ID,
            /*'AND' => [
                'meta_key'      => 'type',
                'meta_value'    => self::TYPE_CHILD
            ]*/                    
        ];

        //Retornar numero de usuários cadastrados
        $this->current_users = $this->_currentNumUsers();

        //Retornar qtd maximo de usuários permitidos
        $this->max_users = $this->_getMaxUsers();

    }

    public function getUsers(){

        //Inicializa valores padrões
        $this->_initClasses();
        
        //Retorna se houve erro ou nenhum usuário
        if(count($this->current_users['ids']) <= 0){
            return ['error' => ['users' => 'Nenhum usuário a exibir.']];
        }

        //array de users
        $users = [];

        //Percorre array atribuindo usuário
        foreach ($this->current_users['ids'] as $id) {
            //Se houve erro, por causa de usuário inativado
            if (array_key_exists('error', $user = $this->get($id))) {
                continue;
            }

            //Atribui usuário
            $users[] = $user;
        }

        //Retorna se houve erro ou nenhum usuário
        if(count($users) <= 0){
            return ['error' => ['users' => 'Nenhum usuário a exibir.']];
        }

        //Retorna lista de usuários
        return $users;

    }

    /** Adicionar usuário pertecente a usuário pai = instituto */
    public function addUser(Array $data){

        //Inicializa classes
        $this->_initClasses();

        //Define parametros de dados para inserção
        $userData = array_merge($data, ['parent_user' => $this->ID, 'type' => self::TYPE_CHILD]);

        //Verifica se ainda é possível adicionar usuários
        if(!$this->current_users['qtd'] > $this->max_users){
            return ['error' => ['register', 'Você já atingiu número máximo de usuários permitidos']];
        }

        //Adiciona usuário e pega resposta
        $response = $this->add($userData);

        //Retorna resposta
        return $response;


    }

    /** Atualizar usuário com pertence a propriedade */
    public function updateUser(Array $data, $id){
        
        //Inicializa classes
        $this->_initClasses();

        //Somente perfis com propriedade
        if(!in_array($id, $this->current_users['ids']) ){
            //Retorna erro de permissão
            $result = ['error' => ['update', 'Você não pode permissão para modificar esse perfil.']];
        }  
    
        //Adiciona usuário e pega resposta
        $response = $this->register($data, $id);

        //Retorna resposta
        return $response;
    }

    /** Desativar um usuário */
    public function deleteUser($id){

        //Inicializa classes
        $this->_initClasses();

        //Somente perfis com propriedade
        if (!in_array($id, $this->current_users['ids'])) {
            //Retorna erro de permissão
            $result = ['error' => ['update', 'Você não pode permissão para modificar esse perfil.']];
        }  
    
        //Adiciona usuário e pega resposta
        $response = $this->desregister($id);

        //Retorna resposta
        return $response;

    }

    /** Reativar um usuário */
    public function activeUser($id){

        //Inicializa classes
        $this->_initClasses();

        //Somente perfis com propriedade
        if (!in_array($id, $this->current_users['ids'])) {
            //Retorna erro de permissão
            $result = ['error' => ['update', 'Você não pode permissão para modificar esse perfil.']];
        }  
    
        //Reativar usuário e pega resposta
        $response = $this->activateRegister($id);

        //Retorna resposta
        return $response;

    }

    //Retorna máximo de usuários a manipular
    private function _currentNumUsers(){
        
        //Retorna numero de usuários
        $model = new UsermetaModel();
        
        //Retorna todos metadados com propriedade
        $childUsers = $model->getIterator($this->fixedParam);

        //Array para reservar
        $userIDS = [];

        //Percorre array de usuários
		foreach ($childUsers as $user) {
            
            //Verifica se é valido
            if ( !$childUsers->valid() ) {
                continue;
            }
            
            //Atribui IDS de usuários
            $userIDS[] = $user->user_id;

        }

        $currentUsers = array_merge([
            'qtd' => (int) count($childUsers), 
            'ids' => $userIDS
        ]);

        return $currentUsers;
    }

    //Retorna máximo de usuários a manipular
    private function _getMaxUsers(){
        //privatemetadados para retornar qtd de usuários permitidos
        $max = new PrivatemetaModel(['usertype' => $this->type['ID'], 'meta_key' => 'max_users']);
        return ($max->meta_value) ? (int) $max->meta_value : null;
    }

}