<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Core\Service\Sport;

use Closure;

class SportController extends Controller
{

    protected $sport;
    
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(Request $request)
    {
        $this->sport = new Sport($request);
    }

    function get(Request $request, $id){

        $response = $this->sport->get($id);
        
        return response()->json($response);
    }

    function getAll(Request $request){
        
        $response = $this->sport->getAll();

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

        $response = $this->sport->add($request->input('post_content'));
        
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
        $response = $this->sport->update($request->input('post_content'), $id);
        
        return response()->json($response);
    }

    function delete(Request $request, $id){
        return response($this->sport->delete($id));
    }

}
