<?php 

namespace Core\Service;

use Minishlink\WebPush\WebPush;
use Minishlink\WebPush\Subscription;

/**
 * Classe para exportar relatórios de uso e outras info 
 * 
 * @param
 */
class PushNotify {

    private $webPush;

    //Contrução da classe
    public function __construct() {
        
        //Inicializa modelos e classes
        $auth = [
            'GCM'   => env('GCM_KEY'),
            'VAPID' => [
                'subject'       => env('APP_FRONT'),
                'publicKey'     => env('VAPID_PUBLIC_KEY'), 
                'privateKey'    => env('VAPID_PRIVATE_KEY'),
            ]
        ];

        $defaultOptions = [
            'TTL' => 300, // defaults to 4 weeks
            'urgency' => 'normal', // protocol defaults to "normal"
            'topic' => 'new_event', // not defined by default,
            'batchSize' => 200, // defaults to 1000
        ];

        //Registrando e enviado notificação
        $this->webPush = new WebPush($auth);
        $this->webPush->setReuseVAPIDHeaders(true);
        $this->webPush->setDefaultOptions($defaultOptions);
        
    }


    function sendNotification(array $subscription, array $message = [], array $options = []) {
        
        //Instancia Subscrição
        $webPushSubscription = Subscription::create($subscription);
        
        //Contruindo notificação e enviando
        $res = $this->webPush->sendNotification( 
            $webPushSubscription, 
            json_encode($message),
            true,
            $options
        );

        //Verificação de erros
        $response = $this->verifyErrors();

        return $response;
    }

    private function verifyErrors() {
        
        $response = ''; //Resposta Geral        
        $sentDetail = []; //Atribui dados do envio

        foreach ($this->webPush->flush() as $report) {
            
            $sentDetail['endpoint'] = $endpoint = $report->getEndpoint();
            
            if ($report->isSuccess()) {
                $response = "[v] Message sent successfully for subscription {$endpoint}.";
            } else {
                $response = false;
                $sentDetail['message'] = "[x] Message failed to sent for subscription {$endpoint}: {$report->getReason()}";
                
                // also available (to get more info)
                
                /** @var \Psr\Http\Message\RequestInterface $requestToPushService */
                $sentDetail['requestToPushService'] = $report->getRequest();
                
                /** @var \Psr\Http\Message\ResponseInterface $responseOfPushService */
                $sentDetail['responseOfPushService'] = $report->getResponse();
                
                /** @var string $failReason */
                $sentDetail['failReason'] = $report->getReason();
                
                /** @var bool $isTheEndpointWrongOrExpired */
                $sentDetail['isTheEndpointWrongOrExpired'] = $report->isSubscriptionExpired();
            } 
        }

        return $response;
    }      


}