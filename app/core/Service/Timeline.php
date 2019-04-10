<?php

namespace Core\Service;

use Core\Profile\User;
use Core\Service\Comment;
use Core\Service\Like;
use Core\Utils\FileUpload;

use Core\Database\PostModel;
use Core\Database\PostmetaModel;
use Core\Database\UsertypeModel;
use Illuminate\Support\Facades\Storage;

class Timeline {

    protected $model;
    protected $currentUser;
    protected $following;
    protected $like;
    const TYPE = 'timeline';

    public function __construct($user){
        
        //Inicializa classes
        $this->model = new PostModel();
        $this->currentUser = $user;
        $this->like = new Like($user);

        //Define following e retorna IDs
        $follow = new Follow($user);        
        $this->following = $follow->getFollowing(true);

        //Retorna classe usuário ou retorna erro
        if( is_null($this->currentUser) ){
            return ['error' => ['comment' => 'Você não tem permissão para comentar.']];
        }
    }

    /* Retorna timeline por ID */
    function get($id) {
        
        //Query enviando Id de Timeline
        $result = $this->model->load(['ID' => $id, 'post_status'   => ['open', 'publish', '0']]);

        //Verifica se post existe
        if (!$result) {
            return ['error' => ['timeline' => 'Item não existe.']];
        }

        //Verifica se usuário tem permissão de enxergar post
        if (!$this->isVisibility()) {
            return ['error' => ['timeline' => 'Você não tem permissão para ver este post.']];
        }

        //Inicializa classe de comentários passando ID do POST
        $comment = new Comment($this->model->ID);


        //Atribui dados do modelo a variavel como array
        $timelineData = $this->model->getData();

        //Combina array timeline e comentários
        $timelineData = array_merge($timelineData, [
            'list_comments' => $comment->getAll(),
            'quantity_comments' => $comment->getQuantity(),
            'has_like' => $this->like->isPostLiked($this->model->ID)         
        ]);

        //Adiciona dados básico do autor do post timeline
        $timelineData['post_author'] = (new User)->getMinProfile($timelineData['post_author']);

        //Se item tiver foto anexada
        if ($attach = $this->model->getInstance(['post_parent' => $id, 'post_type' => 'attachment']))
        {
            $timelineData['attachment'] = $attach->guid;
        }

        //Retorna array data
        return $timelineData;

    }

    /* Retorna lista de timeline */
    function getAll(int $paged = 0){     

        //Retorna lista de usuário que está conectado
        $following = $this->following;

        //Qtd de itens por página
        $perPage = 24;

        //A partir de qual item contar
        $initPageCount = ($paged <= 1)? $paged = 0 : ($paged * $perPage) - $perPage;

        //Paginação de timeline
        $limit = [$initPageCount, $perPage];

        //Retorna todos posts de feed baseado nas conexões
        $allTimelines = $this->model->getIterator([
            'post_author'   => $following,
            'post_type'     => static::TYPE,
            'post_status'   => ['open', 'publish', '0'],
            'ORDER'         => ['post_date' => 'DESC'],
            'LIMIT'         => $limit
        ]);
        
        //Retorna resposta
        if( $allTimelines->count() > 0){

            //Array para retornar dados
            $timelines = [];
            
            foreach ($allTimelines as $key => $item) {

                //Verifica se é valido
                if ( !$allTimelines->valid() ) {
                    continue;
                }

                //Atribui dados do comentário
                $timelineData = $item->getData();

                //Atribui modelo da timeline corrente para verificação de permissão
                $this->model = $item;

                //Verifica se usuário tem permissão de enxergar post
                if (!$this->isVisibility()) {
                    continue;
                }

               //Inicializa classe de comentários passando ID do POST
                $comment = new Comment($item->ID);

                //Combina array timeline e comentários
                $timeline = array_merge($timelineData, [
                    'quantity_comments' => $comment->getQuantity(),
                    'has_like' => $this->like->isPostLiked($item->ID)         
                ]); 

                //Adiciona dados básico do autor do post timeline
                $timeline['post_author'] = (new User)->getMinProfile($timelineData['post_author']);

                //Se item tiver foto anexada
                if ($attach = $this->model->getInstance(['post_parent' => $item->ID, 'post_type' => 'attachment'])) {
                    $timeline['attachment'] = $attach->guid;
                }

                //Adiciona ao array de items
                array_push($timelines, $timeline);
                
            }

            //Retorna array de timelines
            return $timelines;
        } 
        else{
            //Retorna erro
            return ['error' => ['timeline', 'Nenhum item a exibir.']];
        }   
        
    }  

