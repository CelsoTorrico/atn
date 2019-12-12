<?php 

namespace Core\Profile;

use Illuminate\Auth\GenericUser;
use Core\Interfaces\UserInterface as UserInterface;
use Core\Utils\PasswordHash as PasswordHash;
use Core\Utils\AppValidation as AppValidation;
use Core\Utils\FileUpload;
use Core\Utils\SendEmail;
use Core\Database\UserModel as UserModel;
use Core\Database\UsermetaModel;
use Core\Database\UsertypeModel;
use Core\Database\SportModel;
use Core\Service\UserStats;
use Core\Profile\Resume\Resume;
use Core\Service\Favorite;
use Core\Service\Follow;
use Core\Service\Chat;
use Core\Service\Notify;

use Closure;
use stdClass;
use aryelgois\Medools\ModelIterator;
use Medoo\Medoo;
use PDO;
use Core\Database\UserViewModel;
use Guzzle\Plugin\CurlAuth\CurlAuthPlugin;

class User extends GenericUser{

    protected $model; //db user model
    protected $metaModel; //db usermeta model
    protected $usertypeModel; //db usertype
    protected $sportModel; //db sport
    protected $appVal; //class validation
    protected $socialLogin = FALSE;
    
    public $ID; //id
    public $user_login; //username
    public $display_name; //Nome real
    public $type; //tipo de usuário
    public $sport; //sports praticante
    public $clubs; //sports praticante
    public $metadata; //metadados genericos
    public $favorite; //Selo de favoritado
    public $following; //Selo de seguido
    public $totalFavorite; //Selo de favoritado
    public $totalMessages; //Selo de seguido
    public $totalNotifications; //Quantidade de notificações
    public $user_email; //email
    public $user_status; //Status de verificação de email
    
    //Contrução da classe
    public function __construct($args = array()) {

        //Inicializa modelos e classes
        $this->model = new UserModel();
        
        //Inicializa classe de valição de dados
        $this->appVal = new AppValidation();
        
        //Verifica se parametros estão presentes
        if (array_key_exists('user_email', $args) 
        && array_key_exists('user_pass', $args)) {

            //Carrega respectivo user no banco
            if ($this->model->load(['user_email' => $args['user_email'], 'user_pass' => $args['user_pass']])) {
                $user = $this->model->getData();
                return $this->getCurrentLoggedUser($user['ID']);
            } else {
                return null;
            } 

        } else {
            return null;
        }
    }

    //Retorna dados do usuário logado
    private function getCurrentLoggedUser(int $id){

        //Retorna usuário
        $this->get($id, $this);
        
        //Carrega classes
        $messages   = new Chat($this);
        $fav        = new Favorite($this);
        $notify     = new Notify($this);

        //totais de propriedades do usuário
        $this->setVars([
            'totalFavorite'  => [
                'otherFavorite' => $fav->getTotal('from_id'),
                'myFavorites'   => $fav->getTotal()
            ],
            'totalMessages'         => $messages->getTotal(),
            'totalNotifications'    => $notify->getTotal(),
        ]); 

        return $this;        
    }

    /**
     *  Retorna classe de usuário instanciada pelo id de usuario  válido
     * @param int $id   Id de usuário valido
     * @return User
     */
    public function getUser(int $id){
        
        //Classe Modelo de usuário
        $model = new UserModel(['ID' => $id]);        
        
        //Define a classe de usuário respectiva
        $user = User::typeUserClass($model);        

        //Instanciando classe Favorite e retorna status do usuário
        $fav = new Favorite($this);        
        $favorite = $fav->isUserFavorite($id);

        //Instanciando classe Follow e retorna status do usuário
        $follow = new Follow($this);
        $following = $follow->isUserFollowed($id);

        //Adiciona dados aos atributos de classe do usuário
        $user->setVars(['following' => $following, 'favorite' => $favorite]);

        //Remover metadados duplicados (os que já estão nos atributos da classe)
        if(!is_null($user->metadata)) {
            foreach (['type', 'sport', 'clubes', 'session_tokens'] as $key) {
                unset($user->metadata[$key]);
            }
        }

        //Finalmente retorna classe de usuário preenchida
        return $user;
    }

    /**
     * Retorna dados de usuário único por ID
     * @since 2.0
     * 
     * @param $class = Classe de usuário a ser preenchida
     * @return mixed
     */
    function get( int $id ) {

        //Filtro
        $filter = ['ID' => $id];

        //Verifica se existe usuário
        if (!$this->model->load($filter)) {
            return ['error' => ['user', "Usuário inexistente."]];
        }

        //Adicionando valores a variaveis
        $this->setVars($this->model->getData());

        //Verifica se existe usermetas de usuário
        $usermeta = $this->_getUsermeta($id);

        //Add valores de usuario as variaveis da classe
        if (is_array($usermeta) && count($usermeta)>0) {
            $this->setVars($usermeta);
            $this->metadata = $usermeta;
        } else {
            unset($this->metadata);
        }

        //Verifica se existe metadado tipo
        if (!is_null($type = $this->_getType($id))) {
            //Add valores a variaveis encontrados as variaveis da classe
            $this->setVars(['type' => $type]);
        }

        //Verifica se existe metadado de esporte
        if (is_array($usermeta) && array_key_exists('sport', $usermeta)) {
            //Retorna lista de esportes
            $sport = $this->_getSport();
            //Add valores a variaveis encontrados as variaveis da classe
            $this->setVars(['sport' => $sport]);
        }

        //Verifica se existe metadado de clubes
        if (is_array($usermeta) && array_key_exists('clubes', $usermeta)) {
            //Retorna lista de esportes
            $clubs = $this->_getClubs();
            //Add valores a variaveis encontrados as variaveis da classe
            $this->setVars(['clubs' => $clubs]);
        }              

        return $this;
    }

    /**
     *  Atribui um valor usermeta definida via parametros 
     * 
     *  @param $key  usermeta key
     *  @param $value usermeta value
     *  @since 2.1
     */
    public function set(string $key, $value) {
        
        //Verifica se existe usermetas de usuário
        return $this->_setUsermeta($key, $value);
    }


    /**
     *  Atribui um valor usermeta definida via parametros 
     * 
     *  @param $key  usermeta key
     *  @param $value usermeta value
     *  @since 2.1
     */
    public function setmeta(string $meta_key, $meta_value, bool $check, bool $notify, int $user_id = null ) {
        
        //Valor padrão
        if (is_null($user_id)) $user_id = $this->ID;
        
        //Registrar dados de usermeta de usuário
        return $this->register_usermeta($meta_key, $meta_value, $user_id, $check, $notify);
    }


    /**
     *  Retorna um valor usermeta definida via parametros 
     * 
     *  @param $key  usermeta key
     *  @param $value usermeta value
     *  @since 2.1
     */
    public function getmeta(array $only, int $user_id = null) {
        
        //Valor padrão
        if (is_null($user_id)) $user_id = $this->ID;

        //Verifica se existe usermetas de usuário
        return $this->_getUsermeta($user_id, $only);
    }

