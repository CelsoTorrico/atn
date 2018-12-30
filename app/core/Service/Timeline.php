<?php

namespace Core\Service;

use Core\Profile\User;
use Core\Profile\Login;
use Core\Service\Comment;
use Core\Utils\FileUpload;

use Core\Database\PostModel;
use Core\Database\PostmetaModel;

class Timeline {

    protected $model;
    protected $currentUser;
    protected $followers;
    const TYPE = 'timeline';

    public function __construct($user){
        
        $this->model = new PostModel();
        $this->currentUser = $user;
        $this->followers = $user->getFriends([], true);

        //Retorna classe usuário ou retorna erro
        if( is_null($this->currentUser) ){
            return ['error' => ['comment' => 'Você não tem permissão para comentar.']];
        }
    }

    /* Retorna timeline por ID */
    function get($id) {
        
        //Query enviando Id de Timeline
        $result = $this->model->load(['ID' => $id]);

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
            'quantity_comments' => $comment->getQuantity()            
        ]);

        //Se item tiver foto anexada
        if ($attach = $this->model->getInstance(['post_parent' => $id, 'post_type' => 'attachment'])) {
            $timelineData['attachment'] = $attach->guid;
        }

        //Retorna array data
        return $timelineData;

    }

    /* Retorna lista de timeline */
    function getAll(){     

        $followers = $this->followers;

        //TODO: Retorna todos posts de feed baseado nas conexões
        $allTimelines = $this->model->getIterator([
            'post_author'   =>  $followers,
            'post_type'     =>  static::TYPE
        ]);
        
        //Retorna resposta
        if( $allTimelines->count() > 0){

            //Array para retornar dados
            $timelines = [];
            
            foreach ($allTimelines as $item) {

                //Verifica se é valido
                if ( !$allTimelines->valid() ) {
                    continue;
                }

                //Atribui dados do comentário
                $timelineData = $item->getData();

               //Inicializa classe de comentários passando ID do POST
                $comment = new Comment($item->ID);

                //Combina array timeline e comentários
                $timelines[] = array_merge($timelineData, [
                    'quantity_comments' => $comment->getQuantity()            
                ]); 

                //Se item tiver foto anexada
                if ($attach = $this->model->getInstance(['post_parent' => $item->ID, 'post_type' => 'attachment'])) {
                    $timelines['attachment'] = $attach->guid;
                }
                
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
        $filtered = [];
        $filtered['post_content']   = filter_var($data['post_content'], FILTER_SANITIZE_STRING);
        $filtered['post_author']    = $this->currentUser->ID;
        $filtered['post_type']      = static::TYPE;

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

                //Tipos de visibilidades do usuário
                $levels = $this->getVisibilityLevels();

                if (!array_search($visibility, $levels)) {
                    return;
                }

                //Inicializando modelo
                $postmeta = new PostmetaModel();
                
                $postmeta->fill([
                    'post_id'       => $lastInsert['ID'],
                    'meta_key'      => 'post_visibility',
                    'meta_value'    => $visibility
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
            return ['success' => ['register' => 'Atualização realizada com sucesso!']];

        }
        else{
            //Mensagem de erro no cadastro
            return ['error' => ['register' => 'Houve erro na atualização! Tente novamente mais tarde.']];
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
            return ['error' => ['register' => 'Houve erro ao deletar atualização! Tente novamente mais tarde.']];
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
        if( !$comment->get($comment_ID) ){
            return ['error' => ['comment' => 'Comentário inexistente. Impossível cadastrar uma resposta']];        
        }

        //Filtrar inputs e validação de dados
        $filtered = [
            'comment_post_ID'    => $comment->comment_post_ID,
            'comment_content'    => filter_var($data, FILTER_SANITIZE_STRING),
            'comment_author'     => $this->currentUser->display_name,
            'user_id'            => $this->currentUser->ID,
            'comment_parent'     => $comment_ID
        ];  

        //Retorna informação
        return $comment->add($filtered);

    }

    /** Verifica a visibilidade do conteúdo */
    private function isVisibility():bool{
        
        //Retorna visibilidade definida
        $visibility = new PostmetaModel();

        //Se autor post é mesmo usuário que quer visualizar
        if ($this->model->post_author == $this->currentUser->ID) {
            return true;
        }

        //Se não estiver nenhuma definição o post é público por definição 
        if (!$visibility->load(['post_id' => $this->model->ID, 'meta_key' => 'post_visibility'])
        || $visibility->meta_value == 0) {
            return true;            
        }

        //Se for 1: Post privado, apenas seguidores podem ver
        if ($visibility->meta_value == 1) {
            return in_array($this->model->post_author, $this->followers);
        }

        //Se for maior que 1: Visualizaçõa definida por pertencer a um club
        //TODO: Verificar essa implementação
        if ($visibility->meta_value > 1) {
            
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
        
        //Tipo de visualização
        $levels = [
            'Público' => 0,
            'Privado' => 1
        ];

        //Se usuário for pertecente a um clube
        if ($this->currentUser->type['ID'] == 2) {
            foreach ($this->currentUser->clubs as $key => $value) {
                $levels[$value['club_name']] = $value['ID'];
            } 
        }

        return $levels;

    }

}