<?php

namespace Core\Service;

use Core\Profile\User;
use Core\Profile\Login;
use Core\Database\NotifyModel;
use Core\Utils\DataConverter;

class Notify {

    protected $model;
    protected $currentUser;

    public function __construct(Request $request){
        
        $this->model = new NotifyModel();
        $this->currentUser = $request->user();
    }

    /* Retorna notify por ID */
    function get($id) {
        
        //Query enviando Id de notify
        $result = $this->model->load(['ID' => $id]);

        if (!$result) {
            return ['error' => ['notify' => 'Item não existe.']];
        }

        //Atribui dados do modelo a variavel como array
        $notifyData = $this->model->getData();

        //Retorna array data
        return $notifyData;

    }

    /* Retorna lista de notify */
    function getAll(){

        //Retorna classe usuário ou retorna erro
        if( is_null($this->currentUser) ){
            return ['error' => ['notify' => 'Você não tem permissão.']];
        }

        //Retorna interador de todas as notificações 
        $allnotifys = $this->model->getIterator([
            'user_id'   =>  $this->currentUser->ID,
            'read'      =>  0
        ]);
        
        //Retorna resposta
        if( $allnotifys->count() > 0){

            //Array para retornar dados
            $notifys = [];
            
            foreach ($allnotifys as $item) {

                //Verifica se é valido
                if ( !$allnotifys->valid() ) {
                    continue;
                }

                //Atribui dados do comentário
                $notifyData = $item->getData();

                //Combina array notify e comentários
                $notifys[] =$notifyData; 
                
            }

            //Retorna array de notifys
            return $notifys;
        } 
        else{
            //Retorna erro
            return ['error' => ['notify', 'Nenhum item a exibir.']];
        }   
        
    }  

    /* Adiciona um item de notify */
    public static function add( $data, $type, $fromID ){
        return (new self)->register($data);
    }

    /* Deletar um plano */
    function delete( $ID ){
        return $this->deregister($ID);        
    }

    private function register($content, int $type = 0, int $toID, int $fromID = 0){

        //Tipos de notificações
        $types = [0 => 'admin', 1 => 'friends', 3 => 'approve', 4 => ''];

        //Filtrar inputs e validação de dados
        $filtered = [];
        $filtered['content']   = filter_var($content['content'], FILTER_SANITIZE_STRING);
        $filtered['type']      = $types[$type];
        $filtered['user_id']   = $toID;
        $filtered['read']      = 0;
        $filtered['from_id']   = $fromID;

        //Preenche colunas com valores
        $this->model->fill($filtered); 

        //Salva novo registro no banco
        $result = $this->model->save();

        //SE resultado for true, continua execução
        if($result){
            //Mensagem de sucesso no cadastro
            return ['success' => ['notify' => 'Notificação enviada!']];
        }
        else{
            //Mensagem de erro no cadastro
            return ['error' => ['notify' => 'Houve erro na notificação! Tente novamente mais tarde.']];
        }
    }

    private function deregister($notifyID){

        //Retorna classe usuário ou retorna erro
        if( is_null($this->currentUser) ){
            return ['error' => ['notify' => 'Você não acesso a essa notificação.']];
        }

        //Preenche colunas com valores
        if(!$this->model->load(['ID' => $notifyID, 'user_id' => $this->currentUser->ID])){
            return ['error' => ['notify' => 'O registro da notificação não existe.']];
        }; 

        //Salva os dados no banco
        $result = $this->model->delete();

        //SE resultado for true, continua execução
        if($result){

            //Mensagem de sucesso no cadastro
            return ['success' => ['notify' => 'Atualização lida!']];

        }
        else{
            //Mensagem de erro no cadastro
            return ['error' => ['notify' => 'Houve erro ao marcar notificação como lida! Tente novamente mais tarde.']];
        }
    }


    /** Função de adicionar comentário a notify */
    public function approveNotify(int $id, int $from_id, bool $confirm){

        //Verifica se existe e já marca como lida
        $exist = (new self)->deregister($id);

        //Se houve erro retorna
        if (!array_key_exists('success', $exist)) {
            return $exist;
        }

        //Retorna informação
        $user = new User();

        $user = $user->get($id);

        return $User->add($filtered);

    }

}