    /**
     * Retorna dados de usuário único por ID
     * @since 2.0
     * 
     * @return mixed
     */
    public function getMinProfile( int $id=null, $usermeta = [] ) {

        if(!is_null($id) && $id > 0){
            //Filtro
            $filter = ['ID' => $id];

            //Retorna instancia de modelo User
            $userData = $this->model->getInstance($filter);
         
        } else{
            //Atribuindo dados do usuário corrente
            $userData = $this->model;
            $id = $this->model->ID;
        }

        /**
        * Para posts da plataforma atribuir ID = 0 a empresa AtletasNow 
        * @since 2.1 */
        if($id == 0) {
            $userData = new stdClass();
            $userData->ID = 0;
            $userData->type = 'administrator';
            $userData->display_name = 'AtletasNow';
            $userData->user_login = 'atletasnow';
            $userData->profile_img = [
                'value' => 'https://atletasnow.com/wp-content/uploads/2019/08/notify-icon.png'
            ];

            return $userData;
        }

        //Verifica se existe usuário
        if (!$userData) {
            return ['error' => ['user', "Usuário inexistente."]];
        }

        //Retorna dados do usuário
        $userData = [
            'ID' => $userData->ID,
            'display_name'  => $userData->display_name,
            'user_login'    => $userData->user_login,
            'type' => $this->_getType($userData->ID)
        ];

        //metadado default
        $usermetaDefault = ['profile_img'];

        //Se necessário incluir mais usermetadados
        if (count($usermeta) > 0) { 
            $usermetaDefault = array_merge($usermeta, $usermetaDefault);
        }
        
        //Adicione usermeta profile_img e mais se setado
        $userData = array_merge($userData, $this->_getUsermeta($id, $usermetaDefault));

        //Retorna dados
        return $userData;

    } 

    /** Retorna dados de estatistica */
    public function getStats(int $id = null) {

        //Se id for null, mostrar dados do usuário corrente
        if (is_null($id)){
            $user = $this->getUser($this->ID);
        } else {
            $user = $this->getUser($id); 
        }

        //Verifica se todos os campos tem informações para poder exibir
        if( is_null($user->metadata) || is_null($user->type)) {
            return ['error' => ['stats' => 'Nenhuma estatística a exibir.']];
        }
        
        //Campos gerais de estatisticas
        $stats = new UserStats($user->metadata, $user->type['ID'], $user->sport);
        
        //Setando estatisticas do banco
        $stats->setStats();

        //Retorna dados
        return $stats->get();

    }

    /** REtorna usuários com relevancia ao perfil logado 
     *  @return array
    */
    public function getFriendsSuggestions() {

        //Atributos de comparação
        $atributes  = ['type', 'sport','clubs', 'metadata'];
        $random     = array_rand($atributes, 2);
        $users      = ['success' => ['criterio' => []], 'found' => []];
        $query      = [];
        
        //Inicializa modelo
        $metaModel = new UsermetaModel();
        
        //Array de usuários
        $found = [];

        //Retornando lista de usuários já conectados
        $friendsList = $this->getFriends([], true);
        
        //Array para registrar chaves já utilizadas
        $usedKey = [];

        //Monta query dois parametros, melhorar correspondência
        foreach ($random as $key => $value) {

            //Atribui propriedade atual
            $k = $atributes[$value];

            //Se já foi utilizado
            if (in_array($k, $usedKey)) continue;

            //Executa função para montagem de query
            $fn = $this->friendsSuggestionsLogic($k);
            if (is_null($fn) || count($fn) <= 0) continue;

            //Limitar em 10 usuários por key
            $fn['LIMIT'] = 10;

            //Adiciona criterio de sugestão
            $users['success']['criterio'][] = $fn['meta_key'];

            //Adiciona parametro já pesquisado
            $usedKey[] = $k;

            //Verifica se houve algum resultado
            $founded = $metaModel->load($fn);
            if(!$founded){
                continue;
            }

            //Merge arrays de usuários
            $found = array_merge($found, $metaModel->dump($fn));

        }

        $repeteadUser = []; //Adicionar ids usuários a cada looping
        
        foreach($found as $key => $i) {

            //Atribuindo Id de usuario encontrado
            $id = (int) $i['user_id'];    

            //Se já existir, pular para proximo
            if (in_array($id, $repeteadUser)) continue;
            
            //Adicionado lista de repetição
            $repeteadUser[] = $id;
            
            //Verifica se usuário existe
            if (!$this->check_if_user_exist($id)) continue;

            //Se já conectado ou for mesmo que usuário atual, ir proximo
            if (in_array($id, $friendsList) || $id == $this->ID) {
                continue;
            }

            //Atribui ID ao array
            $user = $this->getUser($id);
            $users['found'][] = $user->getMinProfile(); 

        }
        
        //Retornando array de dados estatisticos
        return $users;

    }

    private function friendsSuggestionsLogic(string $randomKey):array {

        //Query var a ser montada
        $query = [];

        //Retorna usermeta do usuário de maneira randomica
        $selectedAttr = $randomKey;

        //Se for metadado escolhido, procurar valor randômico
        if ($selectedAttr == 'metadata') {
            
            //Keys utilizáveis
            $metadata = ['city', 'neighbornhood'];
            $k = array_rand(array_flip($metadata));
            $i=0;

            //Verifica se usuário tem a propriedade definida e com algum valor
            while ($i < 4 && (!array_key_exists($k, $this->metadata) || is_null($this->metadata[$k]))) {
                //Reatribui propriedade que exista e contenha valor
                $k = array_rand(array_flip($metadata));
                $i++;
            }

            //Se usuário não tiver os parametros, retorna null
            if (!key_exists($k, $this->metadata)){
                return [];
            }

            //Retorna usermeta do usuário de maneira randomica
            $userData = [$k => $this->metadata[$k]];
        }
        else{
            //Retorna a data seleciona randomicamente
            $userData = [$selectedAttr => $this->$selectedAttr];
        }    

        //Montando query baseado no quantidade de dados
        foreach ($userData as $key => $value) {
           
            //Se valor for nulo
            if (is_null($value)) {
                continue;
            }

            //Adiciona key
            $composing = [
                'meta_key' => $key
            ];

            //Se valor for array
            foreach ($value as $i => $v) {    
                
                //Se for array atribui chave com ID
                if (is_array($v) && isset($v['ID'])) {
                    $v = $v['ID'];
                }
                
                //Se for nenhum desse tipo, retorna
                if (!in_array($i, ['value', 'ID'])) continue;

                //Removendo espaços no inicio e fim da string
                $v = preg_replace('/(^\s|\s$)/', '', $v);

                //Adiciona meta_value
                ($i != 'ID' || is_int($i))?  $composing['meta_value[~]'] = ['%'.$v.'%'] :  $composing['meta_value'] = [$v]; 

                //Merge arrays
                $query = $composing;

            }
        }

        return $query;  

    }

    /** Retorna dados do usuário em formato PDF */
    public function getUserPdf(int $id = null){

        //Se id for null, mostrar dados do usuário corrente
        $user = (is_null($id))? $this : $this->get($id); 

        //Carrega classe de Resume e implementa os dados do usuário
        $resume = new Resume($user, $this->onlyUsermetaValid($user->type['ID']));

        //Retorna html
        $html = $resume->returnHTML();

        //Carrega classe de composição de PDFS e especifica caminho de download
        $mpdf = new \Mpdf\Mpdf();

        //Adiciona marca dagua
        $mpdf->showWatermarkImage = true;
        $mpdf->setAutoTopMargin= true;
        $mpdf->SetWatermarkImage('https://app-atletasnow.s3-sa-east-1.amazonaws.com/app-images/atletasnow-logotipo-300.png', 0.2, '', [130, 5]);
        
        //Escreve dados no PDF
        $mpdf->WriteHTML($html);

        //Definindo nome do arquivo
        $filename = 'resume-'. strtolower($user->user_login) . date('d-m-Y-h-hh-mm') . '.pdf';
        
        //Gera arquivo e forma de submeter
        $mpdf->Output( $filename, \Mpdf\Output\Destination::DOWNLOAD);

        //Retorna string com caminho do arquivo
        return $filename;
    }

