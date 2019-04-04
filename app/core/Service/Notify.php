<?php

namespace Core\Service;

use Core\Profile\User;
use Core\Profile\UserClub;
use Core\Database\NotifyModel;

class Notify {

    protected $model;
    protected $currentUser;
    protected $types;

    public function __construct($user){
        
        //Instanciando classe de modelo
        $this->model = new NotifyModel();
        $this->currentUser = $user;

        //Tipos de notificações
        $this->types = [0 => 'admin', 1 => 'friends', 3 => 'approve', 4 => 'follow', 5 => 'block', 6 => 'comment', 7 => 'message'];

        //Retorna classe usuário ou retorna erro
        if( is_null($this->currentUser) ){
            return ['error' => ['notify' => 'Você não tem permissão.']];
        }
    
    }

    /* Retorna lista de notify */
    function get(){

        //Retorna interador de todas as notificações 
        $allnotifys = $this->model->getIterator([
            'user_id'   => $this->currentUser->ID,
            'ORDER'     => ['date' => 'DESC']
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
                $notifys[] = $this->defineTypeContent($notifyData);
                
            }

            //Retorna array de notifys
            return $notifys;
        } 
        else{
            //Retorna erro
            return ['error' => ['notify', 'Nenhum item a exibir.']];
        }   
        
    } 
    
    /* Retorna lista de notify e marcar todas como lidas */
    function update(){

        //Retorna interador de todas as notificações 
        $allnotifys = $this->model->getIterator([
            'user_id'   => $this->currentUser->ID,
            'read'      => 0,
        ]);
        
        //Retorna resposta
        if( $allnotifys->count() > 0){

            foreach ($allnotifys as $item) {

                //Verifica se é valido
                if ( !$allnotifys->valid() ) {
                    continue;
                }

                //Marcar como lida
                $item->read = 1;

                //Salvar informação no banco
                $item->update(['read']);
                
            }

            //Resposta de mensagens lidas
            return ['success' => ['notify' => 'Notificações Lidas!']];;
        }    
        
    } 

    /* Adiciona um item de notify */
    public function add($type, $toID, $fromID ) {

        //Executa função registro
        return $this->register($type, $toID, $fromID);
    }

    /* Deletar um notificação */
    function delete( $notifyID ){

        //Executa função de desregistrar
        return $this->deregister($notifyID);        
    }

    /** Registra uma notificação para usuário */
    private function register(int $type = 0, int $toID, int $fromID) {

        //Filtrar inputs e validação de dados
        $notify = [
            'type'      => (array_key_exists($type, $this->types)) ? $type : 0,
            'user_id'   => $toID,
            'from_id'   => $fromID
        ];   
        
        //Inicializa modelo
        $model = new NotifyModel();

        //Preenche colunas com valores
        $model->fill($notify); 

        //Salva novo registro no banco
        $result = $model->save();

        //SE resultado for true, continua execução
        return $result;
    }

    /** Desregistra(oculta) uma notificação  */
    private function deregister($notifyID){

        //Preenche colunas com valores
        if(!$this->model->load(['ID' => $notifyID, 'user_id' => $this->currentUser->ID])){
            return ['error' => ['notify' => 'O registro da notificação não existe.']];
        }; 

        //Salva os dados no banco
        $result = $this->model->delete();

        //SE resultado for true, continua execução
        if($result){
            //Mensagem de sucesso no cadastro
            return ['success' => ['notify' => 'Atualização Deletada!']];
        }
        else{
            //Mensagem de erro no cadastro
            return ['error' => ['notify' => 'Houve erro ao marcar notificação como lida! Tente novamente mais tarde.']];
        }
    }

    /** Lista de quantidade de notificações não lidas */
    public function getTotal(){

        //Retorna interador de todas as notificações 
        $allnotifys = $this->model->getIterator([
            'user_id'   => $this->currentUser->ID,
            'read'      => 0
        ]);
        
        //Retorna totol de notificações
        return $allnotifys->count();
    }

