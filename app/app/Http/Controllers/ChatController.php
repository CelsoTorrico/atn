<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Core\Service\Chat;
use Core\Profile\User;

use Closure;

class ChatController extends Controller
{

    protected $chat;
    
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(Request $request)
    {
        $this->chat = new Chat($request->user());
    }

    function get(int $suser_id){

        $response = $this->chat->getRoom($suser_id);
        
        return response()->json($response);
    }

    function getRoom(int $suser_id){

        $room_model = $this->chat->setRoom($suser_id);
        $response = ['chat_room' => $room_model['suser']];

        return response()->json($response);
    }

    function getAllRooms() {
        
        $response = $this->chat->getAllRooms();

        return response()->json( $response );
    }

    function getMessage(int $suser) {
        
        $response = $this->chat->getLastMessage($suser);

        return response()->json( $response );
    }

    function addMessage(int $user_id, Request $request){

        //Verifica se campos obrigatórios estão presentes
        if(!$request->has('chat_content') || !$request->filled('chat_content')){
            //Melhorar resposta json
            return response("Nenhum conteúdo foi enviado!"); 
        }

        //Atribui conteúdo a variável
        $data = [
            'chat_content'  => $request->input('chat_content'),
            'suser'         => $user_id
        ];

        //Atribui imagem se tiver upload
        if ($request->hasFile('chat_image') && $request->file('chat_image')->isValid()) {

            //Atribui fn a var
            $file = $request->file('chat_image');

            //Atribui caminho a variavel
            $data['chat_image'] = $file;
        }

        $response = $this->chat->add($data);
        
        return response()->json($response);
    }

    function deleteMessage($id){
        return response($this->chat->delete($id));
    }

}
