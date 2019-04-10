<?php

namespace Core\Service;

use Core\Profile\User;
use Core\Service\Follow;
use Core\Utils\FileUpload;
use Core\Database\ChatRoomModel;
use Core\Database\ChatMessagesModel;

class Chat{

    protected $currentUser;
    protected $room;
    protected $messages;
    protected $following;
    protected $followers; 
    protected $redis;
    public    $channel;

    /** 
     * Chat
     * Criação de rooms e mensagens de conversas
     * @param User $user
    */
    public function __construct(User $user){

        //Instancinando classes
        $this->currentUser  = $user;
        $this->room         = new ChatRoomModel();
        $this->messages     = new ChatMessagesModel(); 
        
        //Instanciando classe Illuminate\Redis 5.7
        //Para funcionalidade de chat realtime
        $this->redis = app('redis');
                
        //Define followers e retorna IDs
        $follow = new Follow($user);
        $this->following = $follow->getFollowing(true);
        $this->followers = $follow->getFollowers(true);

        //Retorna classe usuário ou retorna erro
        if( is_null($this->currentUser) ){
            return ['error' => ['chat' => 'Você não tem permissão para chat.']];
        }
    }

    /** Retorna ou cria uma nova room
     * @param int $user_id : ID de usuário  
     * @return array
     */
    public function setRoom(int $suser_id):array{
        
        //Instancia classe de usuário
        $user = new User();

        //Se ao retornar usuário vir erro de usuário inexistente
        if (array_key_exists('error', $room_user = $user->getMinProfile($suser_id))) {
            return ['error' => ['chat' => 'Usuário inexistente. Impossível enviar mensagem.']];
        }

        //Array de pesquisa de room existente entre usuários
        $roomData = [
            "OR" => [
                "AND" => [
                    'fuser' => $this->currentUser->ID,
                    'suser' => $suser_id
                ],
                "AND #cond" => [
                    'suser' => $this->currentUser->ID,
                    'fuser' => $suser_id,
                ]
            ]
        ];
        
        //Verifica se existe uma room existente
        $room = $this->room->load($roomData);

        //Verifica se room existe
        if (!$room) {
            //Preenche modelo com dados de usuário
            $this->room->fill(['fuser' => $this->currentUser->ID,'suser' => $suser_id ]);            
            //Cria uma nova room
            $this->room->save();
        }

        //Retorna dados da room
        return $this->room->getData();
    }

    /**
     * Abre uma room nova ou existente
    *  @param int $user_id
    *  @return array
    */
    function getRoom($suser_id):array{

        //Se usuários não estão conectados
        if(!$this->isConnected($suser_id)){
            return ['error' => ['chat' => 'Vocês não estão conectados. Impossível enviar mensagem a esse usuário.']];
        }

        //Dados da Room
        $room = $this->setRoom($suser_id);

        //Retorna todas as mensagens baseado no usuário
        $messages = $this->getMessages($room);
        
        //Retorna mensagens
        return $messages;

    }

