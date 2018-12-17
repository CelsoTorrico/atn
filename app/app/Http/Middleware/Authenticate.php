<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Contracts\Auth\Factory as Auth;
use Symfony\Component\HttpFoundation\Cookie;
use App\Http\Controllers\LoginController;

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
    protected $sessionCookie; 

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

            //Retorna dados de usuário encontrado
            $userData = $control->getUserData();

            //Se houve erro retorna resultado
            if( array_key_exists('error', $msg) ){
                return $next($msg);
            }

            //Seta cookie de sessão
            $this->sessionCookie = app('cookie')->forever(env('APPCOOKIE'), $control->getToken(), '/', env('APP_PATH'), false);  

            //Atribui a variavel
            $tokenDatabase = $this->sessionCookie;

            //Insere o token em string e insere no banco;
            $success = $control->insertToken($userData['ID'], $tokenDatabase->__toString());

            //Retorna mensagem juntamente com cookie 
            return $next($request)->withCookie($this->sessionCookie);
            
        }

        //Permitir listagem de clubes ou listagem de esportes
        if ($request->is('user/clubs') || $request->is('user/sports') || $request->is('register')) {
            //Retorna mensagem juntamente com cookie 
            return $next($request);            
        }

        //Se usuário não está autenticado
        if ($this->auth->guard($guard)->guest()) {
            return response(['error' => ['login' => 'Acesso não autorizado.']], 401);
        }

        return $next($request);        
        
    }
    
}
