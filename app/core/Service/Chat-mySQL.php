<?php

namespace Core\Service;

use Core\Profile\User;
use Core\Service\Follow;
use Core\Utils\FileUpload;
use Core\Database\ChatRoomModel;
use Core\Database\ChatMessagesModel;

class ChatBackup{

    protected $currentUser;
    protected $room;
    protected $messages;
    protected $following;

    public function __construct($user){

        //Instancinando classes
        $this->currentUser  = $user;
        $this->room         = new ChatRoomModel();
        $this->messages     = new ChatMessagesModel();    
        
        //Define followers e retorna IDs
        $follow = new Follow($user);
        $this->following = $follow->getFollowing(true);

        //Retorna classe usuário ou retorna erro
        if( is_null($this->currentUser) ){
            return ['error' => ['chat' => 'Você não tem permissão para chat.']];
        }
    }

    /* Abre uma room nova ou existente */
    function getRoom($suser_id) {

        //Se usuários não estão conectados
        if(!$this->isConnected($suser_id)){
            return ['error' => ['chat' => 'Vocês não estão conectados. Impossível enviar mensagem a esse usuário.']];
        }

        //Instancia classe de usuário
        $user = new User();

        //Se ao retornar usuário vir erro de usuário inexistente
        if (array_key_exists('error', $room_user = $user->getMinProfile($suser_id))) {
            return ['error' => ['chat' => 'Usuário inexistente. Impossível enviar mensagem.']];
        }

        //Array de room
        $roomData = [
            'fuser' => $this->currentUser->ID, 
            'suser' => $suser_id
        ];
        
        //Verifica se existe uma room existente
        $room = $this->room->load($roomData);

        //Verifica se room existe
        if ($this->room->isFresh() && !$room) {
            //Preenche modelo
            $this->room->fill($roomData);            
            //Cria uma nova room
            $this->room->save();
        } 

        //Dados da Room
        $result = $this->room->getData();

        //Retorna todas as mensagens baseado no usuário
        $messages = $this->getMessages($result);
        
        //Retorna mensagens
        return $messages;

    }

    /** Retorna todas as mensagens baseado em IDS */
    private function getMessages(array $room, int $paged = 0) {

        if (!$room = $this->isAccessRoom($room['suser'])) {
            //Retorna erro
            return ['error' => ['room', 'Você não pode acessar mensagens nesta conversa.']];
        }

        //Qtd de itens por página
        $perPage = 12;

        //A partir de qual item contar
        $initPageCount = ($paged <= 1)? $paged = 0 : ($paged * $perPage) - $perPage;

        //Paginação de timeline
        $limit = [$initPageCount, $perPage];

        //Retorna mensagens da room ordenando de data menor para mais recente
        //TODO: Fazer paginação de mensagens
        $messages = $this->messages->getIterator([
            'room_id'   => $room['room_id'], 
            'LIMIT'     => $limit,
            'ORDER'     => ['date' => 'DESC']
        ]);

        //Retorna se não existir nenhuma mensagem
        if ($messages->count() <= 0) {
            return ['error' => ['chat' => 'Nenhuma mensagem nesta conversa.']];
        }

        $allmessages = [];
        
        //Mensagens do chat
        foreach ($messages as $item) {

            //Instancia classe de usuário
            $user = new User();

            $allmessages[] = [
                'message_id' => $item->message_id,
                'date'       => $item->date,
                'content'    => ($item->read == 1)? '(Mensagem Apagada)' : $item->content,
                'author'     => $user->getMinProfile($item->author_id),
                'viewer'     => ($item->author_id == $this->currentUser->ID)? true : false
            ];
        }

        //Retorna mensagens
        return $allmessages;

    }  
    
    function getLastMessage(int $suser) {
        
        if (!$room = $this->isAccessRoom($suser)) {
            //Retorna erro
            return ['error' => ['room', 'Você não pode acessar mensagens nesta conversa.']];
        }

        //Retorna todas as mensagens
        $messages = $this->getRoom($room_id);
        
        //Retorna mensagens
        return $messages;

    }

    /** Retorna total de mensagens não lidas */
    function getTotal(){

        //Retorna rooms que usuário contém
        $rooms = $this->room->getIterator([
            'OR' => [
                'fuser' => $this->currentUser->ID,
                'suser' => $this->currentUser->ID 
            ]
        ]);

        $rooms_ids = [];

        //Atribui ids das rooms encontradas
        foreach ($rooms as $item) {
            $rooms_ids[] = $item->room_id;
        }
        
        //Insere dados no modelo
        $messages = $this->messages->getIterator([
            'author_id[!]'  => $this->currentUser->ID,
            'room_id'       => $rooms_ids,
            'read'          => 0
        ]);

        //Retorna totol de favoritos
        return $messages->count();
    }

