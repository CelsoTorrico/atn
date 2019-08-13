<?php

namespace App\Http\Middleware;

use Closure;

class Cors
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {

        $http_origin = ''; //Inicializando variavel vazia
        $match = [];

        if(isset($_SERVER['HTTP_ORIGIN'])) {
            $http_origin = $_SERVER['HTTP_ORIGIN']; //Atribuindo servidor de requisição
        }        

        $regex = '/http(s)?:\/\/(app|api|admin)?'. env('APP_DOMAIN') .'/'; 

        if (!empty($http_origin) && preg_match($regex, $http_origin, $match)) {
                $origin = $match[0];
        } else {
                $origin = env('APP_FRONT');
        }

        $headers = [
            'Access-Control-Allow-Origin'      => $origin,
            'Vary'                             => 'Origin',
            'Access-Control-Allow-Methods'     => 'HEAD, POST, GET, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Credentials' => 'true',
            'Access-Control-Max-Age'           => '86400',
            'Access-Control-Allow-Headers'     => 'Origin, Content-Type, Set-Cookie, Authorization, X-Requested-With'
        ];

        if ($request->isMethod('OPTIONS'))
        {
            return response()->json('{"method":"OPTIONS"}', 200, $headers);
        }
        
        $response = $next($request);   
        
        foreach($headers as $key => $value)
        {      
             //Verifica se resposta não é da classe BinaryFileResponse
            if(!is_a($response, 'Symfony\Component\HttpFoundation\BinaryFileResponse')) {
                 //Aplicando headers para respostas json
                $response->header($key, $value);
            } else {
                 //Aplicando headers para respostas files
                $response->headers->set($key, $value);
            }
            
        }

        return $response;
    }
}