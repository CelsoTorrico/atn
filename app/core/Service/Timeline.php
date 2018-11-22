<?php

namespace Core\Service;

use Core\Profile\User;
use Core\Profile\Login;
use Core\Database\PostModel;
use Symfony\Component\HttpFoundation\Cookie;

class Timeline {

    protected $model;
    protected $currentUser;
    const type = 'timeline';

    public function __construct(){
        
        $this->model = new PostModel();
        $this->currentUser = User::get_current_user();
    }

    /* Retorna timeline por ID */
    function get($id){
        
        //Query enviando Id de Timeline
        $result = $this->model->load(['ID' => $id]);

        if(!$result){
            return ['error' => ['timeline' => 'Item não existe.']];
        }

        return $this->model->getData();

    }

    /* Retorna lista de timeline */
    function getAll($id = null){

        //Retorna lista de ids
        if(!is_null($id)){
            $this->currentUser = User::get_current_user($id);
        }        

        //Retorna classe usuário ou retorna erro
        if( is_null($this->currentUser) ){
            return ['error' => ['timeline' => 'Você não tem permissão.']];
        }
        
        //Retorna objeto Friends()
        $friends = $this->currentUser->getFriends();
        
        //Retorna lista de usuários
        $followers = $friends->get();
        
        //Retorna feed de Author
        $IDS = $friends->onlyKey($followers, 'to_id');

        //TODO: Retorna todos posts de feed baseado nas conexões
        $response = $this->model->load([
            'post_author'   =>  $IDS,
            'post_type'     =>  self::type
        ]);
        
        //Retorna resposta
        if( $response ){
            return $this->model->getData();
        } 
        else{
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

        //Retorna classe usuário ou retorna erro
        if( is_null($this->currentUser) ){
            return ['error' => ['timeline' => 'Você não tem permissão.']];
        }

        //Filtrar inputs e validação de dados
        $filtered = [];
        $filtered['post_content']   = filter_var($data, FILTER_SANITIZE_STRING);
        $filtered['post_author']    = $this->currentUser->ID;
        $filtered['post_type']      = self::type;

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
        if($result){

            //Mensagem de sucesso no cadastro
            return ['success' => ['register' => 'Atualização realizada com sucesso!']];

        }
        else{
            //Mensagem de erro no cadastro
            return ['error' => ['register' => 'Houve erro na atualização! Tente novamente mais tarde.']];
        }
    }

    private function deregister($ID){

        //Retorna classe usuário ou retorna erro
        if( is_null($this->currentUser) ){
            return ['error' => ['timeline' => 'Você não tem permissão.']];
        }

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

    /* Retorna lista de comentários por ID */
    function getAllComments($id){
        
        $comment = new Comment();
    }  


    /* Função de conversão de data */
    private function date_conditional($date_array, $date){

        //qtd de horários
        //'h' = 1 horas, 'd' = 24horas, 'm' = 720horas
        $qtdConvert = array('h' => 3600, 'd' => 86400, 'm' => 2592000 );
        $deadline = strtotime($date->format('Y-m-d')); //Converte data final timestamp

        if($date_array['conditional'] == 1){ //Após
            $dateDefined = ($date_array['qtd'] * $qtdConvert[$date_array['types']['identificador']]);
            return date_create(date('Y-m-d', $deadline + $dateDefined)); //calculo data atual mais horas definidas
        }
        else{ //Antes
            $dateDefined = ($date_array['qtd'] * $qtdConvert[$date_array['types']['identificador']]);
            return date_create(date('Y-m-d', $deadline - $dateDefined)); //calculo data atual mais horas definidas
        }
    }

    private function countStatus($planArray){

        //Definindo valores padrões
        $status['warning'] = ['badge' => _WARNING_, 'value' => 0];
        $status['danger']  = ['badge' => _DANGER_, 'value' => 0];
        $status['default'] = ['badge' => _PROGRESS_, 'value' => 0];

        //Contagem de itens
        foreach ($planArray as $key => $value) {
            switch ($value['rules']['msg']) {
                case _WARNING_:
                    $status['warning']['value'] = $status['warning']['value'] + 1;
                    break;
                case _DANGER_:
                    $status['danger']['value'] = $status['danger']['value'] + 1;
                    break;
                case _PROGRESS_:
                    $status['default']['value'] = $status['default']['value'] + 1;
                    break;
                default:
                    continue;
                    break;
            }
            
        }  

        return $status;
    }

}