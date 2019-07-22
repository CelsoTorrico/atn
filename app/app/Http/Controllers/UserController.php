<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Minishlink\WebPush\WebPush;
use Minishlink\WebPush\Subscription;

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
        /*if( !is_a($this->user, 'Core\Profiler\User') && isset($server['ORIGIN']) && preg_match('/^https?:\/\/?'. env('APP_DOMAIN') . '/', $server['ORIGIN']) ){
            $this->user = new User(); 
        }*/
    }

    /** Retorna usuário único  */
    function get(int $id) {

        //Retorna classe de usuário com dados a exibir
        $result = $this->user->getUser($id);

        //Se usuário da query é current_user, não contabilizar view
        if( $result->ID != $this->user->ID ){
            //incrementado qtd view
            $result->increaseView($id);
        }  
        
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

    function getAll() {
        //Executa metodo que traz lista de usuarios
        $result = $this->user->getFriends();
        //retorna resultado
        return response()->json($result);
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

    function setPushSettings(Request $request, bool $add = true) {

        $auth = [
            'GCM' => 'MY_GCM_API_KEY', // deprecated and optional, it's here only for compatibility reasons
            'VAPID' => [
                'subject' => env('APP_FRONT'), // can be a mailto: or your website address
                'publicKey' => env('VAPID_PUBLIC_KEY'), // (recommended) uncompressed public key P-256 encoded in Base64-URL
                'privateKey' => env('VAPID_PRIVATE_KEY'), // (recommended) in fact the secret multiplier of the private key encoded in Base64-URL
                /*'pemFile' => 'path/to/pem', // if you have a PEM file and can link to it on your filesystem
                'pem' => 'pemFileContent', // if you have a PEM file and want to hardcode its content*/
            ]
        ];

        //Registrando e enviado notificação
        $webPush = new WebPush($auth);
        $var = $request->input('subscription');
        $sent = $webPush->sendNotification(
            Subscription::create([
                "endpoint"      => $var['endpoint'],
                //@todo criar token 
                "keys"     => $var['keys']
            ]), 
            '{msg: "Hello World!"}', 
            true);

        /* foreach ($sent as $report) {
            $endpoint = $report->getEndpoint();
            if ($report->isSuccess()) {
                echo "[v] Message sent successfully for subscription {$endpoint}.";
            } else {
                echo "[x] Message failed to sent for subscription {$endpoint}: {$report->getReason()}";
                
                // also available (to get more info)
                
                /** @var \Psr\Http\Message\RequestInterface $requestToPushService */
                //$requestToPushService = $report->getRequest();
                
                /** @var \Psr\Http\Message\ResponseInterface $responseOfPushService */
                //$responseOfPushService = $report->getResponse();
                
                /** @var string $failReason */
                //$failReason = $report->getReason();
                
                /** @var bool $isTheEndpointWrongOrExpired */
                //$isTheEndpointWrongOrExpired = $report->isSubscriptionExpired();
            //} 
        //}*/

        return response()->json($sent);
    }

    function unsetPushSettings(Request $request) {
        return $this->setPushSettings($request, false);
    }

}
