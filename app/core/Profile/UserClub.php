<?php 

namespace Core\Profile;
use Core\Database\PrivatemetaModel;
use Core\Database\UsermetaModel;
use Core\Database\UserModel;
use Core\Database\ListClubModel;
use Core\Service\Notify;

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

    //Função a ser invocada estaticamente para verificar se clube existe como usuário na plataforma
    public static function getAllClubs():array{

        //Instanciando modelo e data a retornar
        $clubMeta = new ListClubModel();
        $clubs = $clubMeta->getIterator(['meta_key' => 'type', 'meta_value' => ['4','5']]);

        //Se não existir usuário, retorna array vazio
        if( $clubs->count() <= 0){
            return [];
        }

        $clubList = [];

        foreach ($clubs as $club) {
            
            //Verifica se é valido
            if ( !$clubs->valid() ) {
                continue;
            }
            
            //Atribui dados do comentário
            $currentData = $club->toArray();
            $clubList[] = [
                'ID' => $club->umeta_id,
                'display_name' => $club->user_id->display_name
            ];

        }

        return $clubList;        

    }   

    /** 
     * Verifica a existência de clube e envia notificação
     * @param $clubID  int ou string
    */
    public static function isClubExist( int $clubID, int $user_id ):bool{

        //Verifica se houve envio correto para verificação
        if($clubID == 0) {
            return false;
        }

        //Instanciando modelo e data a retornar
        $clubMeta = new ListClubModel();
        $response = $clubMeta->load(['user_id' => $clubID , 'meta_key' => 'type', 'meta_value' => ['4']]);

        //Verifica se existe e retorna boolean
        if(!$response){
            //Retorna dados do usuário
            $user = (new UserClub)->get($user_id);
            
            //TODO: Verifica qual vai ser o texto para a notificação
            $content = ['msg' => `
                Esta pessoa informou que já foi atleta da instituição, você confirma essa informação?
            `];

            //Atribui perfil de usuário a mensagem
            $content = array_merge($content, $user );

            //Envia notificação
            $notify = Notify::add($content, 3, $clubID, $user_id);
        }

        return true;
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