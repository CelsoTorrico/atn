<?php 

namespace Core\Profile;

use Core\Interfaces\UserInterface as UserInterface;
use Core\Utils\PasswordHash as PasswordHash;
use Core\Utils\AppValidation as AppValidation;
use Symfony\Component\HttpFoundation\Session\Session;
use Core\Database\UserModel as UserModel;
use Core\Database\UsermetaModel;
use Core\Database\UsertypeModel;
use Core\Database\SportModel;

use Closure;
use aryelgois\Medools\ModelIterator;

class User{

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
    public $metadata; //metadados genericos
    private $_user_email; //email
    
    //Contrução da classe
    public function __construct($args = array()) {

        $this->model = new UserModel();
        $this->appVal = new AppValidation();
        
        //Verifica se parametros estão presentes
        if (array_key_exists('user_login', $args) 
        && array_key_exists('user_pass', $args)) {

            //Carrega respectivo user no banco
            if ($this->model->load(['user_login' => $args['user_login'], 'user_pass' => $args['user_pass']])) {
                $user = $this->model->getData();
                return $this->get($user['ID']);
            } else {
                return null;
            } 

        } else {
            return null;
        }
    }

    /**
     * Retorna dados de usuário único por ID
     * @since 2.0
     * 
     * @return mixed
     */
    public function get( int $id ) {

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
        }
        else{
            unset($this->metadata);
        }

        //Verifica se existe metado tipo
        if (!is_null($type = $this->_getType($id))) {
            //Add valores a variaveis encontrados as variaveis da classe
            $this->setVars(['type' => $type]);
        }

        //Verifica se existe metado de esporte
        if (is_array($usermeta) && array_key_exists('sport', $usermeta)) {
            //Retorna lista de esportes
            $sport = $this->_getSport();
            //Add valores a variaveis encontrados as variaveis da classe
            $this->setVars(['sport' => $sport]);
        }

