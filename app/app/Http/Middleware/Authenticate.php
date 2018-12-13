<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Contracts\Auth\Factory as Auth;
use App\Http\Controllers\LoginController;
//use Symfony\Component\HttpFoundation\Cookie;

use Core\Profile\Login;
use Core\Profile\User;

class Authenticate
{
    /**
     * The authentication guard factory instance.
     *
     * @var \Illuminate\Contracts\Auth\Factory
     */
    protected $auth;
    protected $loginControl;

    /**
     * Create a new middleware instance.
     *
     * @param  \Illuminate\Contracts\Auth\Factory  $auth
     * @return void
     */
    public function __construct(Auth $auth, LoginController $login){
        
        $this->auth = $auth;
        $this->loginControl = $login;

    }
        

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string|null  $guard
     * @return mixed
     */
    public function handle(Request $request, Closure $next, $guard = null)
    {       

        //Se usuário estiver com perfil desativado, permitir requisição
        if ($request->is('login')) {

            $control = $this->loginControl;

            //Post credenciais de login
            $msg = $control->login($request);

            //Se houve erro retorna resultado
            if( array_key_exists('error', $msg) ){
                return $response($msg);
            }

            //Instancia classe Response
            $response = new Response($msg);

            //Seta cookie de sessão
            $cookie = app('cookie')->forever(env('APPCOOKIE'), $control->getToken(), '/', env('APP_PATH'), false);            

            //Retorna mensagem juntamente com cookie 
            return $response->withCookie($cookie);
            
        }

        if ($this->auth->guard($guard)->guest()) {
            return response('Unauthorized.', 401);
        }

        return $next($request);        
        
    }
    
}