    /* Retorna lista de usuários */
    public function getFriends( array $filter = array(), bool $onlyIDS = false ){

        //Invoca função de retornar lista de usuários
        $friendsList = new Friends($this->ID, $filter, $onlyIDS);
        
        return $friendsList->get();    
    } 

    /** 
     * Realiza busca de usuários baseado em parametros 
     * 
     * @since 2.1   Adicionado parametros para busca de membros em clubes/instituições
     * @since 2.0
     * */
    public function searchUsers(array $search, int $paged = 0) {

        //Busca em user
        $personal     = ['display_name', 'user_registered'];

        //Campos de busca do tipo String = LIKE
        $isMetaLike   = ['city', 'neighbornhood', 'formacao'];

        //Campos de busca do tipo string = '='
        $isMetaEqual  = ['type', 'state', 'gender', 'parent_user'];

        //Campos de busca do tipo array
        $isMetaArray  = ['clubs','sport', 'birthdate'];

        //Campos booleanos  = true or false
        $isMetaBool   = ['accept_assessments','photo', 'video'];

        //Variaveis para montar query
        $whereUser  = ['users.user_status[!]' => null];
        $whereIn    = [];

        //Quantidade de campos = Filtros
        $fields  = 0;

        //Qtd de itens por página
        $perPage = 100;
        
        //A partir de qual item contar
        $initPageCount = ($paged <= 1)? $paged = 0 : ($paged * $perPage) - $perPage;

        //Paginação de timeline
        $limit = [$initPageCount, $perPage];

        //Acesso direto a classe Medoo
        $usermeta = new UsermetaModel();

        //Intera sobre array de dados enviados para montar query
        foreach($search as $k => $v) {

            //para próximo se vazio
            if (empty($v) || (is_bool($v) && !$v)) {
                continue;
            }

            //Busca por dados pessoais
            if (in_array($k, $personal)) {  
                
                //Acessa classe medoo diretamente
                $db = $this->model->getDatabase();

                $q = ($k == 'user_registered')? ['users.'.$k.'[<>]' => [$v[0], $v[1]]] : ['users.'.$k.'[~]' => '%'.$v.'%']; 

                //Adiciona a query
                $whereUser = array_merge($whereUser, $q);
                continue; 
            }

            //Busca em usermetas
            if (in_array($k, $isMetaEqual)) {
                
                //Adiciona a query
                $content = [
                    'meta_key'           => $k,
                    'meta_value'         => $v
                ];                
            }

            //Busca em usermetas
            if (in_array($k, $isMetaLike)) {
                
                //Adiciona a query
                $content = [
                    'meta_key'              => $k,
                    'meta_value[~]'         => '%'.$v.'%'
                ];                
            }

            //Busca em usermetas
            if (in_array($k, $isMetaBool)) {

                //Se for false ir próximo
                if (is_bool($v) && !$v) continue;

                //Se for array de dados, montar de grupo de ids a ser usado em regular expression
                if ($k == 'photo') {
                    $k = 'profile_img'; //Nome do meta key correto
                    $meta_value = ['meta_value[~]' => 'https://app-atletasnow.s3.sa-east-1.amazonaws.com/uploaded-images%'];

                } elseif ($k == 'video') {
                    $k = 'my-videos'; //Nome do meta key correto
                    //Monta expressão  = array serializado que possuem ao menos um vídeo
                    $meta_value = ['meta_value[REGEXP]' => '^a\:[1-9]{1}']; 

                } elseif ($k = 'accept_assessments') {                    
                    //Monta expressão = termo de aceite de avaliações
                    $meta_value = ['meta_value' => 'true'];
                } 
                
                //Adiciona a query
                $content = array_merge(['meta_key' => $k], $meta_value); 
            }

            //Busca em usermetas como array
            if (in_array($k, $isMetaArray)) {

                //Atribui nome de meta_key usado pela aplicação
                if ($k == 'clubs') 
                    $k = 'clubes';

                //Se for array de dados, montar de grupo de ids a ser usado em regular expression
                if (is_array($v) && $k != 'birthdate') {   
                    
                    //Inicio regular expression
                    $regex = '(';   $qtdItem = count($v);
                    
                    //Atribui string do array
                    foreach ($v as $key => $itemID) {
                        if($key > 0) $regex .= '|';
                        $regex .= '\"'. $itemID . '\"';
                    }
                    
                    //Monta expressão = regular expression
                    $regex .= ')';
                    $meta_value = ['meta_value[REGEXP]' => $regex];

                } elseif ($k = 'birthdate') {
                    //Monta expressão  = between
                    $meta_value = ['meta_value[<>]' => [$v[0], $v[1]]]; 
                } else {                    
                    //Monta expressão = regular expression
                    $meta_value = ['meta_value[REGEXP]' => 's\:[0-9]+\:\"'.$v.'["\[]'];
                }
                
                //Adiciona a query
                $content = array_merge(['meta_key' => $k], $meta_value); 
            }

            //Acesso direto classe medoo
            $db = $usermeta->getDatabase();
            
            //Atribuindo arrays de ids encontrados em cada interação
            $whereIn = array_merge(['AND #'.$k => $content], $whereIn);

            //Atribui contagem de campo com dado a filtrar
            $fields++;
        }

        //Em caso de não houver nenhum tipo de filtragem solicitada, retornar usuários
        if(count($whereIn) > 0) {
            
            //Acesso direto a classe Medoo
            $db = $this->model->getDatabase();

            //Se busca realizada por clube permitir visualizar usuários sem tipo definido
            if (!is_a($this, 'Core\Profile\UserClub')) {
                $whereUser = array_merge($whereUser, ['AND' => ['usermeta.meta_key' => "type", 'usermeta.meta_value[!]' => NULL]]);
            }

            //Ids de usuários em primeiro filtro
            $ids = $db->select('usermeta', ['[>]users' => ['user_id' => 'ID']], 'user_id', $whereUser);

            //A cada array de filtro atribui resultados a var
            foreach ($whereIn as $query) {
                //Ids encontrados a cada usermeta
                $found = $db->select('usermeta', ['[>]users' => ['user_id' => 'ID']], 'user_id',
                array_merge($query, ['user_id'=> $ids, 'GROUP' => 'user_id']));
                
                //Atribui ao array de ids
                $ids = $found;
            }

            //Após filtragem de todos usermetas enviados, última query com resultados
            $result = $db->select('usermeta', ['[>]users' => ['user_id' => 'ID']], ['user_id(ID)'],[
                'user_id'   => $ids,
                'GROUP'     => ['ID'],
                'HAVING'    => Medoo::raw('COUNT(<ID>) > '. $fields), 
                'LIMIT'     => $limit
            ]);

        } else {
            
            //Acesso direto a classe Medoo
            $db = $this->model->getDatabase();
            
            //Lista de ids de usuários via table 'users'
            $result = $db->select('users', [
                '[>]usermeta' => ["ID" => "user_id"],
            ], ['users.ID'], array_merge($whereUser, [
                'AND' => [
                    'usermeta.meta_key'        => 'type',
                    'usermeta.meta_value[!]'   => null,
                ],
                'LIMIT' => $limit
            ]));
        }

        //Inicializa array
        $users = [];

        //Se foi encontrado algum usuário
        if (is_array($result) && count($result) > 0) {

            $repeteadID = [];

            //Percorre array de dados
            foreach ($result as $key => $value) {

                //Definindo key que contém id de usuário
                $userid = $value['ID'];

                //Verifica se id não é repetido
                if (in_array($userid, $repeteadID)) {
                    continue;
                }

                //Instanciado classe de usuário
                $user = new self();
                
                //Definir uma nova função que retorne apenas dados baseados para listagem
                $users[] = $user->getMinProfile((int) $userid, ['gender', 'state']);
                
                $repeteadID[] = $userid;
            }

        } else {
            $users = ['error' => ['search' => 'Nenhum usuário encontrado.']];
        }    
        
        return $users;

    }

