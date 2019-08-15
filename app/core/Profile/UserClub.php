<?php 

namespace Core\Profile;

use Core\Database\PrivatemetaModel;
use Core\Database\UsermetaModel;
use Core\Database\UserModel;
use Core\Database\ListClubModel;
use Core\Service\Follow;
use Core\Service\Notify;
use Core\Utils\AppValidation as AppValidation;

class UserClub extends User {

    public    $max_users;
    public    $current_users;
    protected $privatemeta;
    protected $fixedParam;
    const     TYPE_CHILD = 2;

    //Override função da parent class para atribuir parametros especificos
    public function __construct($args = array()) {

        //Inicializa modelos e classes
        $this->model        = new UserModel();
        $this->appVal       = new AppValidation();
        $this->privatemeta  = new PrivatemetaModel();

        //Retorna instancia do usuario
        $this->selfUserInstance($args);
        
    }

    /** Retorna dados de usuário em contexto */
    private function selfUserInstance($args = array()) {
        
        //Verifica se parametros estão presentes
        if (array_key_exists('user_email', $args) 
        && array_key_exists('user_pass', $args)) {

            //Carrega respectivo user no banco
            if ($this->model->load(['user_email' => $args['user_email'], 'user_pass' => $args['user_pass']])) {
                //Retorna array de dados
                $user = $this->model->getData(); 
                //Verifica se há dados
                if (!is_array($user) || count($user) <= 0)  return null;
                
                //Instanciando classe user
                $this->get($user['ID']);
                
                //Inicia atributos únicos dessa classe
                $this->_setAttributes(); 

                //Retorna usuário
                return;

            } else {
                return null;
            } 

        } else {
            return null;
        }
    }

    /** Função para inicializar atributos exclusivos da classe */
    private function _setAttributes() {

        //parent_user => Id do clube
        //type => tipo de usuario profissional do esporte
        $this->fixedParam = [
            'meta_key'      => 'parent_user',
            'meta_value'    => $this->ID                  
        ];

        //Retornar numero de usuários cadastrados
        $this->current_users = $this->_currentNumUsers();

        //Retornar qtd maximo de usuários permitidos
        $this->max_users = $this->_getMaxUsers($this->type);

    }

    /** 
     * Retorna todos os usuários pertencentes ao clube 
     * 
     * @version 2.1 - Permitido filtragem através de argumento $filter(array)
     * @since 2.0
     * */
    public function getTeamUsers(Array $filter = [], bool $minProfile = true) {
        
        //Retorna se houve erro ou nenhum usuário
        if(count($this->current_users['ids']) <= 0){
            return ['error' => ['users' => 'Nenhum usuário a exibir.']];
        }

        //array de users
        $users = [];

        //Se há ids de usuário a filtrar
        if (count($filter) > 0) {
            //Faz comparação de ids de usuários
            $this->current_users['ids'] = array_flip(
                array_only(array_flip($this->current_users['ids']), $filter));
        }

        //Percorre array atribuindo usuário
        foreach ($this->current_users['ids'] as $id) {
            
            //Inicializa a classe de usuário (User)
            $user = new parent;
            
            //Se houve erro, por causa de usuário inativado
            if (array_key_exists('error', 
                $item = ($minProfile)? $user->getMinProfile($id) : $user->get($id))) {
                continue;
            }

            /**
             *  Se usuário estiver inativado adicionar parametro ao array
             *  @since 2.1
             */
            if ($this->model->load($id) && $this->model->user_status == 1) {
                $item['status'] = 1;
            }

            //Atribui usuário
            $users[] = $item;
        }

        //Retorna se houve erro ou nenhum usuário
        if(count($users) <= 0){
            return ['error' => ['users' => 'Nenhum usuário a exibir.']];
        }

        //Retorna lista de usuários
        return $users;

    }