    /* Retorna lista de timeline */
    function getUserAll(int $currentViewUser, int $paged = 0){     

        //Qtd de itens por página
        $perPage = 24;

        //A partir de qual item contar
        $initPageCount = ($paged <= 1)? $paged = 0 : ($paged * $perPage) - $perPage;

        //Paginação de timeline
        $limit = [$initPageCount, $perPage];

        //Retorna todos posts de feed baseado nas conexões
        $allTimelines = $this->model->getIterator([
            'post_author'   =>  $this->currentUser->ID,
            'post_type'     =>  static::TYPE,
            'post_status'   => ['open', 'publish', '0'],
            'ORDER'         => ['post_date' => 'DESC'],
            'LIMIT'         => $limit
        ]);
        
        //Retorna resposta
        if( $allTimelines->count() > 0){

            //Array para retornar dados
            $timelines = [];
            
            foreach ($allTimelines as $key => $item) {

                //Verifica se é valido
                if ( !$allTimelines->valid() ) {
                    continue;
                }

                //Atribui dados do comentário
                $timelineData = $item->getData();
                
                //Atribui modelo da timeline corrente para verificação de permissão
                $this->model = $item;

                //Verifica se usuário tem permissão de enxergar post
                if (!$this->isVisibility($currentViewUser)) {
                    continue;
                }

               //Inicializa classe de comentários passando ID do POST
                $comment = new Comment($item->ID);

                //Combina array timeline e comentários
                $timeline = array_merge($timelineData, [
                    'quantity_comments' => $comment->getQuantity(),
                    'has_like' => $this->like->isPostLiked($item->ID, $currentViewUser)         
                ]); 

                //Adiciona dados básico do autor do post timeline
                $timeline['post_author'] = (new User)->getMinProfile($timelineData['post_author']);

                //Se item tiver foto anexada
                if ($attach = $this->model->getInstance(['post_parent' => $item->ID, 'post_type' => 'attachment'])) {
                    $timeline['attachment'] = $attach->guid;
                }

                //Adiciona ao array de items
                array_push($timelines, $timeline);
                
            }

            //Retorna array de timelines
            return $timelines;
        } 
        else{
            //Retorna erro
            return ['error' => ['timeline', 'Nenhum item a exibir.']];
        }   
        
    }  

    /* Adiciona um item de timeline */
    function add( $data ){
        return $this->register($data);
    }

    /* Atualiza um plano */
    function update( $data, $id){
        return $this->register($data, $id);
    }  

    /* Deletar um plano */
    function delete( $ID ){
        return $this->deregister($ID);        
    }

