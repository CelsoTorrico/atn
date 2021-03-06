<?php

namespace Core\Service;

use Core\Service\PushNotify;
use Core\Profile\User;
use Core\Database\NotifyModel;
use Core\Database\UserModel;
use Core\Profile\UserSettings;
use Core\Utils\SendEmail;

class Notify {

    protected   $model;
    protected   $currentUser;
    protected   $types; 
    private     $push;

    public function __construct(User $user){
        
        //Instanciando classe de modelo
        $this->model        = new NotifyModel();
        $this->push         = new PushNotify();
        $this->currentUser  = $user;

        //Tipos de notificações
        $this->types = [
            0 => 'admin', 
            1 => 'friends', 
            3 => 'approve', 
            4 => 'follow', 
            5 => 'block', 
            6 => 'comment', 
            7 => 'message', 
            8 => 'clubApproved',
            9 => 'clubReproved',
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
    function get() {

        //Retorna interador de todas as notificações 
        $allnotifys = $this->model->getIterator([
            'user_id'   => $this->currentUser->ID,
            'deleted'   => 0,
            'ORDER'     => ['date' => 'DESC'],
        ]);
        
        //Retorna resposta
        if( $allnotifys->count() > 0){

            //Array para retornar dados
            $notifys = ['notifyList' => [], 'total' => 0];
            
            foreach ($allnotifys as $item) {

                //Verifica se é valido
                if ( !$allnotifys->valid() ) {
                    continue;
                }

                //Atribui dados do comentário
                $notifyData = $item->getData();

                /**
                 * Verifica se usuário existe antes de formatar conteúdo de notificação
                 * @since 2.1
                 */
                if (!(new User)->isUserExist($notifyData['from_id'])) 
                    continue;                    

                //Combina array notify e comentários
                $notifys['notifyList'][] = $this->defineTypeContent($notifyData);
                
            }

            //Atribui total de notificações não lidas
            $notifys['total'] = $this->getTotal();

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
            'read'      => 1
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
     * @param int $type
     * @param int $toID
     * @param int $fromID
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
            'type'      => (int) (array_key_exists($type, $this->types)) ? $type : 0,
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
            'read'      => 1,
            'deleted'   => 0
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
            //Envia notificação de aprovação ao atleta / profissional
            $this->register(8, $notify['from_id'], $notify['user_id']);
        } else {
            //Envia notificação de reprovação atleta / profissional
            $this->register(9, $notify['from_id'], $notify['user_id']);
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

        $content = [
            'message'   => null,
            'actions'   => null
        ];

        /** Em caso de key 'ID' não vier setada, usar key 'user_id' para assmiliar corretamente. */
        if(!isset($notify['ID']) && key_exists('user_id', $notify)) {
            $notify['ID'] = $notify['user_id'];
        }

        //Retorna conteúdo de notificação
        $content = $this->defineTypeContent($notify);

        //Se não tiver conteúdo, para execucão
        if(empty($content)) return;
        
        //Instancia classe de usuário destinatário da notificação 
        $user  = (new User)->get($notify['user_id']);

        //Verifica se usuário instanciado corretamente
        if(is_a($user, 'Core\Profile\User')){
            //Retorna dados de configurações do usuário
            $userConfig = new UserSettings($user); 
            
            //Atribui credenciais
            $credentials = $userConfig->__get('webpush-credentials');

        } else{
            //Lógica para casos de usuários inativados que necessitam receber notificações, por exemplo usuários adicionados pela instituição
            $usermodel = new UserModel(['ID' => $notify['user_id']]);
            $user = new User();
            $user->user_email = $usermodel->user_email;
            $user->display_name = $usermodel->display_name;
        }
        
        //Formatando credenciais do banco
        if(isset($credentials) && $credentials) {

            //Desserializa credenciais de push
            $credentials = unserialize($credentials);

            //Envia notidicação por push
            $this->push->sendNotification($credentials, [
                'title'     => 'AtletasNOW',  
                'body'      => $content['message'],
                'data'      => $content['actions']
            ]);

        } 
        
        /** 
         * Notificações por email para os tipos [Mensagens, Follow, Add Team e Remove Team]
         * */
        if (in_array($notify['type'], [4, 7, 10, 11])){
            //Efetua disparo de email de notificação
            $this->sendNotificationEmail($user, $content, $notify);
        }

    }

    /**
     * Envia email de notifições para usuário da plataforma
     */
    private function sendNotificationEmail(User $toUser, array $content, array $email = []):void {

        $emailConfig = array_merge($email, [
            'email'         => $toUser->user_email, 
            'userName'      => $toUser->display_name, 
            'subject'       => 'Notificação - AtletasNow',
            'message'       => $content['message'],
            'actions'       => $content['actions']
        ]);

        //SETUP DE EMAIL
        $phpmailer = new SendEmail();
        $phpmailer->setToEmail([
            'email' => $emailConfig['email'], 'name' => $emailConfig['userName']]);
        $phpmailer->setFromName('AtletasNOW - Sua hora é agora');
        $phpmailer->setSubject($emailConfig['subject']);
        
        //Carrega template prédefinido
        $phpmailer->loadTemplate('notificationEmail', [
            'email'     => $emailConfig['email'], 
            'message'   => $emailConfig['message'], 
            'actions'   => $emailConfig['actions']
        ]);

        //Envio do email
        $result = $phpmailer->send();

    }

    /** 
     * Faz checkagem para imprimir a formatação de conteúdo de acordo com tipo de notificação
     * */
    private function defineTypeContent(array $notify) {

        //Se tipo não permitido retornar false
        if (!array_key_exists($type = (int) $notify['type'], $this->types)) {
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
                $response = [];
                break;
        }

        //Atribui status de leitura
        $response = array_merge($response, ['read' => (int) $notify['read']]);

        return $response;
    }

    /**
     *  Formatação de notificação para aprovação de perfil
     */
    private function followContent(array $notify) {

        //Retorna dados do usuário
        $fromUser = (new User)-> getMinProfile($notify['from_id']);

        //Pegar estilo da notificação
        $content = [
            "ID"            => $notify['ID'],
            "type"          => $notify["type"],
            "message"       => $fromUser['display_name']." começou a te seguir.",
            "date"          => $notify["date"],
            "user_profile"  => $fromUser,
            "actions"       => ['action' => env('APP_FRONT').'/#/profile/'.$fromUser['ID'], 'title' => 'Veja agora']
        ];
        
        //Retorna notificação
        return $content;

    }

    /**
     *  Formatação de notificação para aprovação de perfil
     */
    private function approveContent(array $notify) {

        //Retorna dados do usuário
        $fromUser = (new User)->getMinProfile((int) $notify['from_id']);

        //Pegar estilo da notificação
        $content = [
            "ID"            => $notify["ID"],
            "type"          => $notify["type"],
            "message"       => $fromUser['display_name'] ." adicionou seu clube no qual afirma que já fez parte da equipe. Você pode confirmar ou recusar essa informação, visualize o perfil do usuário e defina abaixo se a informação é verdadeira.",
            "date"          => $notify["date"],
            "user_profile"  => $fromUser,
            "actions"       => ['action' => env('APP_FRONT').'/#/profile/'. $fromUser['ID'], 'title' => 'Veja agora']
        ];
        
        //Retorna notificação
        return $content;

    }

    /**
     * Formatação de notificação para comentário em timeline
     */
    private function commentContent(array $notify){

        //Retorna dados do usuário
        $fromUser = (new User)->getMinProfile($notify['from_id']);

        //Pegar estilo da notificação
        $content = [
            "ID"            => $notify['ID'],
            "type"          => $notify["type"],
            "message"       => $fromUser['display_name']." comentou em sua publicação.",
            "date"          => $notify["date"],
            "user_profile"  => $fromUser,
            "actions"       => ['action' => env('APP_FRONT').'/#/dashboard/timeline/'.$fromUser['ID'], 'title' => 'Veja agora']
        ];
        
        //Retorna notificação
        return $content;

    }

    /**
     * Formatação de notificação para aprovação de perfil 
     */
    private function messageContent(array $notify){

        //Retorna dados do usuário
        $fromUser = (new User)->getMinProfile($notify['from_id']);

        //Pegar estilo da notificação
        $content = [
            "ID"            => $notify['ID'],
            "type"          => $notify["type"],
            "message"       => $fromUser['display_name']." enviou uma mensagem para você.",
            "date"          => $notify["date"],
            "user_profile"  => $fromUser,
            "actions"       => ['action' => env('APP_FRONT').'/#/chat/'.$fromUser['ID'], 'title' => 'Veja agora']
        ];
        
        //Retorna notificação
        return $content;

    }

    /**
     *  Formatação de notificação para aprovação de perfil
     */
    private function approvedClub(array $notify) {

        //Retorna dados do usuário
        $fromUser = (new User)->getMinProfile((int) $notify['from_id']);

        //Pegar estilo da notificação
        $content = [
            "ID"            => $notify["ID"],
            "type"          => $notify["type"],
            "message"       => "A informação preenchida em seu perfil foi verificada e aprovada pelo clube ". $fromUser['display_name'],
            "date"          => $notify["date"],
            "user_profile"  => $fromUser,
            "actions"       => ['action' => env('APP_FRONT').'/#/profile/'.$fromUser['ID'], 'title' => 'Veja agora']
        ];
        
        //Retorna notificação
        return $content;

    }

    /**
     * Formatação de notificação para aprovação de perfil 
     */
    private function repprovedClub(array $notify){

        //Retorna dados do usuário
        $fromUser = (new User)->getMinProfile($notify['from_id']);

        //Pegar estilo da notificação
        $content = [
            "ID"            => $notify["ID"],
            "type"          => $notify["type"],
            "message"       => "A informação preenchida em seu perfil foi verificada e reprovada pelo clube ". $fromUser['display_name'],
            "date"          => $notify["date"],
            "user_profile"  => $fromUser,
            "actions"       => ['action' => env('APP_FRONT').'/#/profile/'.$fromUser['ID'], 'title' => 'Veja agora']
        ];
        
        //Retorna notificação
        return $content;

    }

    /**
     *  Formatação de notificação para integrantes adicionados a instituição
     */
    private function addedTeam(array $notify){

        //Retorna dados do usuário
        $fromUser = (new User)->getMinProfile($notify['from_id']);

        //Pegar estilo da notificação
        $content = [
            "ID"            => $notify["ID"],
            "type"          => $notify["type"],
            "message"       => "Você foi adicionado como integrante da equipe '" . $fromUser['display_name'] . "' e seu perfil foi atualizado com essa informação!",
            "date"          => $notify["date"],
            "user_profile"  => $fromUser,
            "actions"       => ['action' => env('APP_FRONT').'/#/profile/'. $fromUser['ID'], 'title' => 'Veja agora']
        ];
        
        //Retorna notificação
        return $content;

    }

    /**
     * Formatação de notificação para aprovação de perfil 
     */
    private function removedTeam(array $notify){

        //Retorna dados do usuário
        $fromUser = (new User)->getMinProfile($notify['from_id']);

        //Pegar estilo da notificação
        $content = [
            "ID"            => $notify["ID"],
            "type"          => $notify["type"],
            "message"       => "Infelizmente você foi removido como integrante da equipe '" . 
            $fromUser['display_name'] . "'!",
            "date"          => $notify["date"],
            "user_profile"  => $fromUser,
            "actions"       => [
                'action' => env('APP_FRONT').'/#/profile/'. $fromUser['ID'], 
                'title' => 'Veja agora'
                ]
        ];
        
        //Retorna notificação
        return $content;

    }

    /**
     * Formatação de notificação de visualização de perfil usuario/usuario 
     */
    private function seeProfile(array $notify){

        //Retorna dados do usuáriof
        $fromUser = (new User)->getMinProfile($notify['from_id']);

        //Pegar estilo da notificação
        $content = [
            "ID"            => $notify["ID"],
            "type"          => $notify["type"],
            "message"       => $fromUser['display_name'] . " viu seu perfil!",
            "date"          => $notify["date"],
            "user_profile"  => $fromUser,
            "actions"       => [
                'action' => env('APP_FRONT').'/#/profile/'. $fromUser['ID'], 
                'title' => 'Veja agora',
                'icon'  => ''
            ]
        ];
        
        //Retorna notificação
        return $content;

    }

}