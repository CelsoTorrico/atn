<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Core\Profile\UserSettings;
use Core\Profile\User;

class UserController extends Controller
{

    protected $user;
    
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(Request $request)
    {
        //Atribui usuário do contexto
        $this->user = $request->user();

        //Atribuindo dados de servidor
        $server = $request->server->getHeaders();

        //Verificamos se requisição partiu de nossos servidores, adicionando um usuário se SIM
        if( !is_a($this->user, 'Core\Profile\User') && isset($server['ORIGIN']) && preg_match('/^https?:\/\/?'. env('APP_DOMAIN') . '/', $server['ORIGIN']) ){
            $this->user = new User();
        }
    }

    /** Retorna usuário único  */
    function get(int $id) {

        //Retorna classe de usuário requisitado
        $user = $this->user->getUser($id);
        
        //Id do usuário que visualiza o perfil
        $whoID = $this->user->ID;

        //Se usuário da query é current_user, não contabilizar view
        if( $user->ID != $whoID && !is_null($whoID) ) {
            
            //Função que adiciona visualização de perfil
            $user->increaseView($whoID);
        }  
        
        //retorna resultado
        return response()->json($user);
    }

    function getAll() {
        //Executa metodo que traz lista de usuarios
        $result = $this->user->getFriends();
        
        //retorna resultado
        return response()->json($result);
    }

    function getPdf(int $id=null) {

        $result = $this->user->getUserPdf($id);

        //Se houve erro
        if(is_array($result) && isset($result['error'])){
            return response()->json($result['error']);
        }
        else{
            //Retorna string com dados
            return response()->json($result);
        }
    }


    function getSelf() {
        //retorna resultado
        return response()->json($this->user);
    }

    function getSelfDash() {
        //retorna resultado
        return response()->json($this->user->getMinProfile());
    }

    function getStats(int $user_id = null) {
        
        //retorna resultado
        $result = $this->user->getStats($user_id);

        //Se houve erro
        if(is_array($result) && isset($result['error'])){
            return response()->json($result);
        }
        else{
            //Retorna string com dados
            return response()->json($result);
        }
    }

    function getSuggestions() {        
        //retorna resultado
        return response()->json($this->user->getFriendsSuggestions());
    }

    function update(Request $request){

        //Somente permissão de atualização de proprio perfil
        if( is_null($this->user) ){
            //Retorna erro
            return response()->json(['error' => ['update', 'Você não pode modificar esse perfil.']]);
        } 

        //Atribui dados enviados a var
        $data = $request->all();        

        //incrementado qtd view
        $result = $this->user->update($data);
        
        //retorna resultado
        return response()->json($result);

    }

    function delete(){
        
        //Somente permissão de atualização de proprio perfil
        if( !is_null($this->user->ID) ){
            //Desativa o usuário
            $result = $this->user->delete();
        }  
        else{
            //Retorna erro
            $result = ['error' => ['delete', 'Você não pode desativar esse perfil.']];
        }
        
        //retorna resultado
        return response()->json($result);

    }

    function reactive(){
        
        //Somente permissão de atualização de proprio perfil
        if( !is_null($this->user->ID) ){
            //Desativa o usuário
            $result = $this->user->reactivate();
        }  
        else{
            //Retorna erro
            $result = ['error' => ['delete', 'Você não pode reativar esse perfil.']];
        }
        
        //retorna resultado
        return response()->json($result);

    }

    function sendMessage(Request $request, int $id) {

        //Verifica se campos obrigatórios estão presentes
        if(!$request->has('message_content') || !$request->filled('message_content')){
            //Melhorar resposta json
            return response()->json(['error' =>["Campos obrigatórios não submetido! Tente novamente!"]]); 
        }

        //Atribui conteúdo a variável
        $data = ['message_content' => $request->input('message_content')];

        //Executa metodo de envio de mensagem
        $response = $this->user->sendEmail($id, $data);
        
        //retorna resultado
        return response()->json($response);

    }

    function search (Request $request, int $page = 0) {
        //retorna resultado
        return response()->json($this->user->searchUsers($request->all(), $page));
    }

    /** Settings */
    function setPassword(Request $request){
        
        //Somente permissão de atualização de proprio perfil
        if( is_null($this->user) ){
            //Retorna erro
            return response()->json(['error' => ['update', 'Você não pode modificar esse perfil.']]);
        } 

        //Verifica se campos obrigatórios estão presentes
        if(!$request->has(['user_pass', 'confirm_pass']) 
        || !$request->filled(['user_pass', 'confirm_pass'])){
            //Melhorar resposta json
            return response()->json(['error' => ["Campos obrigatórios não submetido! Tente novamente!"]]); 
        }

        //Atribui dados enviados a var
        $data = $request->all();        

        //incrementado qtd view
        $result = $this->user->updatePassword($data);
        
        //retorna resultado
        return response()->json($result);
    }

    /** Setar notificações push */
    function setPushSettings(Request $request, bool $add = true) {

        $subscription = $request->input('subscription'); //dados da subscrição

        $settings   = new UserSettings($this->user); //classe de configuração do usuário
        
        //Salvar as credentiais de push no banco
        $response = $settings->__set('webpush-credentials', $subscription);

        //Retorna resposta
        return response()->json($response);
    }

    /** Remove inscrição em notificações push */
    function unsetPushSettings(Request $request) {
        return $this->setPushSettings($request, false);
    }

    /**
     * Faz login na plataforma Affinibox
     * @version v2.2 - Criado
     */
    function loginBenefits() {
        return response()->json($this->user->loginAffinibox());
    }

}