    private function register($data, $postID = null){

        //Filtrar inputs e validação de dados
        $filtered = [
            'post_content'  => filter_var($data['post_content'], FILTER_SANITIZE_STRING),
            'post_author'   => $this->currentUser->ID,
            'post_type'     => static::TYPE
        ];        

        //Verifica ID
        if( !is_null($postID) )
        {
            //Verifica se existe registro no BD
            $load = $this->model->load([
                'ID' => $postID, 
                'post_author' => $this->currentUser->ID
            ]);

            //Insere novo valor a coluna selecionada
            $this->model->post_content = $filtered['post_content'];

            //Insere novo valor a coluna selecionada
            $this->model->post_type = $filtered['post_type'];

            //Atualiza registro no banco e retorna true ou false
            $result = ($load) ? $this->model->update(['post_content', 'post_type']) : false;
        }
        else{
            
            //Preenche colunas com valores
            $this->model->fill($filtered); 

            //Salva novo registro no banco
            $result = $this->model->save();
        }

        //SE resultado for true, continua execução
        if ($result) {

            //Pega id da última inserção
            $lastInsert = $this->model->getPrimaryKey();

            //Se enviado tipo de visibilidade de post
            if(isset($data['post_visibility'])) {

                $visibility = (int) $data['post_visibility'];
                $visibilityInsert = 0;

                //Tipos de visibilidades do usuário
                $levels = $this->getVisibilityLevels();

                //Verifica se visibilidade definida é válido para usuário
                foreach ($levels as $key => $value) {
                    if( $value['value'] == $visibility){
                        $visibilityInsert = $value['value'];
                        break;
                    }                        
                }

                //Inicializando modelo
                $postmeta = new PostmetaModel();
                
                $postmeta->fill([
                    'post_id'       => $lastInsert['ID'],
                    'meta_key'      => 'post_visibility',
                    'meta_value'    => $visibilityInsert
                ]);

                //Atribui valor de visibilidade ao post
                $postmeta->save();

            }

            //Verifica se existe objeto para upload
            if (isset($data['post_image']) && is_a($data['post_image'], 'Symfony\Component\HttpFoundation\File\UploadedFile')) {

                $file = $data['post_image'];

                //Inicializa classe de upload
                $upload = new FileUpload($this->currentUser->ID, $lastInsert['ID'], $file);

                //Enviar arquivo e insere no banco
                $upload->insertFile();           
            }

            //Mensagem de sucesso no cadastro
            return ['success' => ['timeline' => 'Atualização realizada com sucesso!']];

        }
        else{
            //Mensagem de erro no cadastro
            return ['error' => ['timeline' => 'Houve erro na atualização! Tente novamente mais tarde.']];
        }
    }

    private function deregister($ID){

        //Preenche colunas com valores
        if(!$this->model->load(['ID' => $ID, 'post_author' => $this->currentUser->ID])){
            return ['error' => ['timeline' => 'O registro da atualização não existe.']];
        }; 

        //Salva os dados no banco
        $result = $this->model->delete();

        //SE resultado for true, continua execução
        if($result){

            //Mensagem de sucesso no cadastro
            return ['success' => ['timeline' => 'Atualização deletada!']];

        }
        else{
            //Mensagem de erro no cadastro
            return ['error' => ['timeline' => 'Houve erro ao deletar atualização! Tente novamente mais tarde.']];
        }
    }


    /** Função de adicionar comentário a timeline */
    function addComment(int $id, $data = ''){

        //Filtrar inputs e validação de dados
        $filtered = [
            'comment_post_ID'    => $id,
            'comment_content'    => filter_var($data, FILTER_SANITIZE_STRING),
            'comment_author'     => $this->currentUser->display_name,
            'user_id'            => $this->currentUser->ID
        ];  
        
        if( !$this->model->load(['ID' => $id])){
            return ['error' => ['comment' => 'Timeline inexistente. Impossível cadastrar um comentário']];        
        }

        //Inicializa classe de comentário
        $comment = new Comment();

        //Retorna informação
        return $comment->add($filtered);

    }

    /** Função de adicionar comentário a timeline */
    function addResponse(int $comment_ID, $data = ''){

        //Retorna classe usuário ou retorna erro
        if( is_null($this->currentUser) ){
            return ['error' => ['comment' => 'Você não tem permissão para comentar.']];
        }

        //Inicializa classe de comentário
        $comment = new Comment();

        //Verifica se comentário existe
        if( !$comment->model->load(['comment_ID' => $comment_ID]) ){
            return ['error' => [
                'comment' => 'Comentário inexistente. Impossível cadastrar uma resposta']];        
        }

        //Filtrar inputs e validação de dados
        $filtered = [
            'comment_post_ID'    => $comment->model->comment_post_ID,
            'comment_content'    => filter_var($data, FILTER_SANITIZE_STRING),
            'comment_author'     => $this->currentUser->display_name,
            'user_id'            => $this->currentUser->ID,
            'comment_parent'     => $comment_ID
        ];  

        //Retorna informação
        return $comment->add($filtered);

    }

