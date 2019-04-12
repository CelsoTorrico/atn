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
use aryelgois\Medools\ModelIterator;

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
    
    //Contrução da classe
    public function __construct($args = array()) {

        //Inicializa modelos e classes
        $this->model = new UserModel();
        $this->appVal = new AppValidation();
        
        //Verifica se parametros estão presentes
        if (array_key_exists('user_login', $args) 
        && array_key_exists('user_pass', $args)) {

            //Carrega respectivo user no banco
            if ($this->model->load(['user_login' => $args['user_login'], 'user_pass' => $args['user_pass']])) {
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
            'totalNotifications'    => $notify->getTotal()
        ]); 

        return $this;        
    }

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
        $filter = ['ID' => $id, 'user_status' => 0];

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
     * Retorna dados de usuário único por ID
     * @since 2.0
     * 
     * @return mixed
     */
    public function getMinProfile( int $id=null, $usermeta = [] ) {

        if(!is_null($id)){
            //Filtro
            $filter = ['ID' => $id, 'user_status' => 0];

            //Retorna instancia de modelo User
            $userData = $this->model->getInstance($filter);

        } else{
            //Atribuindo dados do usuário corrente
            $userData = $this->model;
            $id = $this->model->ID;
        }

        //Verifica se existe usuário
        if (!$userData) {
            return ['error' => ['user', "Usuário inexistente."]];
        }

        //Retorna dados do usuário
        $userData = [
            'ID' => $userData->ID,
            'display_name' => $userData->display_name
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
    public function getStats(int $id = null){

        //Se id for null, mostrar dados do usuário corrente
        if (is_null($id)){
            $user = $this->getUser($this->ID);
        } else {
            $user = $this->getUser($id); 
        }
        
        //Campos gerais de estatisticas
        $stats = new UserStats($user->metadata, $user->type['ID'], $user->sport);
        
        //Setando estatisticas do banco
        $stats->setStats();

        //Retorna dados
        return $stats->get();

    }

    /** REtorna usuários com relevancia ao perfil logado 
     *
    */
    public function getFriendsSuggestions(){

        //Atributos de comparação
        $atributes  = ['type', 'sport','clubs', 'metadata'];
        $random     = array_rand($atributes, 2);
        $users      = ['success' => ['criterio' => []], 'found' => []];
        $query      = [];
        
        //Inicializa modelo
        $metaModel = new UsermetaModel();

        //Retornando lista de usuários já conectados
        $friendsList = $this->getFriends([], true);

        //Monta query dois parametros, melhorar correspondência
        foreach ($random as $key => $value) {

            //Atribui propriedade atual
            $k = $atributes[$value];

            //Verifica se usuário tem a propriedade definida e com algum valor
            while ( !property_exists($this, $k) || is_null($this->$k)) {
                //Verifica a diferença de keys já usadas
                $ignore = array_diff_key($atributes, $random);  
                //Reatribui propriedade que exista e contenha valor
                $k = $atributes[array_rand($ignore)];
            }

            //Executa função para montagem de query
            $fn = $this->friendsSuggestionsLogic($k);

            //Limitar em 20 usuários por vez
            $fn['LIMIT'] = 10;

            //Adiciona criterio de sugestão
            $users['success']['criterio'][] = $fn['meta_key'][0];

            //Merge arrays de query
            $found = $metaModel->getIterator($fn);

            //Atribuir apenas ids
            foreach($found as $i) {

                //Se atual não é valido
                if(!$found->valid()){
                    continue;
                }
                
                //Se já conectado ou for mesmo que usuário atual, ir proximo
                if (in_array($i->user_id, $friendsList) || $i->user_id == $this->ID) {
                    continue;
                }

                //Atribui ID ao array
                $query[$key][] = $i->user_id;
                $user = new self();
                $users['found'][] = $user->getMinProfile($i->user_id);                 

            }
        }  

        //Verifica se houve alguma inserção de ids
        if(isset($query[0]) && isset($query[1]) && count($query[1]) > 0){
            
            //Verifica se algum usuário possui os 2 critérios
            $a = array_intersect($query[0], $query[1]);

            //Se não usuário repete
            if(count($a) == 0) {
                return;
            }

            //Rearranja ordem para usuários com 2 critérios
            //TODO: Arrumar essa função
            array_unshift($users['found'], $a);
        }

        //Divide array para mostrar apenas 3 usuários
        $users['found'] = array_slice($users['found'], 0, 4, false);
        
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
            while ( !array_key_exists($k, $this->metadata) || is_null($this->metadata[$k])) {
                //Reatribui propriedade que exista e contenha valor
                $k = array_rand(array_flip($metadata));
                $i++;
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
            $composing = ['meta_key' => [$key]];

            //Se valor for array
            foreach ($value as $i => $v) {    
                
                //Se for array atribui chave com ID
                if (is_array($v) && isset($v['ID'])) {
                    $v = $v['ID'];
                }
                
                //Se for nenhum desse tipo, retorna
                if (!in_array($i, ['value', 'ID'])) 
                {    continue;   }

                //Removendo espaços no inicio e fim da string
                $v = preg_replace('/(^\s|\s$)/', '', $v);

                //Adiciona meta_value
                ($i != 'ID')?  $composing['meta_value[~]'] = ['%'.$v.'%'] :  $composing['meta_value'] = [$v]; 

                //Merge arrays
                $query = array_merge($query, $composing);

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

    /** Realiza busca de usuários baseado em parametros */
    public function searchUsers(array $search, int $paged) {

        //Busca em user
        $personal   = ['display_name'];

        //Campos de busca em usermeta
        $isMeta     = ['type','city','state','neighbornhood','gender','formacao'];

        //Campos usermeta em array
        $isMetaArray = ['clubs','sport'];

        //Instancia modelo usermeta
        $usermeta = new UsermetaModel();

        //Variavel para montar query
        $where = [];
        $whereJoin = [];

        //Intera sobre array executando função
        foreach($search as $k => $v) {

            //para próximo se vazio
            if (empty($v)) {
                continue;
            }

            //Busca por dados pessoais
            if (in_array($k, $personal)) {                
                //Adiciona a query
                $content = ['users.'.$k.'[~]' => '%'.$v.'%'];
            }

            //Busca em usermetas
            if (in_array($k, $isMeta)) {
                
                //Adiciona a query
                $content = [
                    'usermeta.meta_key'              => $k,
                    'usermeta.meta_value[~]'         => '%'.$v.'%'
                ];
            }

            //Busca em usermetas como array
            if (in_array($k, $isMetaArray)) {

                //Atribui nome de meta_key usado pela aplicação
                if ($k == 'clubs') {
                    $k = 'clubes';
                } 

                //Se for array de dados, montar de grupo de ids a ser usado em regular expression
                if(is_array($v)){   
                    
                    $r = '(';
                    $qtdItem = count($v);
                    
                    foreach ($v as $key => $itemID) {
                        $r .= ($key >= ($qtdItem - 1))? $itemID : $itemID . '|'; 
                    }

                    $r .= ')';
                    
                    //Monta regular expression
                    $regex = 'i\:'. $r;
                }
                else{                    
                    //Monta regular expression
                    $regex = 's\:[0-9]+\:\"'.$v.'["\[]';
                }
                
                //Adiciona a query
                $content = [
                    'usermeta.meta_key'             => $k,
                    'usermeta.meta_value[REGEXP]'   => $regex                 
                ]; 
            }

            //Define os conteúdos de forma estruturada em query
            if ($k == 'display_name') {
                $where = $content;
            }

            //Após aqui não é mais usado display_name para atribuição
            if($k == 'display_name'){
                continue;
            }

            //Atributos para join
            if (count($where) <= 0){
                $whereJoin['AND'] = $content;
            }
            else {
                $whereJoin['AND']['AND #'.$k] = $content;
            }
            
            continue;

        }

        //Acesso direto a classe Medoo
        $db = $usermeta->getDatabase();

        //Qtd de itens por página
        $limit = 500;

        //Inicializando classe
        $result = null;

        if(count($where) > 0){
            //Lista de ids de usuários via table 'users'
            $result = $db->select('users', ['users.ID'], $where);
            
            //Atribuindo apenas valores
            foreach ($result as $key => $value) {
                $whereJoin['user_id'][] = $value['ID'];
            }
        }

        //Define o limite de posts
        $whereJoin = array_merge($whereJoin,  ['LIMIT' => $limit]);

        //Se existir outros filtros selecionados
        if(key_exists('AND', $whereJoin)){
            //Executa query (Medoo)
            $result = $db->select('usermeta', [
                'usermeta.user_id(ID)'
            ], $whereJoin);
        }

        //Em caso de não houver nenhum tipo de filtragem solicitada, retornar usuários
        if(count($where) <= 0 && is_null($result)){
            //Lista de ids de usuários via table 'users'
            $result = $db->select('users', ['ID'], $whereJoin);
        }

        //Inicializa array
        $users = [];

        //Se foi encontrado algum usuário
        if (count($result) > 0) {

            $repeteadID = [];

            //Percorre array de dados
            foreach ($result as $key => $value) {
                
                if (in_array($value['ID'], $repeteadID)){
                    continue;
                }

                $user = new self();
                //TODO: Definir uma nova função que retorne apenas dados baseados para listagem
                $users[] = $user->getMinProfile($value['ID']);
                $repeteadID[] = $value['ID'];
            }

        } else {
            $users = ['error' => ['search' => 'Nenhum usuário encontrado.']];
        }    
        
        return $users;

    }

    /** Retorna Tipo de usuário */
    public function getUserType($ID = null) {
        return $this->_getType($ID);
    }

    /** Retorna erro email de usuário existente */
    public function isUserEmailExist(string $email) {
        return $this->can_update_user_email($email);
    }

    /* Addicionar um único usuário */
    public function add($data){
        return $this->register($data);
    } 

    /* Atualizar um único usuário */
    public function update( $data ){
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
    protected function register(Array $data, $id = null):array{

        //Se existir um token via social login
        if(array_key_exists('token', $data) && !empty($data['token'])){
            $this->socialLogin = TRUE;
        }

        //Se for null, necessário senha serem confirmadas
        if(is_null($id)){
            //Verifica se password está correta
            if( $data['user_pass'] != $data['confirm_pass'] ){
                return ['error' => ['confirm_pass' => 'Confirme a senha corretamente.']];
            }   
            $isUpdate = FALSE; 
        }
        else{
            $isUpdate = TRUE;
        }  

        //Filtrar inputs e validação de dados
        $filtered = $this->verifySentData($data, $isUpdate);

        //Se houver algum campo inválidado obrigatório: display_name || user_email
        if (array_key_exists('error', $filtered) && in_array(['display_name', 'user_email'], $filtered['error'])) {
            return array('error' => $filtered['error']);
        }

        //Verifica se houve envio de senha para gerar hash
        if(array_key_exists('user_pass', $filtered)){
            //Converte password em hash
            $filtered['user_pass'] = $this->hashPassword($filtered['user_pass']);
        }

        //Colunas principais válidas
        $userColumns = array(
            'user_login','user_pass','user_email','display_name'
        );

        //Verifica se usuário já existe no banco de atualiza
        if (!is_null($id) && $this->model->load(['ID' => $id])) {
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

            //Preenche colunas com valores de array
            $this->model->fill($userData); 

            //Atualiza os dados no banco informado as colunas
            $result = $this->model->update(array_keys($userData));
        }
        else{
            /** New Register  */
            $this->model = new UserModel();

            //Preenche colunas com valores
            $this->model->fill(array_only($filtered, $userColumns)); 

            //Salva os dados no banco
            $result = $this->model->save();
        }

        //SE resultado for true, continua execução
        if ($result) {

            //Retorna ID da query atual
            $primaryKey = $this->model->getPrimaryKey();
            
            //inicializa array
            $usermetaID = [];

            //Inicializa modelo de usermeta
            $this->metaModel = new UsermetaModel();

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

            //Percorre array
            foreach ($filtered as $key => $value) {

                //Se não existir no array -> pula
                if (!in_array($key, $usermetaColumns) ) {
                    continue;
                }

                //Registra usermetas enviados
                $usermetaID[] = $this->register_usermeta($key, $value, $primaryKey['ID']);

            }

            $msg = (!$isUpdate)? 'Seu cadastro foi realizado com sucesso! Bem Vindo!' : 'Seu dados foram atualizados com sucesso!';

            //Mensagem de sucesso no cadastro
            return ['success' => ['register' => $msg]];

        } else {
            //Mensagem de erro no cadastro
            return ['error' => ['register' => 'Houve erro em seu cadastro. Contate nosso administrador.']];
        }

    }  

    /** Registra usermeta baseado nos parametros */
    private function register_usermeta($meta_key, $meta_value, $user_id, $check = true) {

        /*Se valor for false (validação não permitida), 
        não registrar usermeta e encerrar execução da função */
        if($meta_value == false){
            return;
        }

        //Retorna instancia de modelo
        $meta = $this->metaModel->getInstance(['user_id' => $user_id,'meta_key' => $meta_key]);

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
                $itemTagged[] = (\preg_match('/^[0-9]+/', $item))? ['ID' => $item, 'certify' => $this->sendNotifyClub($item, $user_id)]: ['club_name' => $item];
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
            if (in_array($meta->meta_key, ['sport', 'clubes'])) {
                //Atribui array de IDS
                $meta->meta_value = $meta_value;
            } else {
                //Atribui valor ao meta_value
                $meta->meta_value = $meta_value['value'];
            }            
            
            //Array de campos a ser atualizado
            $fields = ['meta_value'];

            //Verifica se visibilidade foi definida e add novo valor
            if(isset($meta_value['visibility']) && $meta_value != 0){
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
        $email->setContent('<p style="color:#444;font-size:14px;">' . $data['message_content'] . '</p>');

        //Executando disparo
        return $email->send();
    } 

    /** 
     *  Retorna metadados do usuário
     *  
     * @since 2.0
     * 
     * @return mixed
     */
    private function _getUsermeta($ID, $only = []):array {

        if (is_null($ID) || empty($ID) ) {
            return null;
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
        $type = (key_exists('type', $formated))? $formated['type']['value']:1;

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
            'user_login'   => $userModel->user_login, 
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
            return $checked['error'] = ['user_email' => "E-mail já atribuido a um usuário."]; 
        } 

        //Habilitado para update de email
        return [];
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

    /** Aumenta quantidade 'views' em metadata */
    public function increaseView($id){

        //Filtro
        //Dados para ser utilizando para trazer dados database
        $filter = ['user_id' => (int) $id, 'meta_key'  => 'views'];

        //Inicializa modelo
        $metaModel = new UsermetaModel();

        //Se não existir data para execução de fn
        if ($metaModel->load($filter)) {
            
            //Atribui qtd atual
            $qtdAtual = (int) $metaModel->meta_value;        

            //Insere novo valor a coluna selecionada
            $metaModel->meta_value = $qtdAtual + 1;

            //Atualiza registro no banco e retorna true ou false
            return $metaModel->update(['meta_value']);
        }
        else{
            //Adiciona primeiro view
            $filter['meta_value'] = 1;
            $filter['visibility'] = null;
  
            //Preenche modelo com dados
            $metaModel->fill($filter);        

            //Salva registro no banco e retorna true ou false
            return $metaModel->save();
        }

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

    //Retorna status do usuário
    public function getStatus(){
        $status = $this->model->user_status;
        return $status;
    } 

    /** Verifica se houve sucesso na inclusão dos dados e executa função
     * de enviar notificação ao clube
     */
    private function sendNotifyClub(int $clubID, int $user_id) {
        $response = UserClub::isClubExist($clubID, $user_id);
        if (!$response){
            return;
        } 

        //Retorna marcação de informação não verificada
        return env('CLUBE_NAO_VERIFICADO');
        
    } 
    
    /** Define array de campos necessários para determinado tipo de perfil */
    private function onlyUsermetaValid($typeUser = 1):array{

        //Colunas Gerais'
        $usermeta = array(
            'type', 'sport', 'clubes', 'telefone', 'city', 'state', 'country', 'neighbornhood', 'zipcode', 'telefone', 'address', 'profile_img', 'my-videos', 'views', 'searched_profile', 'biography', 'session_tokens'
        );

        //Compartilhado entre Atleta e Profissional do Esporte
        if(in_array($typeUser, [1, 2])){
            $usermeta = array_merge($usermeta, ['birthdate', 'gender', 'rg', 'cpf', 'formacao', 'cursos', 'parent_user']);
        }

        //Compartilhado entre Faculdade e Clube
        if(in_array($typeUser, [3, 4, 5])){
            $usermeta = array_merge($usermeta, ['cnpj', 'eventos', 'meus-atletas', 'club_site', 'club_liga', 'club_sede']);
        }

        //Compartilhado entre Atleta e Clube
        if(in_array($typeUser, [1, 3, 4, 5])){
            $usermeta = array_merge($usermeta, ['empates', 'vitorias', 'derrotas', 'titulos', 'jogos', 'titulos-conquistas']);
        }

        //Atleta
        if($typeUser == 1){
            $usermeta = array_merge($usermeta, ['weight', 'height','posicao', 'stats', 'stats-sports']);
        }

        return $usermeta;
    } 

    /** Formatando tipos de dados para grava no banco */
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

}