    /** 
     * Retorna todas as mensagens baseado em IDS 
     * @param array $room: dados da room
     * @param int $paged: numero de páginação
     * @return array
     * */
    private function getMessages(array $room, int $paged = 0):array{

        if (!$room = $this->isAccessRoom($room['suser'])) {
            //Retorna erro
            return ['error' => ['room', 'Você não pode acessar mensagens nesta conversa.']];
        }

        //Qtd de itens por página
        $perPage = 100;

        //A partir de qual item contar
        $initPageCount = ($paged <= 1)? $paged = 0 : ($paged * $perPage) - $perPage;

        //Paginação de timeline
        $limit = [$initPageCount, $perPage];

        //Retorna mensagens da room ordenando de data menor para mais recente
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
                'room_id'    => $item->room_id,
                'message_id' => $item->message_id,
                'date'       => $item->date,
                'content'    => $item->content,
                'author'     => $user->getMinProfile($item->author_id),
            ];
        }

        //Fazer todas mensagens como lidas
        $setMessagesAsRead = $this->messages->getIterator([
            'room_id'   => $room['room_id'], 
            'author_id[!]' => $this->currentUser->ID,
        ]);
        
        //Seta todas as mensagens como lidas
        foreach ($setMessagesAsRead as $item) {
            $deleted = $item->delete();
        }

        //Retorna mensagens
        return $allmessages;

    }  
    

    /** 
     * Retorna total de mensagens não lidas 
     * @return int
     * */
    function getTotal(int $room_id = null):int{

        //Variavel para ids de rooms
        $rooms_ids = [];

        //Se for nulo, retornar todas as mensagens não lidas
        if(is_null($room_id)) {
            
            //Retorna rooms que usuário contém
            $rooms = $this->room->getIterator([
                'OR' => [
                    'fuser' => $this->currentUser->ID,
                    'suser' => $this->currentUser->ID 
                ]
            ]);

            //Atribui ids das rooms encontradas
            foreach ($rooms as $item) {
                $rooms_ids[] = $item->room_id;
            }

        } else {
            //Atribui a room a var
            $rooms_ids = $room_id;
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

    /** 
     * Retorna lista de rooms 
     * @return array
     * */
    function getAllRooms():array{     

        //Retorna lista de rooms
        $allRooms = $this->room->getIterator([
            'OR' => [
                'fuser' => $this->currentUser->ID,
                'suser' => $this->currentUser->ID                
            ] 
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

                //Retornar usuário oposto da conversa
                $room_user = ($item->suser != $this->currentUser->ID) ? $item->suser : $item->fuser;

                //Se ao retornar usuário vir erro de usuário inexistente
                if (array_key_exists('error', $room_user = $user->getMinProfile($room_user))) {
                    continue;
                }

                //Combina array timeline e comentários
                $rooms[] =  [
                    'room_id'           => $item->room_id,
                    'user'              => $room_user,
                    'quantity_messages' => $this->getTotal($item->room_id), 
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

    /**
     * Registra uma nova mensagem
     * @param array $data: dados mensagem
     * @return array
     */
    private function register(array $data):array {

        if (!$room = $this->isAccessRoom($data['suser'])) {
            //Retorna erro
            return ['error' => ['room', 'Você não pode enviar mensagens nesta conversa.']];
        }

        //Sanitizando dados a serem inseridos no banco
        $room_id = filter_var($room['room_id'], FILTER_SANITIZE_NUMBER_INT);
        $content = filter_var($data['chat_content'], FILTER_SANITIZE_STRING);
        $author_id = $this->currentUser->ID;

        //Filtrar inputs e validação de dados
        $contentArray = [
            'room_id'       => $room_id,
            'content'       => $content,
            'author_id'     => $author_id
        ];

        //Insere no banco de dados 'Redis' para chat em realtime
        $this->redis->publish($room_id, json_encode($contentArray));

        //Abaixo insere no banco como histórico de conversa
        //Preenche colunas com valores
        $this->messages->fill($contentArray); 

        //Salva novo registro no banco
        $result = $this->messages->save();

        //Pega id da última inserção
        $lastInsert = $this->messages->getPrimaryKey();         
        
        return [];
    }

    /**
     * Remover uma mensagem enviada
     * @param int $ID: id de usuário
     * @return array
     */
    private function deregister(int $ID):array{

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
     * @param int $id Id de usuário a verificar 
     * @since 2.0
     * @return boolean
     */
    function isConnected(int $id):bool{
        
        //Verifica se esta seguindo
        if (in_array($id, $this->following)) {
            return true;
        //Verifica se é seguidor
        } elseif (in_array($id, $this->followers)){
            return true;
        } else {
            return false;
        }

    }

    /** Verifica o acesso a sala de conversa */
    function isAccessRoom($suser) {

        //Verifica se room esta vazia
        if (empty($hasAccess = $this->room->getData())) {
            
            //Inicializa uma nova instancia da room
            $this->room->load([
                "OR" => [
                    "AND" => [
                        'fuser' => $this->currentUser->ID,
                        'suser' => $suser
                    ],
                    "AND #cond" => [
                        'suser' => $this->currentUser->ID,
                        'fuser' => $suser,
                    ]
                ]
            ]);

            //Atribui dados
            $hasAccess = $this->room->getData();
        }

        if ($suser == $hasAccess['suser'] || $suser == $hasAccess['fuser']) {
            //Retorna dados da room
            return $hasAccess;
        } else {
            //Retorna false
            return false;
        }
    }
    

}