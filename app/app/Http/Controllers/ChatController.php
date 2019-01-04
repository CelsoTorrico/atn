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

    function get($suser_id){

        $response = $this->chat->getRoom($suser_id);
        
        return response()->json($response);
    }

    function getAllRooms() {
        
        $response = $this->chat->getAllRooms();

        return response()->json( $response );
    }

    function getMessage($room_id) {
        
        $response = $this->chat->getLastMessage($room_id);

        return response()->json( $response );
    }

    function addMessage($room_id, Request $request){

        //Verifica se campos obrigatórios estão presentes
        if(!$request->has('chat_content') || !$request->filled('chat_content')){
            //Melhorar resposta json
            return response("Nenhum conteúdo foi enviado!"); 
        }

        //Atribui conteúdo a variável
        $data = [
            'chat_content'  => $request->input('chat_content'),
            'chat_room'     => $room_id
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
