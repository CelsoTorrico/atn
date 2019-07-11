<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Core\Service\Learn;
use Core\Profile\User;

use Closure;
use Core\Service\Calendar;

class CalendarController extends Controller
{

    protected $learn;
    
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(Request $request)
    {
        $this->calendar = new Calendar($request->user());
    }

    function get($id) {

        $response = $this->calendar->get($id);
        
        return response()->json($response);
    }

    function getAll(int $paged = 0) {
        
        $response = $this->calendar->getAll($paged);

        return response()->json( $response );
    }

    function getTypes() {
        
        $response = $this->calendar->getTypes();

        return response()->json($response);
    }

    function add(Request $request) {

        //Verifica se campos obrigatórios estão presentes e preenchidos
        if (!$request->has(['post_title', 'post_content', 'post_calendar_date', 'post_calendar_type']) || !$request->filled(['post_title', 'post_content', 'post_calendar_date',  'post_calendar_type'])) {
            //Retorna resposta
            return response()->json(['error' => ['calendar' => "Campo obrigatório não submetido! Preencha o formulário corretamente!"]]); 
        }

        //Atribui dados enviados a variavel
        $data = $request->all();

        //Atribui imagem se tiver upload
        if ($request->hasFile('post_image') && $request->file('post_image')->isValid()) {
            //Atribui fn a var
            $data['post_image'] = $request->file('post_image');
        }

        //Atribui resposta
        $response = $this->calendar->add($data);
        
        //Retorna resposta
        return response()->json($response);
    }

    function update(Request $request, int $id) {

        //Atribui dados enviados a variavel
        $data = $request->all();

        //Atribui imagem se tiver upload
        if ($request->hasFile('post_image') && $request->file('post_image')->isValid()) {
            //Atribui fn a var
            $data['post_image'] = $request->file('post_image');
        }

        //Envia dados para atualização em classe Calendar
        $response = $this->calendar->update($data, $id);
        
        return response()->json($response);
    }

    function delete(int $id) {

        //Verifica se ID foi enviado
        if(is_null($id)) {
            //Mensagem de erro
            return ['error' => ['calendar' => 'Houve erro na solicitação! Tente novamente mais tarde.']];
        } 

        //Mensagem a serem retornadas, usa função delete da classe 'Post' herdada
        if(key_exists('success', $this->calendar->delete($id))) {
            //Mensagem de sucesso
            return ['success' => ['calendar' => 'O calendário foi deletado com sucesso!']];
        } else {            
            //Mensagem de erro
            return ['error' => ['calendar' => 'Houve erro na solicitação! Tente novamente mais tarde.']];
        }

    }

}