    /** 
     *  Adicionar ou remover usuário como integrante de equipe/instituição
     *  @since 2.1
     */
    public function setUserToTeam(int $user_id){
        
        //Retorna instancia do usuário
        $user = $this->getUser($user_id);

        //Verifica se usuário já pertecente a alguma equipe = metadado 'parent_user'
        if(is_array($user->metadata) && key_exists('parent_user', $user->metadata)) { 
            
            //Retornar dados da equipe pertencente
            $equipe = $this->getUser($user->metadata['parent_user']['value']);

            //Se equipe for diferente do requisitante
            if ($equipe->ID != $this->ID) {
                //Mostrar mensagem de erro
                return ['error' => ['user' => 'Não foi possível concluir a ação. Este usuário já pertence à equipe ' . $equipe->display_name ]];
            }

            //Remover usuário de integrar da equipe da instituição
            $result = $this->removeUser($user);
            
        } else {
            //Adicionar usuário como integrante
            $result = $this->addUser([], $user);
        }

        /**
         *  Automaticamente setar usuário como seguidor
         *  @since 2.1
         */
        if($result) {
            //Instaciar classe de usuário que foi adicionado ao clube
            $follow = new Follow($user);
            
            //Definir que este siga o clube
            $isFollow = $follow->addFollow($this->ID, false);
        }

        //Retorna mensagem
        return $result;
    }

    /** Adicionar usuário pertecente a usuário pai = instituto */
    public function addUser(Array $data = [], User $user = null) {

        //Verifica se ainda é possível adicionar usuários
        if(!$this->current_users['qtd'] > $this->max_users){
            return ['error' => ['register', 'Você já atingiu número máximo de usuários permitidos']];
        }

        //Define parametros de dados para atribuição de usuário a equipe
        $userData = array_merge($data);
        
        //Propriedade para setar usuário como pertencente ao clube
        $addClubProperties = [
            'parent_user' => $this->ID, 
            'clubes' => $this->ID
        ];

        //Se usuário estiver sendo criado
        if (is_null($user)) {
            
            // definir o tipo de usuário padrão
            $userData = array_merge($userData, [
                'type' => (!empty($data['type']))? (int) $data['type'] : self::TYPE_CHILD 
            ]);

            //Adiciona usuário ou atualizar e atribuir resposta
            $response = $this->add($userData);

            //Se houve algum erro na inserção de usuário
            if(key_exists('error', $response)){
                return $response;
            }

            //Carrega dados do usuário inserido
            $this->model->load(['user_email' => $userData['user_email']]);

            //Atribui ID do usuario
            $user_id = $this->model->ID;

            //Envia email de bem vindo (apenas usuários criados)
            Login::welcomeEmail($userData['user_email'], $userData['display_name']);  

        } else {
            
            //Atualiza dados básicos de usuário
            $response = $user->update($userData); 

            /**
             * Setar propriedades em usuário e definindo não exibir notificação ao clube (anteriormente enviamos o dado via $user->update que gerava notificação desnecessária ao clube)
             * @since 2.1
             */
            foreach ($addClubProperties as $key => $value) {
                
                //Se registrar 'parent_user' o valor tem que ser único
                if ($key == 'parent_user') {
                    $newData = $value;
                } else {
                    //Retorna dados armazenados no bd
                    $oldData = (key_exists('clubes', $d = $user->getmeta([$key])))? $d['clubes']['value'] : [];

                    //Atribui novo valor
                    $ids = [$value];

                    //Percorre clubes anteriores e adicionando IDs 
                    foreach ($oldData as $club) {
                        $ids[] = $club['ID'];
                    }

                    //Atribui id do clube ao existentes e remove valores duplicados
                    $newData = array_unique($ids);
                }
                
                //Gravar dados no perfil do usuário
                $user->setmeta($key, $newData, true, false);
            }            

            //Atribui ID do usuario
            $user_id = $user->ID;       
        }   
        
        //Verificar qual mensagem exibir de acordo com a solicitação
        if (key_exists('success', $response)) {
            
            try {
                //Adicionar selo de aprovado
                $this::updateClubCertify($user_id, $this->ID, true);

                //Adicionar notificação ao usuário sendo adicionado a equipe
                $notify = new Notify($this);
                $notify->add(10, $user_id, $this->ID);

            } catch (\Exception $th) {
                //@todo Implementar log
            }            

            //Retorna mensagem
            return ['success' => ['user' => 'Usuário agora está fazendo parte de sua equipe.']];

        } else {
            //Retorna mensagem
            return ['error' => ['user' => 'Houve algum erro em sua solicitação. Tente novamente.']]; 
        }

    }

