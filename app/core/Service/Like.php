<?php

namespace Core\Service;

use Core\Profile\User;
use Core\Database\LikeModel;
use Core\Utils\DataConverter;
use Illuminate\Http\Request;

class Like {

    protected $model;
    protected $currentUser;

    public function __construct($user){
        
        $this->model = new LikeModel();
        $this->currentUser = $user;

        //Retorna classe usuário ou retorna erro
        if( is_null($this->currentUser) ){
            return ['error' => ['like' => 'Você não tem permissão.']];
        }

    }

    /** Retorna se post está curtido */
    public function isPostLiked(int $post_id, int $currentViewer = null){

        //Se usuário estiver nulo, setar usuario logado como vizualizador
        if(is_null($currentViewer)){
            $currentViewer = $this->currentUser->ID;
        }
        
        //Filtrar inputs e validação de dados
        $likeData = [
            'from_id'       => $currentViewer,
            'post_id'       => $post_id
        ];

        //Insere dados no modelo
        $like = $this->model->getIterator($likeData);    

        //Se há resultados retorna true, senão false
        return ($like->count() > 0)? TRUE : FALSE;
    }

    /** Começar a seguir */
    public function setLike(int $post_id){

        //Se zero, para execução
        if($post_id <= 0){
            return ['error' => ['like' => 'Post inexistente.']];
        }

        //Filtrar inputs e validação de dados
        $likeData = [
            'post_id'   => $post_id,
            'from_id'   => $this->currentUser->ID
        ];

        //Insere dados no modelo
        $exist = $this->model->load($likeData);

        //Se existir, remove seguir
        if($exist) {
            return $this->removeLike($this->model);
        }
        
        //Continua a inserção, insere dados no modelo
        $this->model->fill($likeData);

        //Insere data no banco
        $result = $this->model->save();        

        if($result){            
            //Mensagem de sucesso no cadastro
            return ['success' => ['like' => 'Você curtiu este post!']];
        }
        else{
            //Mensagem de erro no cadastro
            return ['error' => ['like' => 'Houve erro! Tente novamente mais tarde.']];
        }
    }

    /** Deixar de seguir */
    private function removeLike($model){

        //Salva os dados no banco
        $result = $model->delete();

        //SE resultado for true, continua execução
        if ($result) {
            //Mensagem de sucesso no cadastro
            return ['success' => ['like' => 'Você descurtiu este post']];
        } else {
            //Mensagem de erro no cadastro
            return ['error' => ['follow' => 'Houve erro! Tente novamente mais tarde.']];
        }
    }

}