        return $this;

    } 

    /** Retorna dados de estatistica */
    public function getStats(){

        if( !in_array($this->type['ID'], [1, 3, 4, 5])) {
            return [];
        }
        
        //Campos gerais de estatisticas
        $statsGerais = [
            'empates','vitorias', 'titulos', 'jogos', 'derrotas', 'titulos-conquistas'
        ];

        //Array de numeros
        $numeros  = [];
        $porcento = [];

        //Percorre array para trazer dados gerais
        foreach ($statsGerais as $value) {            
            if ( array_key_exists($value, $this->metadata)) {
                $numeros[$value] = $this->metadata[$value]['value'];
            }
        }

        //Retorna dados e soma atribuindo total
        $total = array_sum(array_only($numeros, ['vitorias', 'empates', 'derrotas']));
        
        //Faz calculo para exibir aproveitamento em porcentagem
        if ( is_int($total) && isset($numeros['jogos']) && $total == (int) $numeros['jogos'] ) {
            $umcento = ($total / 100);
            $porcento = [
                'vitorias' => $numeros['vitorias'] * $umcento.'%',
                'empates'  => $numeros['empates']  * $umcento.'%',
                'derrotas' => $numeros['derrotas'] * $umcento.'%'
            ];
        }

        //Nome do esporte de estatisticas
        $sport_name = isset($this->metadata['stats-sports']['value'])? $this->metadata['stats-sports']['value'] : '';

        //Dados de estatisticas registrados
        $stats = isset($this->metadata['stats']['value'])? $this->metadata['stats']['value'] : [];
        
        //Monstando array de dados
        $mainSport = [
            'sport_general'         => $numeros,
            'sport_name'            => $sport_name,
            'sport_performance'     => [
                'stats'         => $stats,
                'average_match' => $porcento
            ]
        ];

        //Retornando array de dados estatisticos
        return $mainSport;

    }

    /** Retorna dados do usuário em formato PDF */
    public function getUserPdf(){
        
        //Carreg classe de composição de PDFS e especifica caminho de download
        $mpdf = new \Mpdf\Mpdf(['tempDir' => __DIR__ .'/public/pdf']);
        
        //Adicionando conteúdo inicial do arquivo
        $html = '<h1>' . $this->display_name . '</h1>';
        
        //Verifica se usuário tem metadata para imprimir
        //TODO: Verifica tradução e formatação dos campos
        if( is_array($this->metadata) ){
            foreach ($this->metadata as $key => $value) {
                $html .= $key. ':';
                $html .= $value['value'];
                $html .= '<br />';
            }
        }        

        //Escreve dados no PDF
        $mpdf->WriteHTML($html);

        //Definindo nome do arquivo
        $filename = 'resume-'. strtolower($this->user_login) .'.pdf';
        
        //Gera arquivo e forma de submeter
        $mpdf->Output($filename, \Mpdf\Output\Destination::DOWNLOAD);

        //Retorna string com caminho do arquivo
        return __DIR__ .'/public/pdf/' . $filename;
    }

    /* Retorna lista de usuários */
    public function getFriends( $filter = array() ){

        //Invoca função de retornar lista de usuários
        $friendsList = new Friends($this->ID, $filter);
        
        return $friendsList->get();      
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
        $checked = $this->verifySentData($data);

        //Checkando data e erros e avisa que é update de perfil
        $filtered = $this->checkSentData($checked, $isUpdate);

        //Verifica se houve erro retorna
        if( array_key_exists('error', $filtered) && count($filtered['error']) > 0 ){
            return array('error' => $filtered['error']);
        }

        //Verifica se houve envio de senha para gerar hash
        if(array_key_exists('user_pass', $filtered)){
            //Converte password em hash
            $filtered['user_pass'] = $this->hashPassword($filtered['user_pass']);
        }

        //Colunas válidas
        $userColumns = array(
            'user_login','user_pass','user_email','display_name'
        );

        //Verifica se usuário já existe no banco de atualiza
        if (!is_null($id) && $this->model->load(['ID' => $id])) {
            /** Update Register */
            
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
            if( is_null($getType = $this->_getType($primaryKey)) ){
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

                $meta = $this->metaModel->getInstance(['user_id' => $primaryKey['ID'],'meta_key' => $key]);

                //Se for update atributos
                if (!is_null($meta) && !$meta->isFresh()) {
                    
                    //Atribui valor ao meta_value
                    $meta->meta_value = $value['value'];

                    //Verifica se visibilidade foi definida e add novo valor
                    if(isset($value['visibility'])){
                        $meta->visibility = $this->appVal->check_user_inputs('visibility', $value['visibility']);
                    }
                    
                    //Faz update e retorna ID de resultado
                    $usermetaID['update'][$key] = ($meta->update([$key])) ? $meta->getPrimaryKey() : false;

                } else {
                    //Cria novos atributos e valores para salvar
                    $metaData = [];
                    $metaData['user_id']    = $primaryKey['ID'];
                    $metaData['meta_key']   = $key;
                    $metaData['meta_value'] = $value;

                    //Verifica se visibilidade foi definida e add novo valor
                    if( is_array($value) && isset($value['visibility'])){
                        $metaData['visibility'] = $this->appVal->check_user_inputs('visibility', $value['visibility']);
                    }

                    //Instancia novo modelo
                    $meta = new UsermetaModel();

                    //Atribui atributos no modelo
                    $meta->fill($metaData);
                    
                    //Salva dado e retorna ID de resultado
                    $usermetaID['create'][$key] = ($meta->save())? $meta->getPrimaryKey() : false;

                }               

            }

            //Mensagem de sucesso no cadastro
            return ['success' => ['register' => 'Seu cadastro foi realizado com sucesso! Bem Vindo!']];

        } else {
            //Mensagem de erro no cadastro
            return ['error' => ['register' => 'Houve erro em seu cadastro. Contate nosso administrador.']];
        }

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

    /** 
     *  Retorna metadados do usuário
     *  
     * @since 2.0
     * 
     * @return mixed
     */
    private function _getUsermeta($ID) {

        if (is_null($ID) || empty($ID) ) {
            return null;
        }

        //Campos válidos
        $only = $this->onlyUsermetaValid();

        //Instancia classe de modelo passando filtro
        $metadata = new UsermetaModel();

        //Retorna todos as metadatas filtrando por ID
        $result = $metadata->dump(['user_id' => $ID,'meta_key' => $only]);

        //Se array estiver vazio retorna nulo
        if (count($result) <= 0 ) {
            return null;
        }

        //campos que estão formatados como serializados
        $is_array   = self::getArrayUsermeta();
        $is_json    = self::getJsonUsermeta();

        $formated = [];

        foreach ($result as $value) {
            
            //Atribui meta_key atual
            $metakey = $value['meta_key'];

            //Verifica permissão do atributo de perfil
            if(!$this->hasPermission($value) || empty($value['meta_value'])) {
                continue;
            }

            //Percorre array de dados e formata para exibição no frontend
            if (in_array($metakey, $is_array) ) {
                $formated[$metakey]['value'] = json_decode($value['meta_value']);
            } elseif (in_array($metakey, $is_json) && !empty($value['meta_value'])) {
                $formated[$metakey]['value'] = unserialize($value['meta_value']);
            } else {
                $formated[$metakey]['value'] = $value['meta_value'];
            }

            //Retorna visibilidade
            $formated[$metakey]['visibility'] = $value['visibility'];
        }

        return $formated;

    }

    /** 
     *  Retorna tipo do usuário
     *  
     * @since 2.0
     * 
     * @return mixed
     */
    private function _getType($ID = null) {

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
        if(isset($capabilities) && is_object($capabilities)){
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
        $this->sportModel = new SportModel(); 

        if (! $result = $this->sportModel->dump(['ID' => $this->sport['value']])) {
            return null;
        }

        return $result;
    }

    /**
     * @param $userModel object class UserModel()
     */
    private static function typeUserClass(UserModel $userModel){

        //Se usuário tiver dados definidos atribui classe respectiva
        if (!is_a($userModel, 'Core\Database\UserModel')) {
            return ['error' => ['type' => 'Impossível determinar o tipo de usuário dessa conta. Contate o administrador.']];
        }

        //Verifica tipo de ID de usuário
        if (is_null($type = (new self)->_getType($userModel->ID))) {
            return ['error' => ['type' => 'Tipo de usuário inexistente. Contate o administrador.']];
        }

        //Tipos de usuários e suas classes
        $typeClass = [
            1 => User::class,
            2 => UserProfissional::class,
            3 => UserCollege::class,
            4 => UserClub::class
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
            'sport'         => 'sport'
        );

        foreach ($valid as $key => $value) {
            if(!array_key_exists($key, $data)){
                continue;
            }
            $this->$key = $data[$value];
        }

    }

    //Verifica os dados enviados pelo usuário, faz validação e formata
    protected function verifySentData($data):array{
        
        //Inicia classe Validação
        $val = $this->appVal;
        
        //Executa função de checar inputs
        return $val->check_user_inputs($data);

    }

    //TODO: Formatar para PHP
    protected function checkSentData($data, $isUpdate = false):array{

        //Inicia classe Validation
        $val = $this->appVal;

        //Executa função de checar inputs
        $checked = $val->check_filtered_inputs($data, $isUpdate);

        //Se for update de perfil, finaliza execução
        if($isUpdate){
            return $checked;
        }

        //Montando query e executando
        $searchQuery = $this->model->load([
            'user_email' => $checked['user_email']
        ]);

        //Verificando se resposta foi verdadeira
        if ($searchQuery) {            
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

    /* Função verifica se dado é permitido para determinado usuário */
    private function hasPermission( $data ):bool{
        
        //Se visibilidade for null, informação é pública
        if( is_null($data['visibility']) 
        || empty($data['visibility'])  
        || $data['visibility'] <= 0){
            return true;
        }

        //Verifica se visibilidade é compatível com tipo de perfil
        if( $data['visibility'] != $this->type['ID']){
            return false;
        }

        //Retorna Informação
        return true;
        
    }

    /** Aumenta quantidade 'views' em metada */
    public function increaseView($id){

        //Filtro
        //Dados para ser utilizando para trazer dados database
        $filter = ['user_id' => (int) $id, 'meta_key'  => 'views'];

        //Inicializa modelo filtrando data necessária
        $metaModel = $this->metaModel;

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

    //Retorna status do usuário
    public function getStatus(){
        $status = $this->model->user_status;
        return $status;
    } 
    
    /** Define array de campos necessários para determinado tipo de perfil */
    private function onlyUsermetaValid($typeUser = 1):array{

        //Colunas Gerais'
        $usermeta = array(
            'type', 'sport', 'telefone', 'city', 'state', 'country', 'neighbornhood', 'telefone',
            'address', 'profile_img', 'my-videos', 'views', 'searched_profile', 'biography'
        );

        //Compartilhado entre Atleta e Profissional do Esporte
        if(in_array($typeUser, [1, 2])){
            $usermeta = array_merge($usermeta, ['birthdate', 'gender', 'rg', 'cpf', 'clubes', 'formacao', 'cursos', 'social_tokens', 'parent_user']);
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
        return ['my-videos', 'titulos-conquistas', 'eventos', 'cursos'];
    }

    //Keys formatados como json
    private static function getJsonUsermeta(){
        return ['stats', 'formacao', 'meus-atletas'];
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