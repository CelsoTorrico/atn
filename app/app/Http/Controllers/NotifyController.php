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
    public function __construct()
    {
        $this->notify = new Notify();
    }

    function get(Request $request, $id){

        $response = $this->notify->get($id);
        
        return response()->json($response);
    }

    function getAll(Request $request){
        
        $response = $this->notify->getAll();

        return response()->json( $response );
    }

    function add(Request $request){

        //Verifica se campos obrigatórios estão presentes
        if(!$request->has('post_content')){
            //TODO: Melhorar resposta json
            return response("Campo obrigatório não submetido! Tente novamente!"); 
        }

        //Verifica se campos obrigatórios estão presentes
        if(!$request->filled('post_content') ){
            //TODO: Melhorar resposta json
            return response("Falta preencher campos obrigatórios!"); 
        }

        $response = $this->notify->add($request->input('post_content'));
        
        return response()->json($response);
    }

    function update(Request $request, $id){

        //Verifica se campos obrigatórios estão presentes
        if(!$request->has('post_content')){
            //TODO: Melhorar resposta json
            return response("Campo obrigatório não submetido! Tente novamente!"); 
        }

        //Verifica se campos obrigatórios estão presentes
        if(!$request->filled('post_content') ){
            //TODO: Melhorar resposta json
            return response("Falta preencher campos obrigatórios!"); 
        }

        //Executa methodo da classe
        $response = $this->notify->update($request->input('post_content'), $id);
        
        return response()->json($response);
    }

    function delete(Request $request, $id){
        return response($this->notify->delete($id));
    }

    /** Aprovação de requisição */

    function approve(Request $request, $id, $from_id){

        //Verifica se campos obrigatórios estão presentes
        if(!$request->has('confirm') || !$request->filled('confirm')){
            //TODO: Melhorar resposta json
            return response(['error' => ['notify' => 'Confirmação não foi enviada! Tente novamente!']]); 
        }

        if(!is_bool($request->input('confirme'))){
            return response(['error' => ['notify' => 'Resposta não permitida!']]);
        }

        //Envia dados submetidos
        $response = $this->notify->approveNotify($id, (boolean) $request->input('confirm'));
        
        //Resposta da adicão
        return response()->json($response);
    }

}