    /* Retorna lista de timeline */
    function getAllRooms() {     

        //Retorna lista de rooms
        $allRooms = $this->room->getIterator([
            'fuser'  =>  $this->currentUser->ID
        ]);
        
        //Retorna resposta
        if( $allRooms->count() > 0){

            //Array para retornar dados
            $rooms = [];
            
            foreach ($allRooms as $item) {

                //Verifica se é valido
                if ( !$allRooms->valid() ) {
                    continue;
                }

                //Retorna dados da room
                $messages = $this->messages->getIterator(['room_id' => $item->room_id ]);
                
                //Instancia classe de usuário
                $user = new User();

                //Se ao retornar usuário vir erro de usuário inexistente
                if (array_key_exists('error', $room_user = $user->getMinProfile($item->suser))) {
                    continue;
                }

                //Combina array timeline e comentários
                $rooms[] =  [
                    'room_id'           => $item->room_id,
                    'user'              => $user->getMinProfile($item->suser),
                    'quantity_messages' => $messages->count(),
                    'last_update'       => $item->last_update         
                ];
                
            }

            //Retorna array de timelines
            return $rooms;
        } 
        else{
            //Retorna erro
            return ['error' => ['rooms', 'Nenhuma conversa existente.']];
        }   
        
    }  

    /* Adiciona um item de timeline */
    function add( $data ) {
        return $this->register($data);
    }

    /* Deletar um plano */
    function delete( $ID ) {
        return $this->deregister($ID);        
    }

    private function register(array $data) {

        if (!$room = $this->isAccessRoom($data['suser'])) {
            //Retorna erro
            return ['error' => ['room', 'Você não pode enviar mensagens nesta conversa.']];
        }

        //Filtrar inputs e validação de dados
        $content = [
            'room_id'       => filter_var($room['room_id'], FILTER_SANITIZE_NUMBER_INT),
            'content'       => filter_var($data['chat_content'], FILTER_SANITIZE_STRING),
            'author_id'     => $this->currentUser->ID
        ];
        
        //Preenche colunas com valores
        $this->messages->fill($content); 

        //Salva novo registro no banco
        $result = $this->messages->save();

        //SE resultado for true, continua execução
        if ($result) {

            //Pega id da última inserção
            $lastInsert = $this->messages->getPrimaryKey();

            //Verificar quem esta recebendo mensagem
            $toUser = ('fuser' == array_search($this->currentUser->ID, $room))? $room['suser'] : $room['fuser'];

            //Registra notificação para seguidor
            $notify = new Notify($this->currentUser);
            $notify->add(7, $toUser, $this->currentUser->ID);

            //Verifica se existe objeto para upload
            if (isset($data['chat_image']) && is_a($data['chat_image'], 'Symfony\Component\HttpFoundation\File\UploadedFile')) {

                $file = $data['chat_image'];

                //Inicializa classe de upload
                $upload = new FileUpload($this->currentUser->ID, $lastInsert['ID'], $file);

                //Enviar arquivo e insere no banco
                $upload->insertFile();           
            }

            //Mensagem de sucesso no cadastro
            return ['success' => ['chat' => 'Mensagem Enviada!']];

        }
        else{
            //Mensagem de erro no cadastro
            return ['error' => ['chat' => 'Houve erro no envio! Tente novamente mais tarde.']];
        }
    }

    private function deregister($ID){

        //Preenche colunas com valores
        if(!$this->messages->load(['message_id' => $ID, 'author_id' => $this->currentUser->ID])){
            return ['error' => ['chat' => 'O registro da mensagem não existe.']];
        }; 

        //Salva os dados no banco
        $result = $this->messages->delete();

        //SE resultado for true, continua execução
        if($result){

            //Mensagem de sucesso no cadastro
            return ['success' => ['chat' => 'Mensagem deletada!']];

        }
        else{
            //Mensagem de erro no cadastro
            return ['error' => ['chat' => 'Houve erro ao deletar mensagem! Tente novamente mais tarde.']];
        }
    }


    /**
     * Verifica em lista de conexão se usuário existe
     * 
     * @param int $user Id de usuário a verificar 
     * @since 2.0
     * @return boolean
     */
    function isConnected(int $suser):bool{
        
        //Verifica se usuários estão conectados
        if (in_array($suser, $this->following)) {
            return true;
        } else {
            return false;
        }

    }

    /** Verifica o acesso a sala de conversa */
    function isAccessRoom($suser) {

        //Ids válidos para verificação
        $ids = [$this->currentUser->ID, $suser];
        
        //Verificar se usuários podem enviar mensagem na conversa
        $hasAccess = $this->room->getInstance([
            'fuser' => $ids,
            'suser' => $ids           
        ]);

        if (!$room = $hasAccess->getData()) {
            //Retorna erro
            return false;
        } else {
            //Retorna dados da room
            return $room;
        }
    }
    

}