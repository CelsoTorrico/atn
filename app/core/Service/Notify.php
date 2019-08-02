<?php

namespace Core\Service;

use Core\Service\PushNotify;
use Core\Profile\User;
use Core\Database\NotifyModel;
use Core\Profile\UserSettings;

class Notify {

    protected   $model;
    protected   $currentUser;
    protected   $types;
    private     $push;

    public function __construct(User $user){
        
        //Instanciando classe de modelo
        $this->model    = new NotifyModel();
        $this->push     = new PushNotify();
        $this->currentUser = $user;

        //Tipos de notificações
        $this->types = [
            0 => 'admin', 
            1 => 'friends', 
            3 => 'approve', 
            4 => 'follow', 
            5 => 'block', 
            6 => 'comment', 
            7 => 'message', 
            10 => 'add_team', 
            11 => 'remove_team', 
            12 => 'see_profile'];

        //Retorna classe usuário ou retorna erro
        if ( is_null($this->currentUser) ) {
            return ['error' => ['notify' => 'Você não tem permissão.']];
        }
    
    }

    /** 
     * Retorna lista de notify 
     * */ 
    function get(){

        //Retorna interador de todas as notificações 
        $allnotifys = $this->model->getIterator([
            'user_id'   => $this->currentUser->ID,
            'deleted'   => 0,
            'ORDER'     => ['date' => 'DESC'],
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
    
    /** 
     * Marcar todas como lidas
     * 
     * */ 
    function update(){

        //Retorna interador de todas as notificações 
        $allnotifys = $this->model->getIterator([
            'user_id'   => $this->currentUser->ID,
            'read'      => 1,
            'deleted'   => 0
        ]);

        $saved = false; //Não salvo
        
        //Retorna resposta
        if( $allnotifys->count() > 0) {

            foreach ($allnotifys as $item) {

                //Verifica se é valido
                if ( !$allnotifys->valid() ) {
                    continue;
                }

                //Marcar como lida
                $item->read = 0;

                //Salvar informação no banco
                $saved = $item->update(['read']);
                
            }

        }
        
        //Resposta de mensagens lidas
        return ($saved)? ['success' => ['notify' => 'Notificações Lidas!']] : null;
        
    } 

    /**
     *  Adiciona um item de notify 
     * */
    public function add($type, $toID, $fromID ) {

        //Executa função registro
        return $this->register($type, $toID, $fromID);
    }

    /**
     *  Deletar um notificação 
     * */
    function delete( $notifyID ){

        //Executa função de desregistrar
        return $this->deregister($notifyID);        
    }

    /**
     *  Registra uma notificação para usuário 
     * */
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

        //Registra notificação push
        if ($result) {
            $notifyContent = $model->getData();
            $this->registerExtraNotification($notifyContent);
        }        

        //SE resultado for true, continua execução
        return $result;
    }

    /** 
     * Desregistra(oculta) uma notificação  
     * */
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

    /** 
     * Lista de quantidade de notificações não lidas 
     * */
    public function getTotal(){

        //Retorna interador de todas as notificações 
        $allnotifys = $this->model->getIterator([
            'user_id'   => $this->currentUser->ID,
            'read'      => 1
        ]);
        
        //Retorna totol de notificações
        return $allnotifys->count();
    }

    /** 
     * Função de aprovar notificação 
     * */
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

    /**
     * Sistema de notificação push
     * 
     * @param   array $notify   Dados de notificação provenientes do banco
     * @since 2.1
    */
    private function registerExtraNotification(array $notify) {

        //Retorna conteúdo de notificação
        $content = $this->defineTypeContent($notify);

        //Se não tiver conteúdo, para execucão
        if(empty($content)) return;
        
        //Retorna dados de config 
        $config = new UserSettings($this->currentUser); 
        
        //Formatando credenciais do banco
        if($credentials = unserialize($config->__get('webpush-credentials'))) {
            
            //Envia notidicação por push
            $this->push->sendNotification($credentials, ['title' => 'AtletasNOW',  'body' => $content['message']]);

        } else {
            
            /** 
             * Notificações por email para os tipos [Mensagens, Follow] e verifica se notificação por email está habilitado
             * */
            if (!in_array($notify['type'], [4, 7]) || $notifyByEmailEnabled = $config->__get('notification-email-enabled') === false) 
                return;          

                //Efetua disparo de email de notificação
                $this->sendNotificationEmail($content, $notify);

        }

    }

    /**
     * Envia email com link de confirmação de cadastro
     */
    private function sendNotificationEmail(array $content, array $email = []):void {

        $emailConfig = array_merge($email, [
            'email'         => $this->currentUser->user_email, 
            'userName'      => $this->currentUser->display_name, 
            'subject'       => 'Notificação - AtletasNow',
            'click_action'  => '#'
        ]);

        //SETUP DE EMAIL
        $phpmailer = new SendEmail();
        $phpmailer->setToEmail([
            'email' => $emailConfig['email'], 'name' => $emailConfig['userName']]);
        $phpmailer->setFromName('AtletasNOW - Sua hora é agora');
        $phpmailer->setSubject($emailConfig['subject']);
        
        //Carrega template prédefinido
        $phpmailer->loadTemplate('notificationEmail', ['email' => $emailConfig['email'], 'message' => $content, '' => $emailConfig['click_action']]);

        //Envio do email
        $result = $phpmailer->send();

    }

    /** 
     * Faz checkagem para imprimir a formatação de conteúdo de acordo com tipo de notificação
     * */
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
            case 10:
                $response = $this->addedTeam($notify);
                break; 
            case 11:
                $response = $this->removedTeam($notify);
                break; 
            case 12:
                $response = $this->seeProfile($notify);
                break; 
            default:
                $response = '';
                break;
        }

        //Atribui status de leitura
        $response = array_merge($response, ['read' => (int) $notify['read']]);

        return $response;
    }

