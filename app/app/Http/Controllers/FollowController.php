<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Core\Service\Follow;

use Closure;

class FollowController extends Controller
{

    protected $follow;
    
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(Request $request)
    {
        $this->follow = new Follow($request);
    }

    /** Retorna todos seguidores */
    function get(){

        $response = $this->follow->getFollowers();
        
        return response()->json($response);
    }

    /** Começar a seguir */
    function add(int $id){

        $response = $this->follow->addFollow($id);
        
        return response()->json($response);
    }

    /** Deixar de seguir */
    function delete($id){
        return response($this->follow->removeFollow($id));
    }

    /** Bloquear seguidor */
    function update(Request $request, $id){

        //Verifica se campos obrigatórios estão presentes
        //TODO: Em versões futuras determinar quanto tempo de block
        /*if(!$request->has('time') && !$request->filled('time')) {
            //TODO: Melhorar resposta json
            return response("Campo obrigatório não submetido! Tente novamente!"); 
        }*/

        //Executa methodo da classe
        $response = $this->follow->blockFollow($id);
        
        return response()->json($response);
    }

}