    /** Atualizar usuário com pertence a propriedade */
    public function updateUser(Array $data, int $id) {

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

    /** Reativar um usuário */
    public function activeUser($id) {

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

    /** 
     * Função a ser invocada estaticamente para verificar se clube existe como usuário na plataforma 
     * 
     * @return array
     * @since 2.0
     * */
    public static function getAllClubs():array {

        //Instanciando modelo e data a retornar
        $clubMeta = new ListClubModel();
        $clubs = $clubMeta->getIterator(['meta_key' => 'type', 'meta_value' => ['4','5']]);

        //Se não existir usuário, retorna array vazio
        if ( $clubs->count() <= 0) {
            return [];
        }

        //Inicializado array para atribuir info de clubes
        $clubList = [];

        //Percorrendo array e atruindo info
        foreach ($clubs as $club) {
            
            //Verifica se é valido
            if ( !$clubs->valid() ) {
                continue;
            }
            
            //Retornando informações do usuário em loop
            $currentData = $club->getData();

            //Inicializando classe de usuário
            $user = (new self)->get( (int) $currentData['user_id']);
            
            //Se usuário não existir
            if (key_exists('error', $user)) {
                continue;
            }

            //Atribuindo dados de clube ao array
            $clubList[] = [
                'ID' => $user->ID,
                'display_name' => $user->display_name
            ];

        }

        return $clubList;     

    }   

    /** 
     * Função para remover usuário da equipe sem excluir da plataforma
     * @param $user User = classe de usuário
    */
    private function removeUser(User $user){
        
        //Setar usermeta para remoção
        $result = $user->set('parent_user', true );

        //Verificar qual mensagem exibir de acordo com a solicitação
        if ($result) {
            
            //Instanciar a classe de notificação
            $notify = new Notify($this);

            //Adicionar notificação ao usuário sendo removido da equipe
            $notify->add(11, $user->ID, $this->ID);

            return ['success' => ['user' => 'Usuário não faz mais parte de sua equipe.']];
        } else {
            return ['error' => ['user' => 'Houve algum erro em sua solicitação. Tente novamente.']]; 
        }

    }

    /** 
     * Verifica a existência de clube e envia notificação
     * @param $clubID   int => Id do clube
     * @param $user_id  int => Id do usuário
    */
    public static function isClubExist( int $clubID, int $user_id ):bool {

        //Verifica se houve envio correto para verificação
        if($clubID == 0) {
            return false;
        }

        //Instanciando modelo e data a retornar
        $clubMeta = new ListClubModel();
        $response = $clubMeta->load([
            'user_id' => $clubID , 
            'meta_key' => 'type', 
            'meta_value' => ['4']]);

        return $response;
    }

    /** Retorna máximo de usuários a manipular */
    private function _currentNumUsers() {
        
        //Retorna numero de usuários
        $model = new UsermetaModel();
        
        //Retorna todos metadados com propriedade
        $childUsers = $model->getIterator($this->fixedParam);

        //Array para reservar
        $userIDS = [];

        /** 
         * Importante contagem, apenas "Profissionais do Esporte"  
         * @since 2.1
         * */
        $qtdProfessionalUsers = 0; 

        //Percorre array de usuários
		foreach ($childUsers as $user) {
            
            //Verifica se é valido
            if ( !$childUsers->valid() ) {
                continue;
            }

            //Atribui id de usuário
            try {
                $user = $user->getData();
                $id = $user['user_id'];
            } catch (\Throwable $th) {
                //throw $th;
                continue;
            }            
            
            //Atribui IDS de usuários
            $userIDS[] = $id;

            //Retorna o tipo de usuário
            $typeUser = $this->getUserType($id);

            //Se usuário for do tipo profissional do esporte, contabilizar
            if($typeUser['ID'] == 2) {
                $qtdProfessionalUsers++;
            }            
            
        }

        $currentUsers = array_merge([
            'qtd' => (int) $qtdProfessionalUsers, 
            'ids' => $userIDS
        ]);

        return $currentUsers;
    }

    /** Retorna máximo de usuários a manipular */
    private function _getMaxUsers($type) {
        //privatemetadados para retornar qtd de usuários permitidos
        $max = $this->privatemeta->load(['usertype' => $type['ID'], 'meta_key' => 'max_users']);
        return ($max) ? (int) $this->privatemeta->meta_value : null;
    }

}