    /** 
     * Retorna Tipo de usuário 
     * 
     * @since 2.1   Suporte para retornar tipo de usuário por ID do tipo
     * @since 2.0
     * */
    public function getUserType($ID = null, bool $byUserId = true) {
        
        //Se for enviado array com chave 'usertype'
        if (!$byUserId) {
            return $this->_getByTypeId((int) $ID);
        }

        return $this->_getType($ID);
    }

    /** Retorna erro email de usuário existente */
    public function isUserEmailExist(string $email) {
        return $this->can_update_user_email($email);
    }

    /**
     * Verifica se usuário existe e está ativo na plataforma
     * 
     * @param int $id   Id de usuário a ser verificado
     * @since 2.1
     */
    public function isUserExist(int $id, bool $status = false) {
        return $this->check_if_user_exist($id, $status);
    }

    /* Addicionar um único usuário */
    public function add($data) {
        return $this->register($data);
    } 

    /* Atualizar um único usuário */
    public function update( $data ) {
        return $this->register($data, $this->ID);
    } 
    
    /* Desativa único usuário */
    function delete(){ 
        return $this->desregister($this->ID);
    }

    /** Reativar perfil inativo */
    function reactivate(){
        return $this->activateRegister($this->ID);
    }

    /* Adicionar um novo usuário ou atualizar existente no sistema */
    protected function register(Array $data, int $id = null):array{

        //Se existir um token registro via social login
        if(array_key_exists('token', $data) && !empty($data['token'])){
            $this->socialLogin = TRUE;
        }

        /** 
         *  Correção de erro identificado em 08.10.2019
         *  Verificar se usuário existe antes de editar ou criar
         * Se $id foi informado para update
         * */
        $isUpdate = TRUE; //update de usuario = default

        if (isset($id) && !is_null($id)) {
            //Verifica se usuário já existe
            $isUpdate = $this->model->load(['ID' => $id]);
        } else {  
            
            //Se submetido email para inserção verificar se usuário existe ou tem permissão a editar
            if (key_exists('user_email', $data) && key_exists('error', $r = $this->can_update_user_email($data['user_email']))) {
                return ['error' => ['register' => $r['error']['user_email']]];
            }

            //Verifica e válida se senha confere
            if( $data['user_pass'] != $data['confirm_pass'] ){
                return ['error' => ['confirm_pass' => 'Confirme a senha corretamente.']];
            }

            $isUpdate = FALSE; //criação de usuário
        }

        //Filtrar inputs e validação de dados
        $filtered = $this->verifySentData($data, $isUpdate);

        //Se houver algum campo inválidado obrigatório: display_name || user_email
        if (key_exists('error', $filtered) 
        && in_array(['user_email', 'display_name'], array_flip($filtered['error']))) {
            return array('error' => $filtered['error']);
        }

        //Verifica se houve envio de senha para gerar hash
        if(array_key_exists('user_pass', $filtered)) {
            //Converte password em hash
            $filtered['user_pass'] = $this->hashPassword($filtered['user_pass']);
        }

        //Colunas principais válidas
        $userColumns = array(
            'user_login','user_pass','user_email','display_name'
        );

        //Verifica se usuário já existe no banco de atualiza
        if ($isUpdate) {
            
            /** Update Register */
            //Verifica se existe objeto para upload
            if (isset($filtered['profile_img']) && is_a($filtered['profile_img'], 'Illuminate\Http\UploadedFile')) {

                $file = $filtered['profile_img'];

                //Inicializa classe de upload
                $upload = new FileUpload($id, null, $file, 'profile_img');

                //Enviar arquivo e insere no banco
                if ($upload->insertFile()) {
                    //Remove key de imagem do array usermeta, para não tentar gravar novamente
                    unset($filtered['profile_img']);
                }         
            }
            
            //Preenche array com dados enviados
            $userData = array_only($filtered, $userColumns);

            //Se houver dados padrões a atualizar
            if(is_array($userData) && count($userData) > 0) {
                //Preenche colunas com valores de array
                $this->model->fill($userData); 

                //Atualiza os dados no banco informado as colunas
                $this->model->update(array_keys($userData));
            }            

            //Define true para continuar inserção de dados
            $result = true;

        } else {
            
            /** New Register  */
            $this->model = new UserModel();

            /** Adicionando suporte a ativação por email
             * @since 2.1 */
            $onlyRegister = ['user_activation_key' => str_random(64), 'user_status' => 1];
            
            //Combina arrays
            $userColumns = array_merge($userColumns, ['user_activation_key', 'user_status']);
            $filtered = array_merge($filtered, $onlyRegister);

            //Preenche colunas com valores
            $this->model->fill(array_only($filtered, $userColumns));   
            
            //Insere novo usuário no banco
            $result = $this->model->save();

        }

        //SE resultado for true, continua execução
        if ($result) {

            //Retorna ID da query atual
            $primaryKey = $this->model->getPrimaryKey();
            
            //inicializa array
            $usermetaID = [];

            //Se for novo usuário usa valor enviado
            if( is_null($getType = $this->_getType($primaryKey['ID'])) ){
                //Se não definido usa valor padrão 1
                $type = (isset($filtered['type']) 
                && !empty($filtered['type']))? $filtered['type'] : 1;
            }   
            else{   
                //Se for update, pega dados do banco             
                $type = $getType['ID'];
            }

            //Retorna campos válidos para tipo de usuário
            $usermetaColumns = $this->onlyUsermetaValid($type);
            $user = $this->getUser($primaryKey['ID']);

            //Percorre array
            foreach ($filtered as $key => $value) {

                //Se não existir no array -> pula
                if (!in_array($key, $usermetaColumns) ) {
                    continue;
                }

                //Registra usermetas enviados
                $usermetaID[] = $user->register_usermeta($key, $value, $primaryKey['ID']);

            }

            $msg = (!$isUpdate)? 'Seu cadastro foi realizado com sucesso! Bem Vindo!' : 'Seus dados foram atualizados com sucesso!';

            //Mensagem de sucesso no cadastro
            return ['success' => ['register' => $msg]];

        } else {
            //Mensagem de erro no cadastro
            return ['error' => ['register' => 'Houve erro em seu cadastro. Contate nosso administrador.']];
        }

    } 
    