    /**
     *  Formatação de notificação para aprovação de perfil
     */
    private function followContent(array $notify){

        //Retorna dados do usuário
        $user = (new User)->getMinProfile($notify['from_id']);

        //Pegar estilo da notificação
        $content = [
            "ID"            => $notify['ID'],
            "type"          => $notify["type"],
            "message"       => $user['display_name']." começou a te seguir.",
            "date"          => $notify["date"],
            "user_profile"  => $user,
            "url"           => env('APP_FRONT') . '/#/profile/'. $user['ID']
        ];
        
        //Retorna notificação
        return $content;

    }

    /**
     *  Formatação de notificação para aprovação de perfil
     */
    private function approveContent(array $notify){

        //Retorna dados do usuário
        $user = (new User)->getMinProfile($notify['from_id']);

        //Pegar estilo da notificação
        $content = [
            "ID"            => $notify["ID"],
            "type"          => $notify["type"],
            "message"       => $user['display_name'] ." adicionou seu clube no qual afirma que já fez parte da equipe. Você pode confirmar ou recusar essa informação, visualize o perfil do usuário e defina abaixo se a informação é verdadeira.",
            "date"          => $notify["date"],
            "user_profile"  => $user,
            "url"           => env('APP_FRONT').'/#/profile/'.$user['ID']
        ];
        
        //Retorna notificação
        return $content;

    }

    /**
     * Formatação de notificação para aprovação de perfil 
     */
    private function commentContent(array $notify){

        //Retorna dados do usuário
        $user = (new User)->getMinProfile($notify['from_id']);

        //Pegar estilo da notificação
        $content = [
            "ID"            => $notify['ID'],
            "type"          => $notify["type"],
            "message"       => $user['display_name']." comentou em sua publicação.",
            "date"          => $notify["date"],
            "user_profile"  => $user,
            "url"           => env('APP_FRONT').'/#/dashboard/'.$user['ID']
        ];
        
        //Retorna notificação
        return $content;

    }

