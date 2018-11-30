<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Core\Service\Timeline as Timeline;
use Closure;

class TimelineController extends Controller
{

    protected $timeline;
    
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->timeline = new Timeline();
    }

    function get(Request $request, $id){

        $response = $this->timeline->get($id);
        
        return response()->json($response);
    }

    function getAll(Request $request){
        
        $response = $this->timeline->getAll();

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

        $response = $this->timeline->add($request->input('post_content'));
        
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
        $response = $this->timeline->update($request->input('post_content'), $id);
        
        return response()->json($response);
    }

    function delete(Request $request, $id){
        return response($this->timeline->delete($id));
    }

}
