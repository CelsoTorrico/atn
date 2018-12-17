<?php

namespace Core\Service;

use Core\Profile\User;
use Core\Profile\Login;
use Core\Database\NotifyModel;
use Core\Utils\DataConverter;

class Notify {

    protected $model;
    protected $currentUser;
    protected $types;

    public function __construct(){
        
        //Instanciando classe de modelo
        $this->model = new NotifyModel();

        //Tipos de notificações
        $this->types = [0 => 'admin', 1 => 'friends', 3 => 'approve'];
    
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
    public static function add($type, $toID, $fromID ){
        return (new self)->register($type, $toID, $fromID);
    }

    /* Deletar um plano */
    function delete( $ID ){
        return $this->deregister($ID);        
    }

    private function register(int $type = 0, int $toID, int $fromID) {

        //Filtrar inputs e validação de dados
        $notify = [
            'type'      => (array_key_exists($type, $this->types)) ? $type : 0,
            'user_id'   => $toID,
            'from_id'   => $fromID
        ];        

        //Preenche colunas com valores
        $this->model->fill($notify); 

        //Salva novo registro no banco
        $result = $this->model->save();

        //SE resultado for true, continua execução
        return $result;
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


    /** Função de aprovar notificação */
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

    //Faz checkagem para imprimir a formatação de conteúdo de acordo com tipo de notificação
    private function defineTypeContent(int $type, int $fromID) {

        //Se tipo não permitido retornar false
        if (!array_key_exists($type, $this->types)) {
            return false;
        }

        switch ($type) {
            case 3:
                $response = $this->approveContent($fromID);
                break;            
            default:
                $response = '';
                break;
        }

        return $response;
    }

    //Formatação de notificação para aprovação de perfil
    private function approveContent($fromID){

        //Retorna dados do usuário
        $user = (new User)->get($$fromID);

        //Pegar estilo da notificação
        $content = [
            "message" => "O usuário " . $user->display_name . " te adicionou como um clube no qual ele já fez parte da equipe. Você pode confirmar ou recusar essa informação, visulize as informações do perfil e defina se a informação é verdadeira.",
            "user_profile" => $user
        ];
        
        //Retorna notificação
        return $content;

    }

}