    /**
     * Formatação de notificação para aprovação de perfil 
     */
    private function messageContent(array $notify){

        //Retorna dados do usuário
        $user = (new User)->getMinProfile($notify['from_id']);

        //Pegar estilo da notificação
        $content = [
            "ID"            => $notify['ID'],
            "type"          => $notify["type"],
            "message"       => $user['display_name']." enviou uma mensagem para você.",
            "date"          => $notify["date"],
            "user_profile"  => $user,
            "url"           => env('APP_FRONT') . '/#/chat/'. $user['ID']
        ];
        
        //Retorna notificação
        return $content;

    }

    /**
     *  Formatação de notificação para aprovação de perfil
     */
    private function approvedClub(array $notify){

        //Retorna dados do usuário
        $user = (new User)->getMinProfile($notify['from_id']);

        //Pegar estilo da notificação
        $content = [
            "ID"            => $notify["ID"],
            "type"          => $notify["type"],
            "message"       => "A informação preenchida em seu perfil foi verificada pelo clube ". $user['display_name'],
            "date"          => $notify["date"],
            "user_profile"  => $user,
            "url"           => env('APP_FRONT') . '/#/profile'
        ];
        
        //Retorna notificação
        return $content;

    }

    /**
     * Formatação de notificação para aprovação de perfil 
     */
    private function repprovedClub(array $notify){

        //Retorna dados do usuário
        $user = (new User)->getMinProfile($notify['from_id']);

        //Pegar estilo da notificação
        $content = [
            "ID"            => $notify["ID"],
            "type"          => $notify["type"],
            "message"       => "A informação preenchida em seu perfil foi reprovada pelo clube ". $user['display_name'],
            "date"          => $notify["date"],
            "user_profile"  => $user,
            "url"           => env('APP_FRONT') . '/#/profile'
        ];
        
        //Retorna notificação
        return $content;

    }

    /**
     *  Formatação de notificação para integrantes adicionados a instituição
     */
    private function addedTeam(array $notify){

        //Retorna dados do usuário
        $user = (new User)->getMinProfile($notify['from_id']);

        //Pegar estilo da notificação
        $content = [
            "ID"            => $notify["ID"],
            "type"          => $notify["type"],
            "message"       => "Você foi adicionado como integrante da equipe '" . $user['display_name'] . "' e seu perfil foi atualizado com essa informação!",
            "date"          => $notify["date"],
            "user_profile"  => $user,
            "url"           => env('APP_FRONT') . '/#/profile'
        ];
        
        //Retorna notificação
        return $content;

    }

    /**
     * Formatação de notificação para aprovação de perfil 
     */
    private function removedTeam(array $notify){

        //Retorna dados do usuário
        $user = (new User)->getMinProfile($notify['from_id']);

        //Pegar estilo da notificação
        $content = [
            "ID"            => $notify["ID"],
            "type"          => $notify["type"],
            "message"       => "Infelizmente você foi removido como integrante da equipe '" . 
            $user['display_name'] . "'!",
            "date"          => $notify["date"],
            "user_profile"  => $user,
            "url"           => env('APP_FRONT') . '/#/profile'
        ];
        
        //Retorna notificação
        return $content;

    }

    /**
     * Formatação de notificação de visualização de perfil usuario/usuario 
     */
    private function seeProfile(array $notify){

        //Retorna dados do usuário
        $user = (new User)->getMinProfile($notify['from_id']);

        //Pegar estilo da notificação
        $content = [
            "ID"            => $notify["ID"],
            "type"          => $notify["type"],
            "message"       => $user['display_name'] . " viu seu perfil!",
            "date"          => $notify["date"],
            "user_profile"  => $user,
            "url"           => env('APP_FRONT') . '/#/profile/'. $user['ID']
        ];
        
        //Retorna notificação
        return $content;

    }

}