    /** Função de aprovar notificação */
    public function approveNotify(int $id, bool $confirm){

        //Verificar se existe notificação 
        $exist = $this->model->load(['ID' => $id]);

        //Para execução
        if(!$exist){
            return ['erro' => ['approve' => 'Notificação não existe.']];
        }

        //Verifica se existe e já marca como lida
        $deregisterResponse = $this->deregister($id);

        //Se houve erro retorna
        if (!array_key_exists('success', $deregisterResponse)) {
            return $deregisterResponse;
        }

        //Retorna dados da notificação
        $notify = $this->model->getData();

        //Retorna informação de usuário
        $response = User::updateClubCertify($notify['from_id'], $notify['user_id'], $confirm);

        if($confirm){
            //Envia notificação de aprovação
            $this->register(8, $notify['user_id'], $id);
        } else {
            //Envia notificação de reprovação
            $this->register(9, $notify['user_id'], $id);
        } 

        //Se resultado for true, continua execução
        if($response){
            //Mensagem de sucesso no cadastro
            return ['success' => ['approve_notify' => 'Confirmação Enviada!']];
        } else {
            //Mensagem de erro no cadastro
            return ['error' => ['approve_notify' => 'Houve erro ao marcar notificação como lida! Tente novamente mais tarde.']];
        }

    }

    //Faz checkagem para imprimir a formatação de conteúdo de acordo com tipo de notificação
    private function defineTypeContent(array $notify) {

        //Se tipo não permitido retornar false
        if (!array_key_exists($type = $notify['type'], $this->types)) {
            return false;
        }

        switch ($type) {
            case 3:
                $response = $this->approveContent($notify);
                break;  
            case 4:
                $response = $this->followContent($notify);
                break; 
            case 6:
                $response = $this->commentContent($notify);
                break; 
            case 7:
                $response = $this->messageContent($notify);
                break; 
            case 8:
                $response = $this->approvedClub($notify);
                break; 
            case 9:
                $response = $this->repprovedClub($notify);
                break; 
            default:
                $response = '';
                break;
        }

        return $response;
    }

    //Formatação de notificação para aprovação de perfil
    private function followContent(array $notify){

        //Retorna dados do usuário
        $user = (new User)->getMinProfile($notify['from_id']);

        //Pegar estilo da notificação
        $content = [
            "ID"            => $notify['ID'],
            "type"          => $notify["type"],
            "message"       => "Começou a te seguir.",
            "date"          => $notify["date"],
            "user_profile"  => $user
        ];
        
        //Retorna notificação
        return $content;

    }

    //Formatação de notificação para aprovação de perfil
    private function approveContent(array $notify){

        //Retorna dados do usuário
        $user = (new User)->getMinProfile($notify['from_id']);

        //Pegar estilo da notificação
        $content = [
            "ID"            => $notify["ID"],
            "type"          => $notify["type"],
            "message"       => "Adicionou como um clube no qual afirmando que já fez parte da equipe. Você pode confirmar ou recusar essa informação, visualize o perfil do usuário e defina abaixo se a informação é verdadeira.",
            "date"          => $notify["date"],
            "user_profile"  => $user
        ];
        
        //Retorna notificação
        return $content;

    }

    //Formatação de notificação para aprovação de perfil
    private function commentContent(array $notify){

        //Retorna dados do usuário
        $user = (new User)->getMinProfile($notify['from_id']);

        //Pegar estilo da notificação
        $content = [
            "ID"            => $notify['ID'],
            "type"          => $notify["type"],
            "message"       => "Comentou em sua publicação.",
            "date"          => $notify["date"],
            "user_profile"  => $user
        ];
        
        //Retorna notificação
        return $content;

    }

    //Formatação de notificação para aprovação de perfil
    private function messageContent(array $notify){

        //Retorna dados do usuário
        $user = (new User)->getMinProfile($notify['from_id']);

        //Pegar estilo da notificação
        $content = [
            "ID"            => $notify['ID'],
            "type"          => $notify["type"],
            "message"       => "Enviou uma mensagem para você.",
            "date"          => $notify["date"],
            "user_profile"  => $user
        ];
        
        //Retorna notificação
        return $content;

    }

    //Formatação de notificação para aprovação de perfil
    private function approvedClub(array $notify){

        //Retorna dados do usuário
        $user = (new User)->getMinProfile($notify['from_id']);

        //Pegar estilo da notificação
        $content = [
            "ID"            => $notify["ID"],
            "type"          => $notify["type"],
            "message"       => "A informação preenchida em seu perfil foi verificada pelo clube!",
            "date"          => $notify["date"],
            "user_profile"  => $user
        ];
        
        //Retorna notificação
        return $content;

    }

    //Formatação de notificação para aprovação de perfil
    private function repprovedClub(array $notify){

        //Retorna dados do usuário
        $user = (new User)->getMinProfile($notify['from_id']);

        //Pegar estilo da notificação
        $content = [
            "ID"            => $notify["ID"],
            "type"          => $notify["type"],
            "message"       => "A informação preenchida em seu perfil foi reprovada pelo clube.",
            "date"          => $notify["date"],
            "user_profile"  => $user
        ];
        
        //Retorna notificação
        return $content;

    }

}