<?php

namespace Core\Service;

use Core\Database\CommentModel;
use Core\Database\PostModel;

class Comment {

    public $comment_ID; 
    public $comment_post_ID;
    public $comment_author;
    public $user_id;
    public $comment_content;
    public $comment_date;
    public $responses; //Array de respostas ao comentário

    protected $model;

    function __construct($post_id = 0) {

        //Instancia modelo
        $this->model = new CommentModel();    

        //Se id enviado for válido
        if (is_null($post_id) && $post_id <= 0) {
            return null;
        }
        
        //Carrega comentário mais recente do post
        $commentExist = $this->model->load(['comment_post_ID' => $post_id]);
            
        //Adiciona valores de usuario as variaveis da classe
        return ($commentExist) ? $this->get($this->model->comment_ID) : null;
        
    }

    //Retorna único e instancia classe
    public function get( int $id ) {
        
        //Verifica se existe ID e carrega dados
        if (!empty($id) && $id <= 0) {
            return ['error' => ['comment' => 'ID de comentário Inexistente']];
        }

        //Pesquisa comentários do post
        $search = ['comment_ID' => $id];
            
        //Inicializa modelo
        $commentExist = $this->model->load($search);

        //Add valores de usuario as variaveis da classe
        if (!$commentExist) {
            return ['error' => ['comment' => 'Comentário Inexistente']];
        }

        //Atribui valor ao array
        $commentData = $this->model->getData();

        //Add valores de usuario as variaveis da classe
        if (is_array($commentData) && count($commentData) <= 0) {
            return ['error' => ['comment' => 'Comentário Inexistente']];
        }

        //Atribui valores as variaveis publicas
        $this->setVars($commentData);

        //Adiciona comentários filho
        $this->responses = $this->_getResponses();

        //Retorna objeto
        return $this;

    }   

    /* Retorna lista de comentários */
    public function getAll():Array{

        //Inicializa classe de iteração sobre comentários (BD)
        $allcomments = $this->model->getIterator(['comment_post_ID' => $this->comment_post_ID]);

        //Verifica se existe comentários e retorna array
        if($allcomments->count() < 0){
            return [];
        }
        
        //Retorna objeto para iterar sobre comentários
        $comments = [];

        //Percorre array de comentários
        foreach ( $allcomments as $comment ) {

            //Verifica se é valido
            if ( !$allcomments->valid() ) {
                continue;
            }
            
            //Atribui dados do comentário
            $commentData = $comment->getData();

            //Atribui valores as variaveis publicas
            $this->setVars($commentData); 
            
            //Adiciona comentários filho
            $this->responses = $this->_getResponses();           

            //Atribuindo dados ao array
            $comments[] = array_merge($commentData, ['responses' => $this->responses]);           
            
        }

        //Retornando array de comentários
        return $comments;

    }

    /** Retorna quantidade de comentários */
    public function getQuantity(){

        //Retorna todos os comentários do post
        $allcomments = $this->model->getIterator(['comment_post_ID' => $this->comment_post_ID]);

        //Verifica se é nulo = não existe comentário
        if (!$allcomments || $allcomments->count() <= 0) {
            return "Nenhum Comentário";
        } else {
            //Retorna qtd de comentários
            return $allcomments->count();
        }
    }

    /* Retorna lista de comentários */
    private function _getResponses():Array{

        $responseList = $this->model->dump([
            'comment_post_ID'   =>  $this->comment_post_ID,
            'comment_parent'    =>  $this->comment_ID
        ]);

        //Verifica se é nulo = não existe comentário
        if (!is_array($responseList) || count($responseList) <= 0) {
            return [];
        } else {
            //Retorna array de comentários
            return $responseList;
        }        
    }

    /** Adicionar comentário a determinada timeline */
    function add(array $data){

        //Verifica ID
        if ( is_null($data['comment_post_ID']) ){
            return ['error' => ['comment' => 'Não foi possível adicionar comentário.']];
        }

        //Verifica ID
        if ( empty($data['comment_content'])) {
            return ['error' => ['comment' => 'Preencha corretamente campo de comentário.']];
        }

        //Preenche colunas com valores
        $this->model->fill($data); 

        //Salva novo registro no banco
        $result = $this->model->save();

        //SE resultado for true, continua execução
        if($result){
            
            //Modelo de timeline
            $post = new PostModel(['ID' => $data['comment_post_ID']]);
            
            //Intanciando notificação
            $notify = new Notify($this->model->user_id);
            
            //Adicionando notificação
            $r = $notify->add(6, $post->post_author, $this->model->user_id);
            
            //Mensagem de sucesso no cadastro
            return ['success' => ['comment' => 'Comentário realizado com sucesso!']];
        }
        else{
            //Mensagem de erro no cadastro
            return ['error' => ['cooment' => 'Houve erro ao registrar comentário! Tente novamente mais tarde.']];
        }
    }

    /** Adiciona valores as variaveis publicas */
    private function setVars(Array $data){

        $valid = [
            'comment_ID', 'comment_post_ID', 'comment_author', 'user_id',
            'comment_content','comment_date'
        ];

        foreach ($valid as $value) {
            if(!array_key_exists($value, $data)){
                continue;
            }
            $this->$value = $data[$value];
        }

    }

}