    /** 
     * Realiza login na plataforma  Affinibox - Benefícios
     * @since 2.2
     */
    public function loginAffinibox() {
        
        //Inicializa classe curl para requisição
        $curl = curl_init();

        //Retorna dados de usuário
        $this->model->load(['user_email' => $this->user_email]);

        //Dados para enviar a API 
        $data = [
            'api_key'       => env('AFFINIBOX_KEY'),
            'secret_token'  => env('AFFINIBOX_SECRET'),
            'email'         => $this->user_email,
            'name'          => $this->display_name,
            'password'      => $this->model->user_pass
        ];

        curl_setopt_array($curl, [
            CURLOPT_URL => env('AFFINIBOX_URL'),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_TIMEOUT => 30000,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS => json_encode($data),
            CURLOPT_HTTPHEADER => array(
                // Set here requred headers
                "accept: */*",
                "accept-language: en-US,en;q=0.8",
                "content-type: application/json",
            ),
        ]);

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            return ['error' => ['affinibox' => 'cURL Error'. $err]];
        } else {
            return json_decode($response);
        }
        
    }

    /** Registra usermeta baseado nos parametros */
    private function register_usermeta($meta_key, $meta_value, $user_id, $check = true, $notifyClub = true) {

        /*Se valor for false (validação não permitida), 
        não registrar usermeta e encerrar execução da função */
        if($meta_value == false && !in_array($meta_key, ['sport', 'clubes']) ){
            return;
        }

        //Inicializa modelo
        $meta = new UsermetaModel();

        //Retorna instancia de modelo
        $meta->load(['user_id' => $user_id,'meta_key' => $meta_key]);

        //Enviar notificação para clube e adicionar marcador 
        if($check && is_array($meta_value) && $meta_key == 'clubes') {
            
            //Inicializa array local
            $itemTagged = [];

            //Se for update de perfil, key 'value1 setada antes dos dados
            if (array_key_exists('value', $meta_value)) {
                $meta_value = $meta_value['value'];
            }
            
            //Percorre e verifica existencia de clube
            foreach ($meta_value as $item) {
                //Atribui marcação
                $itemTagged[] = (\preg_match('/^[0-9]+/', $item))? ['ID' => $item, 'certify' => $this->sendNotifyClub($item, $user_id, $notifyClub)]: ['club_name' => $item];
            }

            //Reseta valor da variavel
            unset($meta_value);

            //Atribui a var para continuar execução
            $meta_value = $itemTagged;
        }

        //Arranjando dados de estatísticas
        if(is_array($meta_value) && $meta_key == 'stats') {
            
            //Campos gerais de estatisticas
            $stats = new UserStats($this->metadata, $this->type['ID'], $this->sport);
            
            //Setando estatisticas do banco
            $stats->arrangeStatsToUpdate($meta_value);

            //Armazena visibilidade
            $visibility = $meta_value['visibility'];
            
            unset($meta_value);

            //Retorna estatisticas formatada corretamente para inserir
            $meta_value = $stats->getStatsToUpdate(); //Já retorna com key value

            //Atribui novamente visibilidade ao array
           $meta_value['visibility'] = $visibility;

        }

        //Se for update atributos
        if (!is_null($meta) && !$meta->isFresh()) {

            //sport e clubes não necessitam de ['value', ''visibility] pois são sempre publicos
            if (in_array($meta->meta_key, ['sport', 'clubes', 'type'])) {
                //Atribui array de IDS
                $meta->meta_value = $meta_value;
            } else {
                //Atribui valor ao meta_value
                $meta->meta_value = $meta_value['value'];
            }            
            
            //Array de campos a ser atualizado
            $fields = ['meta_value'];

            //Verifica se visibilidade foi definida e add novo valor
            if(isset($meta_value['visibility']) && $meta_value != 0) {
                //Verifica se visibilidade enviada é válida
                $visibility = $this->appVal->check_user_input_visibility($meta_value['visibility']);
                $meta->visibility = (string) $visibility;
                $fields[] = 'visibility'; 
            }
            
            //Faz update e retorna ID de resultado
            $saveResult = [
                $meta->meta_key => ($meta->update($fields)) ? $meta->getPrimaryKey() : false
            ];

        } else {

            //Se valor for nulo
            if(is_null($meta_value)){
                return;
            }

            //Valor default para visibilidade
            $meta_visibility = 0;

            //Verifica se valor enviado está em forma de array
            //Se aplica em casos do usuário não ter campo preenchido quando dentro da plataforma
            if(is_array($meta_value)){

                //Se valor for nulo
                if(is_null($meta_value)){
                    return;
                }
                
                //Atribui visibilidade
                $meta_visibility = (key_exists('visibility', $meta_value)) ? $this->appVal->check_user_input_visibility($meta_value['visibility']) : 0;

                //Atribui valor para var correta
                if(key_exists('value', $meta_value)){
                    $meta_value = $meta_value['value'];
                }                
                
            }

            //Cria novos atributos e valores para salvar
            $metaData = [
                'user_id'       => $user_id,
                'meta_key'      => $meta_key,
                'meta_value'    => $meta_value,
                'visibility'    => $meta_visibility
            ];            

            //Instancia novo modelo
            $meta = new UsermetaModel();

            //Atribui atributos no modelo
            $meta->fill($metaData);
            
            //Salva dado e retorna ID de resultado
            $saveResult = [
                $meta->meta_key => ($meta->save())? $meta->getPrimaryKey() : false
            ];

        } 

        return $saveResult;

    }
    
    //Função de desregistrar usuário atual
    protected function desregister(int $id){

        //Intancia objeto User
        if($this)
        $user = new self();
        
        //Retorna dados do usuário
        $user = $user->get($id);

        //Atualiza valor no banco de dados 
        $response = $user->model->delete();
        
        if ($response) {
            //Mensagem de sucesso no cadastro   
            return ['success' => ['delete' => 'Perfil foi inativado!']];
        } else {
            //Mensagem de erro no cadastro
            return ['error' => ['register' => 'Houve erro ao inativar perfil. Contate nosso administrador.']];
        }

    }

    //Função para reativar um usuário atual
    protected function activateRegister(int $id){
        
        //Intancia objeto User
        $user = new self();

        //Carrega modelo de usuário
        $user->model = new UserModel(['ID' => $id]);

        //Atualiza valor no banco de dados 
        $response = $user->model->undelete();
        
        if ($response) {
            //Mensagem de sucesso no cadastro   
            return ['success' => ['register' => 'Perfil foi reativado!']];
        } else {
            //Mensagem de erro no cadastro
            return ['error' => ['register' => 'Houve erro ao reativar perfil. Contate nosso administrador.']];
        }

    }

    /** Retorna token armazenado no banco */
    public function getSocialToken(){
        return $this->loadSocialToken();
    }

    /** Enviar e-mail para usuário de contexto */
    public function sendEmail(int $user_id, array $data) {

        //Classe de usuário
        $user = new self();
        $user = $user->get($user_id);

        //Instanciando classe de envio de email e parametros
        $email = new SendEmail();
        $email->setFromName($this->display_name);
        $email->setToEmail(['email' => $user->user_email, 'name' => $user->display_name]);
        $email->setSubject($this->display_name . ' enviou uma mensagem para você | AtletasNow');
        $email->loadTemplate('userMessageEmail', $data);

        //Executando disparo
        return $email->send();
    } 

    /** 
     *  Retorna metadados do usuário
     *  @param int Id   Id do usuário
     *  @param array $only  metadados a serem exportados  
     * @since 2.0
     * 
     * @return mixed
     */
    private function _getUsermeta($ID, $only = []):array {

        if (is_null($ID) || empty($ID) ) {
            return [];
        }

        //Instancia classe de modelo passando filtro
        $metadata = new UsermetaModel();

        //Parametros de query
        $query = ['user_id' => $ID];

        //Se setados apenas alguns campos a retornar
        if (count($only) > 0 && !empty($only)) {
            $query['meta_key'] = $only;
        }

        //Retorna todos as metadatas filtrando por ID
        $result = $metadata->dump($query);  

        //Se array estiver vazio retorna nulo
        if (count($result) <= 0 ) {
            return [];
        }

        $formated = [];

        foreach ($result as $value) {
            
            //Atribui variaveis locais
            $meta_key   = $value['meta_key'];
            $meta_value = $value['meta_value'];

            //Verifica permissão do atributo de perfil
            if(($ID != $this->ID && !$this->hasPermission($value)) || empty($value['meta_value'])) {
                continue;
            }

            //Decode data
            $addValue = (!is_null($uns = json_decode(utf8_encode($meta_value), true))) ? $uns : $meta_value;

            //Unserialize data
            $uns = @unserialize($addValue);
            $addValue = (is_bool($uns) && !$uns ) ? $addValue : $uns;

            if ($meta_key == 'birthdate'){
                //Formata data em formato permitido
                $meta_value = preg_replace('/([0-9]{2})([0-9]{2})([0-9]{2,4})/i', '$1-$2-$3', $meta_value);
                $meta_value = str_replace('/', '-', $meta_value);
                //Converte em objeto data
                $date = date_create($meta_value);
                //Formata para data válida
                $addValue = (!$date)? $date : date_format($date, 'Y-m-d');
            }

            //Retorna visibilidade
            $addVisibility = (int) $value['visibility'];

            $formated[$meta_key]['value'] = $addValue;
            $formated[$meta_key]['visibility'] = $addVisibility;
        }

        //Atribuir tipo se usuário contiver, senão atribui 1 = Atleta
        $type = (key_exists('type', $formated))? $formated['type']['value'] : 1;

        //Atribuir tipo
        $only_usermeta_type_user = $this->onlyUsermetaValid($type);   
        
        //Separa apenas campos válidos do array
        $formated = array_intersect_key($formated, array_flip($only_usermeta_type_user));       

        return $formated;

    }

    /** 
     *  Retorna tipo do usuário
     *  
     * @since 2.0
     * 
     * @return mixed
     */
    private function _getType(int $ID = null) {

        if(is_null($ID)){
            return null;
        }

        //Instancia classe modelo de metadados
        $type = new UsermetaModel();

        //Verifica se existe metadado 'type'
        if(!$typeExist = $type->load(['user_id' => $ID, 'meta_key' => 'type'])){
            $capabilities = $type->getInstance(['user_id' => $ID, 'meta_key' => 'at_capabilities']);
        }

        //Se nenhum dado existe no banco, retorna null
        if (!$typeExist && is_null($capabilities)) {
            return null;
        }
        
        //Habilitando compatibilidade com definição de tipo de usuário da v1.0
        if(!$typeExist && isset($capabilities) && is_object($capabilities)){
            $validTypes = ['atleta' => 1, 'faculdade' => 3, 'clube' => 4];
            $currentTypes = unserialize($capabilities->meta_value);
            $type->meta_value = 1;
            foreach ($validTypes as $key => $value) {
                if ( array_key_exists($key, $currentTypes )) {
                    $type->meta_value = $value;
                }
            }
        }

        //Instancia Modelo de Classe 
        $usertypeModel = new UsertypeModel(['ID' => $type->meta_value]);

        //Se não retornar nenhum resultado retornar nulo
        if (! $result = $usertypeModel->getData() ) {
            return null;
        }

        return $result;
    }

    /** 
     *  Retorna nome do tipo de usuário
     *  
     * @since 2.1
     * 
     * @return string
     */
    private function _getByTypeId(int $id):string {
         
        //Instancia Modelo de Classe 
         $usertypeModel = new UsertypeModel(['ID' => $id]);

         //Se não retornar nenhum resultado retornar nulo
         if (! $result = $usertypeModel->getData() ) {
             return null;
         }
 
         //Retorna apenas a nomeclatura
         return $result['type'];
    }

    /** 
     *  Retorna esportes do usuário
     *  
     * @since 2.0
     * 
     * @return mixed
     */
    private function _getSport() {
        
        if (is_null($this->sport) || (is_array($this->sport) && !array_key_exists('value', $this->sport) ) ) {
            return null;
        }

        //Instancia Modelo de Classe, 
        $model = new SportModel(); 

        //Unserializar array de esportes
        $sportValue = $this->sport['value'];

        //Verifica se dado armazenado é array ou string com nome do esporte (v2.0)
        //Se for array de ids contendo key 'value'
        if(is_array($sportValue) && key_exists('value', $sportValue)) {
            $result = $model->dump(['ID' => $sportValue['value']]);
        }
        //No caso de array comum
        elseif(is_array($sportValue)){
            $result = $model->dump(['ID' => $sportValue]);
        //Se retornado uma string de array serializado
        } elseif ( preg_match('/^a\:[0-9]+\:{/', $sportValue)) {
            $sportValue = unserialize($sportValue);
            $result = $model->dump(['ID' => $sportValue]);
        //Verifica se esta armazenado id único
        } elseif ( preg_match('/[0-9]+/', $sportValue)) {
            $result = $model->dump(['ID' => $sportValue]);
        //Verifica esporte através do nome
        } else {
            $result = $model->dump(['sport_name' => $sportValue]);
        }

        //Retorna dados
        if (! $result ) {
            return null;
        }

        return $result;
    }

    /** 
     *  Retorna esportes do usuário
     *  
     * @since 2.0
     * 
     * @return mixed
     */
    private function _getClubs($clubs=null) {

        //verifica se existe clubes definidos via metadata
        if (is_null($clubs) && isset($this->metadata['clubes']) && count($this->metadata['clubes']) > 0){
            $clubs = $this->metadata['clubes'];
        }

        //Se nulo retorna
        if (is_null($clubs)) {
            return null;
        }

        //Array de Clubes
        $ids = []; 

        //Se for array de clubes (v2.0)
        if (is_array($clubs['value'])) {
            //Percorre array
            foreach($clubs['value'] as $item){            
                //Se for array atribui valor
                if(is_array($item) && key_exists('ID', $item)){
                    //Adiciona ID ao array
                    $ids[] = $item['ID'];
                }
            };
        } else{
            $ids[] = $clubs['value'];
        }        
        
        //Instancia Modelo de Classe, 
        $model = new UserModel(); 

        //Verifica se há resultados e retorna objeto
        $allclubs = $model->getIterator(['ID' => $ids]);

        //Se nenhum clube foi encontrado
        if ($allclubs->count() <= 0) {
            return null;
        }

        //Percorre array de clubes
        foreach ($allclubs as $key => $item) {
            
            //Verifica se item é valido
            if(!$allclubs->valid()){
                continue;
            }
            
            //Reestrutura array com dados do clube
            if (is_array($clubs['value'])) {
                $clubs['value'][$key] = array_merge(
                    ['club_name' => $item->display_name],
                    $clubs['value'][$key]);
            }
            else{
                $clubs['value'] = [
                    [   'ID' => (int) $clubs['value'],
                        'club_name' => $item->display_name
                    ]
                ];
            }

        }            
        
        //Retorna array  
        return $clubs['value'];
    }

    /** 
     * Setar metadados dos usuário
     * 
     * @param $usermeta_key string Usermeta key no qual vai ser atualizado valor
     * @param $usermeta_value mixed Se bolean (true) remover usermeta. Outros tipos de dados serão inserção ou atualizados
     * @since 2.1
     * 
     * @return mixed
     */
    private function _setUsermeta(string $usermeta_key, $usermeta_value) {

        //Verifica se classe de usuário foio instanciada
        if (is_null($this) || is_null($this->ID) || empty($this->ID) ) {
            return null;
        }

        //Retorna instancia de usermeta via database model
        $meta = new UsermetaModel();
        $data = ['user_id' => $this->ID, 'meta_key' => $usermeta_key];

        //Verifica tipo de dado
        //Se booleano: true = remover
        if (is_bool($usermeta_value) && $usermeta_value === true && $meta->load($data)) {

            //Deletar usermeta
            $result = $meta->delete();

        } else {
            //Se não existir salva / existe faz update
            if($meta->isFresh()) {
                //Preenche com dados
                $meta->fill(array_merge($data, ['meta_value' => $usermeta_value]));
                $result = $meta->save();
            } else {
                //Preenche com dados
                $meta->meta_value = $usermeta_value;
                $result->update('meta_value');
            }
        }        

        //Retorna mensagem de resultado
        return $result;        

    }

    /**
     * @param $userModel object class UserModel()
     */
    public static function typeUserClass(UserModel $userModel){

        //Se usuário tiver dados definidos atribui classe respectiva
        if (!is_a($userModel, 'Core\Database\UserModel')) {
            return ['error' => ['type' => 'Impossível determinar o tipo de usuário dessa conta. Contate o administrador.']];
        }

        //Verifica tipo de ID de usuário
        if (is_null($type = (new self)->_getType($userModel->ID))) {
            //No caso de tipo de usuário não tiver sido definido
            $type['ID'] = 1;
        }

        //Tipos de usuários e suas classes
        $typeClass = [
            1 => User::class,
            2 => UserProfissional::class,
            3 => UserCollege::class,
            4 => UserClub::class,
            5 => UserClub::class
        ];

        //Se tipo de usuário não estiver dentro do estabelecido
        if (!array_key_exists($type['ID'], $typeClass)) {
            return ['error' => ['type' => 'Tipo de usuário inexistente. Contate o administrador.']];
        }

        //Atribui ID do tipo de usuário
        $typeID = (int) $type['ID'];

        //Instancia classe para utilização
        $class = new $typeClass[$typeID]([
            'user_email'   => $userModel->user_email, 
            'user_pass'    => $userModel->user_pass
        ]);

        //Retorna class
        return $class;
    }

    /** Adiciona valores as variaveis publicas */
    private function setVars(Array $data){

        $valid = array(
            'ID'            => 'ID',
            'user_login'    => 'user_login',
            'display_name'  => 'display_name',
            'type'          => 'type',
            'sport'         => 'sport',
            'clubs'         => 'clubs',
            'user_email'    => 'user_email',
            'user_status'   => 'user_status',
            'favorite'      => 'favorite',
            'following'     => 'following',
            'totalFavorite' => 'totalFavorite',
            'totalMessages' => 'totalMessages',
            'totalNotifications'   => 'totalNotifications'
        );

        foreach ($valid as $key => $value) {
            if(!array_key_exists($key, $data)){
                continue;
            }
            $this->$key = $data[$value];
        }

    }

    //Verifica os dados enviados pelo usuário possue a formatação exigida, faz validação e formata
    protected function verifySentData($data, $isUpdate = false):array{
        
        //Inicia classe Validação
        $val = $this->appVal;
        
        //Executa função de checar formato dos inputs via regular expressions e outras funções
        $formated = $val->check_user_inputs($data);

        //Executa função verificar existência de erros
        $checked = array_merge($data, $val->check_filtered_inputs($formated, $isUpdate));

        //Se troca de email foi requisitada, fazer verificação se existe algum usuário com mesmo email
        if (key_exists('user_email', $checked)) {
            //Adiciona erro se houver algo que impeça o update do email
            $checked = array_merge($checked, $this->can_update_user_email($checked['user_email']));
        }
        
        //Se não houve nenhum erro, retornar array vazio
        return $checked;

    }

    /** Verifica a existência de usuário com mesmo e-mail */
    private function can_update_user_email(string $email):array {
        
        //Carrega base e verifica se retorna sucesso
        $searchQuery = $this->model->load([
            'user_email' => $email
        ]);

        //Se email pertencer a outro usuário diferente do logado (requisidor)
        if($this->model->ID != $this->ID){
            return ['error'=> ['user_email' => "E-mail já atribuido a um usuário."]]; 
        } 

        //Habilitado para update de email
        return [];
    }

    /**
     * Verifica se usuário existe e está ativo usando referencia de seu ID
     * 
     * @param int $id   Id do usuario a verificar
     * @since 2.1
     */
    private function check_if_user_exist(int $id, bool $checkDisabled = false):bool {

        //Se setado, desabilita procura apenas de usuários ativos 
        $status = ($checkDisabled)? 1 : 0;

        //Faz requisição no banco pelo ID e Status
        $resp = $this->model->load(['ID' => $id, 'user_status' => $status]);

        //Retorna resposta
        return $resp;
    }

    //Instancia classe PasswordHash e retorna string hashead
    protected function hashPassword($pass):string{
        
        //Inicia classe de password. Compatibilidade Wordpress
        $passwordHash = new PasswordHash(8, true);

        //Hasheando password
        return $passwordHash->HashPassword($pass);
    }

    /* Função verifica se dado é permitido para determinado usuário */
    private function hasPermission( $data ):bool{
        
        //Se visibilidade for null, informação é pública
        if( is_null($data['visibility']) 
        || empty($data['visibility'])  
        || $data['visibility'] <= 0){
            return true;
        }

        //Se visibilidade foi definida como privada, apenas próprio usuário pode ver
        if( $data['visibility'] == 99){
            return false;
        }

        //Visibilidade permitida para usuários que pertecem a um clube
        if($this->clubs){
            $bool = false;
            //Percorre array de clubes
            foreach($this->clubs as $c => $v ){
                $bool = ($v['ID'] == $data['visibility']) ?: true;
            }
            return $bool;
        }

        //Verifica se visibilidade é compatível com tipo de perfil
        if( $data['visibility'] != $this->type['ID']){
            return false;
        }

        //Retorna Informação
        return true;
        
    }

    /** 
     * Aumenta quantidade 'views' em metadata 
     * @param int $whoId    Id do usuário que visualizou o perfil
     * 
     * @since 2.1   Implementando contabilização de visitas e rgistro de notificação ao usuário visitado
     * @since 2.0
     * */
    public function increaseView(int $whoId):bool {

        //Dados para ser utilizando para trazer dados database
        $filter = ['to_id' => $this->ID, 'from_id'  => $whoId];

        //Inicializa modelo
        $viewModel = new UserViewModel();

        //Preenche modelo com dados
        $viewModel->fill($filter);        

        //Salva registro no banco e retorna true ou false
        $saved = $viewModel->save();

        //Se foi registrado com sucesso, registra notificação
        if($saved) {
            //Retorna total de views 
            $totalView = $this->_getUsermeta($this->ID, ['views']);
            
            //Atribui visulização da contagem (senão houver dado atribui 1)
            $sum = (count($totalView) > 0) ? (int) $totalView['views']['value'] + 1: 1;

            //Salva no banco de dados
            $r = $this->_setUsermeta('views', $sum);

            //Instancia classe de notificação
            $notify = new Notify($this);
            
            //Registra notificação
            $notify->add(12, $this->ID,  $whoId);
        }

        return $saved;

    }

    //Função para atualizar certificação de clube
    public static function updateClubCertify(int $user_id, int $club_id, bool $confirm){
        
        //Instanciando a classe modelo
        $userData = new UsermetaModel(['meta_key' => 'clubes', 'user_id' => $user_id]);

        //decodificando dados em array
        $meta_value = unserialize($userData->meta_value);

        //Verifica se usuário tem clubes atribuidos
        if(is_null($userData) || !is_object($userData) || count($meta_value) <= 0) {
            return ['error' => ['certify' => 'Não foi encontrado nenhum clube no usuário pata verificação']];
        }

        //Selo a ser atribuido ao perfil do usuário
        $certify = ($confirm)? env("CLUBE_VERIFICADO") : env("CLUBE_REPROVADO");

        //Se já existir key 'value'
        if(key_exists('value', $meta_value)){
            $meta_value = $meta_value['value'];
        }

        //Procurar clube em array de dados
        foreach ($meta_value as $key => $value) {
            if (is_array($value) && key_exists('ID', $value) && $value['ID'] == $club_id) {
                $meta_value[$key]['certify'] = $certify;
                break;
            }
        }

        //Instanciando classe e atribuindo modelo de dados
        $user = new User();
        $user->metaModel = $userData;
        
        //Função de adicionar metadados de usuário
        $response = $user->register_usermeta('clubes', $meta_value, $user_id, false);

        return $response;
    }

    /** Função para atualizar a senha de acesso a plataforma */
    public function updatePassword(array $data){

        //Verifica se houve envio de senha para gerar hash
        if(array_key_exists('user_pass', $data)) {

            //Verifica se password está correta
            if( $data['user_pass'] != $data['confirm_pass'] ){
                return ['error' => ['user_pass' => 'Confirme a senha corretamente.']];
            }

            //Converte password em hash
            $pass = $this->hashPassword($data['user_pass']);

        } else {
            return ['error' => ['user_pass' => 'Envie uma senha válida.']];
        }        

        //Colunas principais válidas
        $userColumns = ['user_pass'];

        //Carrega modelo do respectivo usuário
        $this->model->load(['ID' => $this->ID]);

        //Preenche colunas com valores de array
        $this->model->fill(['user_pass' => $pass]); 

        //Atualiza os dados no banco informado as colunas
        $result = $this->model->update($userColumns); 

        //Retorna respostas
        if($result){
            return ['success' => ['user_pass' => 'Senha alterada com sucesso.']];
        } else {    
            return ['error' => ['user_pass' => 'Houve erro na atualização da senha. Tente novamente mais tarde.']];
        }

    }

    //Retorna status do usuário
    public function getStatus(){
        $status = $this->model->user_status;
        return $status;
    } 

    /** 
     * Verifica se houve sucesso na inclusão dos dados e executa função
     * de enviar notificação ao clube
     */
    private function sendNotifyClub(int $clubID, int $user_id, $notifyClub = true) {
        
        //Verifica se clube existe
        $exist = UserClub::isClubExist($clubID, $user_id);

        //Verifica se existe e retorna boolean
        if($exist) {
            //Enviar notificação para clube
            $userClub = $this->getUser($clubID);
            $notify = new Notify($userClub);
            if ($notifyClub) $notify->add(3, $clubID, $user_id);

        } 

        //Retorna marcação de informação não verificada
        return env('CLUBE_NAO_VERIFICADO');
        
    } 

    /**
     * Retorna os todos os campos usermeta de usuário
     * @param int $typeUser     Tipo de usuário    
     * @since 2.1
     */
    public function getUsermetaFields($typeUser = true) {
        return $this->onlyUsermetaValid($typeUser);
    }
    
    /** 
     * Define array de campos necessários para determinado tipo de perfil 
     * 
     * @param mixed $typeUser Tipo de Usuário = int 1,2,3,4 ou 5. Se for do tipo bool TRUE retorna todos os campos
     * @return array
     * @since 2.0
     * 
     * */
    private function onlyUsermetaValid($typeUser = 1):array{

        //Colunas Gerais'
        $usermeta = array(
            'type', 'sport', 'clubes', 'telefone', 'city', 'state', 'country', 'neighbornhood', 'zipcode', 'telefone', 'address', 'profile_img', 'my-videos', 'views', 'searched_profile', 'biography', 'session_tokens', 'titulos-conquistas'
        );

        //Compartilhado entre Atleta e Profissional do Esporte
        if($typeUser === true || in_array($typeUser, [1, 2])){
            $usermeta = array_merge($usermeta, ['birthdate', 'gender', 'rg', 'cpf', 'formacao', 'cursos', 'parent_user']);
        }

        //Compartilhado entre Faculdade e Clube
        if ($typeUser === true || in_array($typeUser, [3, 4, 5])) {
            $usermeta = array_merge($usermeta, ['cnpj', 'eventos', 'meus-atletas', 'club_site', 'club_liga', 'club_sede']);
        }

        //Compartilhado entre Atleta e Clube
        if ($typeUser === true || in_array($typeUser, [1, 3, 4, 5])) {
            $usermeta = array_merge($usermeta, ['empates', 'vitorias', 'derrotas', 'titulos', 'jogos']);
        }

        //Atleta
        if($typeUser === true || $typeUser == 1){
            $usermeta = array_merge($usermeta, ['weight', 'height','posicao', 'stats', 'stats-sports', 'accept_assessments']);
        }

        //Profissional do Esporte
        if($typeUser === true || $typeUser == 2) {
            $usermeta = array_merge($usermeta, ['career']);
        }

        return $usermeta;
    } 

    /** Formatando tipos de dados para gravar no banco */
    private function formatVarUsermeta($key, $value){
        
        $is_array   = self::getArrayUsermeta();
        $is_json    = self::getJsonUsermeta();

        if (array_key_exists($key, $is_array) ) {
            //Se for array, serializar
            return serialize($value);
        } elseif (array_key_exists($key, $is_json) ) {
            //Se for object, encodar em json
            return json_encode($value);
        }
        else{
            //Retorna como string
            return (string) $value;
        }

    } 

    //Keys formatados como array
    private static function getArrayUsermeta(){
        return ['my-videos', 'titulos-conquistas'];
    }

    //Keys formatados como json
    private static function getJsonUsermeta(){
        return ['stats', 'formacao', 'cursos', 'meus-atletas', 'sport', 'clubes', 'eventos', 'club_liga'];
    }

    //Retorna ID
    protected function getID(){
        return $this->ID;
    }

    //Carrega via banco o token armazenado, se existir
    private function loadSocialToken(){
        $model = new UsermetaModel();
        if (!$model->load(['user_id' => $this->ID, 'meta_key' => 'social_tokens'])){
            return false;
        }
        return $model->getData();
    }

    /**
     * Envia email com link de confirmação de cadastro
     */
    public function sendActivationKey() {

        //Carrega dados de usuário logado
        $model = new UserModel(['ID' => $this->ID, 'user_status' => 1]);

        /** Verifica se eiste código de verificação e atribui em caso de vazio
         * @since 2.2 */
        if(empty($activationKey = $model->user_activation_key)) {
            $model->user_activation_key = str_random(64);
            $model->update(['user_activation_key']);
            $activationKey = $model->user_activation_key;
        }

        $email = $this->user_email;
        $userName = $this->display_name;

        //SETUP DE EMAIL
        $phpmailer = new SendEmail();
        $phpmailer->setToEmail(['email' => $email, 'name' => $userName]);
        $phpmailer->setFromName('AtletasNOW - Sua hora é agora');
        $phpmailer->setSubject('Confirme seu email - AtletasNOW');
        
        //Carrega template prédefinido
        $phpmailer->loadTemplate('activationKey', ['email' => $email, 'activationKey' => $activationKey]);

        //Envio do email
        return $phpmailer->send();

    }

}