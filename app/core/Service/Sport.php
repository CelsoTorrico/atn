<?php

namespace Core\Service;

use Core\Database\SportModel;
use Core\Database\ListSportModel;
use Illuminate\Http\Request;

class Sport {

    protected $model;
    protected $currentUser;

    public function __construct(Request $request = null) {        
        
        $this->model = new SportModel();
        
        if(!is_null($request)) {
            $this->currentUser = $request->user();
        }
        
    }

    /* Retorna sport por ID */
    function get($id) {
        
        //Query enviando Id de sport
        $result = $this->model->load(['ID' => $id]);

        if (!$result) {
            return ['error' => ['sport' => 'Item não existe.']];
        }

        //Inicializa classe de comentários passando ID do POST
        $comment = new Comment($this->model->ID);

        //Atribui dados do modelo a variavel como array
        $sportData = $this->model->getData();

        //Combina array sport e comentários
        $sportData = array_merge($sportData, [
            'list_comments' => $comment->getAll(),
            'quantity_comments' => $comment->getQuantity()            
        ]);

        //Retorna array data
        return $sportData;

    }

    /* Retorna lista de sport */
    function getAll(){

        //Instancia modelo de listagem de esportes
        $model = new ListSportModel();

        //Retorna todos os item do banco
        $allsports = $model->dump();
        
        //Se nenhum item, retorna array vazio
        if (count($allsports) <= 0){
            return [];
        }

        //Array de esportes
        $allSportsArray = [];

        //Adicionando valores em forma de array sem indice
        foreach ($allsports as $key => $value) {
            $allSportsArray[] = [$value['ID'], $value['sport_name']];
        }
       
        //Retorna
        return $allSportsArray;
        
    }  

    /** Carrega lista de estatíticas de esportes - modelo de campos */
    function getStats() {

        //Carrega array de atributos dos esportes
        $sportList = require(__DIR__ . '/stats/StatsModel.php');

        //Retorna
        return $sportList;
    }

    /** 
     *  Retorna nomeclatura do esporte pelo ID
     * 
     * @param int $id   Id do esporte a ser retornado
     * @since 2.1
     */
    function _getSport($sport) {
        
        //Se parametro for numero inteiro
        if(is_int($sport)) {
            return $this->getSportById((int) $sport);
        }
        
        //Se parametro for em formato de string
        if(is_string($sport)) {
            return $this->getSportByName((string) $sport);
        }

        return ['error' => ['sport' => 'Não foi possível localizar esporte pelos parametros informados.']];
    }

    /* Adiciona um item de sport */
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

    /**
     * Retorna nome do esporte 
     * @param int $id   ID do esporte a ser retornado
     * @since 2.1
     */
    private function getSportById(int $id):string{

        //Query enviando Id de sport
        $result = $this->model->load(['ID' => $id]);

        //Verifica se houve resultado
        if (!$result) {
            return ['error' => ['sport' => 'Item não existe.']];
        }

        //Retorna nomeclatura
        return $this->model->sport_name;
    }

    /**
     * Retorna nome do esporte 
     * 
     * @param string $sportName   Nome do esporte a ser usando para retornar item
     * @since 2.1
     */
    private function getSportByName(string $sportName):array{

        //Query enviando Id de sport
        $result = $this->model->load(['sport_name' => $sportName]);

        //Verifica se houve resultado
        if (!$result) {
            return ['error' => ['sport' => 'Item não existe.']];
        }

        //Retorna nomeclatura
        return [];
    }

    private function register($data, $postID = null){

        //Retorna classe usuário ou retorna erro
        if( is_null($this->currentUser) ){
            return ['error' => ['sport' => 'Você não tem permissão.']];
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
            return ['error' => ['sport' => 'Você não tem permissão.']];
        }

        //Preenche colunas com valores
        if(!$this->model->load(['ID' => $ID, 'post_author' => $this->currentUser->ID])){
            return ['error' => ['sport' => 'O registro da atualização não existe.']];
        }; 

        //Salva os dados no banco
        $result = $this->model->delete();

        //SE resultado for true, continua execução
        if($result){

            //Mensagem de sucesso no cadastro
            return ['success' => ['sport' => 'Atualização deletada!']];

        }
        else{
            //Mensagem de erro no cadastro
            return ['error' => ['register' => 'Houve erro ao deletar atualização! Tente novamente mais tarde.']];
        }
    }


    /** Função de adicionar comentário a sport */
    function addComment(int $id, $data = ''){

        //Retorna classe usuário ou retorna erro
        if( is_null($this->currentUser) ){
            return ['error' => ['comment' => 'Você não tem permissão para comentar.']];
        }

        //Filtrar inputs e validação de dados
        $filtered = [
            'comment_post_ID'    => $id,
            'comment_content'    => filter_var($data, FILTER_SANITIZE_STRING),
            'comment_author'     => $this->currentUser->display_name,
            'user_id'            => $this->currentUser->ID
        ];  
        
        if( !$this->model->load(['ID' => $id])){
            return ['error' => ['comment' => 'sport inexistente. Impossível cadastrar um comentário']];        
        }

        //Inicializa classe de comentário
        $comment = new Comment();

        //Retorna informação
        return $comment->add($filtered);

    }

    /** Função de adicionar comentário a sport */
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

}