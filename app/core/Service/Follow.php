<?php

namespace Core\Service;

use Core\Profile\User;
use Core\Service\Notify;
use Core\Database\FollowersModel;
use Core\Utils\DataConverter;
use Illuminate\Http\Request;

class Follow {

    protected $model;
    protected $currentUser;

    public function __construct($user){
        
        //to_id = usuário logado, from_id = usuário requisitado
        $this->model = new FollowersModel();  
        $this->currentUser = $user;

        //Retorna classe usuário ou retorna erro
        if( is_null($this->currentUser) ){
            return ['error' => ['follow' => 'Você não tem permissão.']];
        }

    }

    /** Retorna se usuário está sendo seguido */
    public function isUserFollowed(int $user_id){
        
        //Filtrar inputs e validação de dados
        $followData = [
            'to_id'       => $this->currentUser->ID,
            'from_id'     => $user_id
        ];

        //Insere dados no modelo
        $following = $this->model->getIterator($followData);    

        //Se há resultados retorna true, senão false
        return ($following->count() > 0)? TRUE : FALSE;
    }

    /** Retornar todos os seguidores */
    public function getFollowers($only_ids = false){

        //Filtrar inputs e validação de dados
        $followData = [
            'from_id'     => $this->currentUser->ID,
            'has_block' => 0
        ];

        //Insere dados no modelo
        $followers = $this->model->getIterator($followData);
        $listUsers = [];

        //Iterar sobre os seguidores
        foreach ($followers as $item) {
            
            if (!$followers->valid()) {
                continue;
            }

            //Se seguidor for mesmo do usuário logado
            if($item->to_id == $this->currentUser->ID){
                continue;
            }
            
            //Instanciando classe de usuário
            $user = new User();
            
            //Atribui dados de usuário ao array
            $listUsers[] = ($only_ids)? $item->to_id : $user->getMinProfile($item->to_id);
        }       

        return $listUsers;

    }

    /** Retornar quem sigo */
    public function getFollowing($only_ids = false){

        //Filtrar inputs e validação de dados
        $followData = [
            'to_id'   => $this->currentUser->ID,
            'has_block' => 0
        ];

        //Insere dados no modelo
        $followers = $this->model->getIterator($followData);
        $listUsers = [];

        //Iterar sobre os seguidores
        foreach ($followers as $item) {
            
            if (!$followers->valid()) {
                continue;
            }

            //Se seguidor for mesmo do usuário logado
            if($item->from_id == $this->currentUser->ID){
                continue;
            }
            
            //Instanciando classe de usuário
            $user = new User();
            
            //Atribui dados de usuário ao array
            $listUsers[] = ($only_ids)? $item->from_id : $user->getMinProfile($item->from_id);
        }       

        return $listUsers;

    }

    /** Começar a seguir */
    public function addFollow(int $user_id){

        //Se zero, para execução
        if($user_id <= 0){
            return ['error' => ['follow' => 'Usuário inexistente.']];
        }

        //Filtrar inputs e validação de dados
        $followData = [
            'from_id'   => $user_id,
            'to_id'     => $this->currentUser->ID
        ];

        //Insere dados no modelo
        $exist = $this->model->load($followData);

        //Se existir, remove seguir
        if($exist) {
            return $this->removeFollow($this->model);
        }
        
        //Continua a inserção, insere dados no modelo
        $this->model->fill($followData);

        //Insere data no banco
        if ( $this->model->isFresh() ) {
            $result = $this->model->save();
        }
        else{
            $result = $this->model->delete();
        }        

        if($result){
            //Registra notificação para seguido
            $notify = new Notify($this->currentUser);
            $notify->add(4, $user_id, $this->currentUser->ID);
            
            //Mensagem de sucesso no cadastro
            return ['success' => ['follow' => 'Está começando a seguir!']];
        }
        else{
            //Mensagem de erro no cadastro
            return ['error' => ['follow' => 'Houve erro! Tente novamente mais tarde.']];
        }
    }

    /** Deixar de seguir */
    private function removeFollow($model){

        //Salva os dados no banco
        $result = $model->delete();

        //SE resultado for true, continua execução
        if ($result) {
            //Mensagem de sucesso no cadastro
            return ['success' => ['follow' => 'Deixou de seguir!']];
        } else {
            //Mensagem de erro no cadastro
            return ['error' => ['follow' => 'Houve erro! Tente novamente mais tarde.']];
        }
    }

    /** Bloquear um seguidor */
    public function blockFollow(int $user_id) {
        
        //Se zero, para execução
        if($user_id <= 0){
            return ['error' => ['follow' => 'Usuário inexistente.']];
        }

        //Filtrar inputs e validação de dados
        $followData = [
            'to_id'       => $this->currentUser->ID,
            'from_id'     => $user_id
        ];

        //Insere dados no modelo
        $exist = $this->model->load($followData);

        //Insere data no banco
        if ( !$exist ) {
            $this->model->has_block = 1;
            $result = $this->model->save();
        }
        else{
            $this->model->has_block = 1;
            $result = $this->model->update(['has_block']);
        }        

        if($result){
            //Registra notificação para bloqueado
            $notify = new Notify($this->currentUser);
            $notify->add(5, $user_id, $this->currentUser->ID);

            //Mensagem de sucesso no cadastro
            return ['success' => ['follow' => 'Usuário bloqueado!']];
        }
        else{
            //Mensagem de erro no cadastro
            return ['error' => ['follow' => 'Houve erro! Tente novamente mais tarde.']];
        }

    }

    public function unblockFollow() {

    }

}