    /** Verifica a visibilidade do conteúdo */
    private function isVisibility($viewer_user_id = null):bool{
        
        //Definindo id do visualizador da timeline
        if(is_null($viewer_user_id)){
            $viewer_user_id = $this->currentUser->ID;
        }

        //Retorna visibilidade definida
        $visibility = new PostmetaModel();

        //Se autor post é mesmo usuário que quer visualizar
        if ($this->model->post_author == $viewer_user_id) {
            return true;
        }

        //Se não estiver nenhuma definição o post é público por definição 
        if (!$visibility->load(['post_id' => $this->model->ID, 'meta_key' => 'post_visibility'])
        || $visibility->meta_value == 0) {
            return true;            
        }

        //Se for 99: Post privado, apenas seguidores podem ver
        if ($visibility->meta_value == 99) {
            return in_array($viewer_user_id, $this->following);
        }

        //Se for maior que 1: Visualizaçõa definida por pertencer a um club
        //TODO: Verificar essa implementação
        if ($visibility->meta_value > 1 && $visibility->meta_value != 99) {
            
            $check = false;
            
            foreach ($this->currentUser->clubs as $key => $value) {
                if ($value['ID'] == $visibility->meta_value) {
                    $check = true;
                    break;
                }
            }

            return $check;
        }        

    }

    /** Retorna os levels de visibilidades de post */
    public function getVisibilityFields(){
        return $this->getVisibilityLevels();
    }

    /** Define e retorna os levels de visibilidades de post */
    private function  getVisibilityLevels() {

        //Tipo de visualização padrão
        $levels = [
            ['option' => 'Público', 'value' => 0],
            ['option' => 'Privado', 'value' => 99]
        ];

        //Retornando tipos de usuário do BD
        $usertypeModel = new UsertypeModel();
        $usertypes = $usertypeModel->getIterator([]);
        
        //Aplicando a lista de visibilidade
        foreach ($usertypes as $item) {
            $levels[] = ['option' => $item->type, 'value' => (int) $item->ID];
        }        

        //Se usuário for um clube, adicionar visibilidade para posts privados para somente os pertencentes ao grupo
        if ((int)$this->currentUser->type['ID'] > 2) {
            $levels[] = [
                'option'    => $this->currentUser->display_name, 
                'value'     => (int) $this->currentUser->ID];
        }

        //Se usuário for pertecente a um clube, adicionar visibilidade para posts privados para somente os pertencentes ao clube
        if (!is_null($this->currentUser->clubs)) {
            foreach ($this->currentUser->clubs as $key => $value) {
                if(key_exists('ID', $value)) {
                    
                    //Só permitir clubes que foram verificados com sucesso
                    if($value['certify'] != 'Verified'){
                        continue;
                    }

                    //Instanciando classe de usuário
                    $user = new User();
                    $user = $user->getUser($value['ID']);

                    //Atribuindo um novo paarametro ao select
                    $levels[] = ['option' => $user->display_name, 'value' => (int) $value['ID']];
                }                
            } 
        }

        return $levels;

    }

    /** Retorna as últimas atividades de usuários */
    public function getLastActivity(){
        
        //Qtd de itens por página
        $limit = 10;

        //Retorna todos posts de feed baseado nas conexões
        $allTimelines = $this->model->getIterator([
            'post_author[!]'    => $this->currentUser->ID,
            'ORDER'             => ['post_date' => 'DESC'],
            'LIMIT'             => $limit
        ]);

        //Retorna resposta
        if( $allTimelines->count() > 0){

            //Array para retornar dados
            $timelines = [];
            
            foreach ($allTimelines as $key => $item) {

                //Verifica se é valido
                if ( !$allTimelines->valid() ) {
                    continue;
                }

                //Atribui dados do comentário
                $timelineData = $item->getData();

                //Atribui modelo da timeline corrente para verificação de permissão
                $this->model = $item;

                //Adiciona data do post
                $timeline['post_date'] = $timelineData['post_date'];

                //Adiciona o tipo de post
                $timeline['post_type'] = $timelineData['post_type'];
                
                //Adiciona dados básico do autor do post timeline
                $timeline['post_author'] = (new User)->getMinProfile($timelineData['post_author']);

                //Adiciona ao array de items
                array_push($timelines, $timeline);
                
            }

            //Retorna array de timelines
            return $timelines;
        } 
        else{
            //Retorna erro
            return ['error' => ['activity', 'Nenhuma atividade recente.']];
        } 
    }   

}