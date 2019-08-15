<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Core\Service\Notify;

use Closure;

class NotifyController extends Controller
{

    protected $notify;
    
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(Request $request)
    {
        $this->notify = new Notify($request->user());
    }

    /** Retorna lista de notificações */
    function get(){
        $response = $this->notify->get();
        return response()->json($response);
    }

    /** Retorna lista de notificações */
    function update(){
        $response = $this->notify->update();
        return response()->json($response);
    }

    /** Esconder notificação */
    function delete($id){
        return response($this->notify->delete($id));
    }

    /** Aprovação de requisição */
    function approve(Request $request, $id){

        //Verifica se campos obrigatórios estão presentes
        if(!$request->has('confirm') || !$request->filled('confirm')){
            //TODO: Melhorar resposta json
            return response(['error' => ['notify' => 'Confirmação não foi enviada! Tente novamente!']]); 
        }

        //Armazenando request
        $bool = intval($request->input('confirm'));

        //Se resposta enviada não for boolean
        if($bool > 1){
            return response(['error' => ['notify' => 'Resposta não permitida!']]);
        }

        //Envia dados submetidos
        $response = $this->notify->approveNotify($id, (bool) $bool);
        
        //Resposta da adicão
        return response()->json($response);
    }

}
