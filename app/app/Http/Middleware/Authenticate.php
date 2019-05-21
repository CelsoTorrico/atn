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
        if (in_array($request->method(), ['POST', 'OPTIONS']) 
            && ($request->is('login') || $request->is('register'))) {

                //Path
                $uri = $request->path();

                //Login Controller
                $control = $this->loginControl;

                //Post credenciais de login
                $msg = ($uri == 'login')? $control->login($request) : $control->register($request);

                //Retorna dados de usuário encontrado
                $userData = $control->getUserData();

                //Decodifica json
                $c = json_decode($msg->getContent(), true);
                
                //Verifica se existe erro e retorna
                if (key_exists('error', $c)) {
                    //Se houve erro retorna resultado
                    return $next($request);
                }

                //Seta cookie de sessão : cookie HTTP_ONLY=false
                //25.03 = habilitar SameSite para funcionar no Edge
                $this->sessionCookie = app('cookie')->forever(
                    env('APPCOOKIE'), 
                    $control->getToken(), 
                    '/', 
                    env('APP_DOMAIN'), 
                    false, 
                    false, 
                    false, 
                    'strict');  

                //Atribui a variavel
                $tokenDatabase = $this->sessionCookie;

                //Insere o token em string e insere no banco;
                $success = $control->insertToken($userData['ID'], $tokenDatabase->__toString());

                //Retorna mensagem juntamente com cookie 
                $response = response($c)->withCookie($this->sessionCookie); 
                
                return $response;
            
        }

        //Após validação de usuário social login, logar através de cookie
        if ($request->method() == 'GET' && $request->is('login')) {            
            //Retorna requisição
            return $request;
        }

        //Se usuário estiver com perfil desativado, permitir requisição
        if ($request->method() == 'GET' && ($request->is('login/facebook') || $request->is('login/google'))) {

            //Verifica qual serviço de login foi solicitado
            preg_match('/login\/(facebook|google)/', $request->path(), $path);

            //Se houver erro, retorna
            if (!is_array($path)) {
                return ['error' => ['socialLogin' => 'Método de login não permitido.']];
            }

            //Inicia classe login controller
            $control = $this->loginControl;

            //Verifica qual provider inicializar
            $provider = $control->socialProvider($path[1]);

            //Retorna dados de usuário encontrado
            return $provider;

        }

        //Se usuário estiver com perfil desativado, permitir requisição
        if ($request->method() == 'GET' && ($request->is('login/facebook/authorized') || $request->is('login/google/authorized'))) {

            //Verifica qual serviço de login foi solicitado
            preg_match('/login\/(facebook|google)\/authorized/', $request->path(), $path);

            //Se houver erro, retorna
            if (!is_array($path)) {
                return ['error' => ['socialLogin' => 'Método de login não permitido.']];
            }

            //Inicia classe login controller
            $control = $this->loginControl;

            //Verifica qual provider inicializar
            $msg = $control->socialCallback($path[1]);

            //Retorna dados de usuário encontrado
            $userData = $control->getUserData();

            //Se houve erro retorna resultado
            if( array_key_exists('error', json_decode($msg->content())) ){
                return $next($msg);
            }

            //Seta cookie de sessão : cookie HTTP_ONLY=false
            //25.03 = habilitar SameSite para funcionar no Edge
            $this->sessionCookie = app('cookie')->forever(
                env('APPCOOKIE'), 
                $control->getToken(), 
                '/', 
                env('APP_DOMAIN'), 
                false, 
                false, 
                false, 
                'strict');  

            //Atribui a variavel
            $tokenDatabase = $this->sessionCookie;

            //Insere o token em string e insere no banco;
            $success = $control->insertToken($userData['ID'], $tokenDatabase->__toString());

            //Retorna resultados
            if($success){
                //Redireciona para front-app juntamente com cookie via url parameter
                return redirect(env('APP_FRONT').'#/dashboard')->withCookie($this->sessionCookie);
            } else {
                //Retorna erro
                return response(['error']);
            }

        }

        //Permitir logout mesmo se usuário não estiver logado
        if ($request->method() == 'POST' && $request->is('register/exist')) {
            //Retorna requisição com dados
            return $next($request);
        }

        //Se usuário estiver com perfil desativado, permitir requisição de esqueci minha senha
        if ($request->method() ==  'POST' && $request->is('forget-pass')) {
            //Retorna requisição com dados
            return $next($request);
        }

        //Permitir listagem de clubes ou listagem de esportes
        if ($request->is('user/clubs') || $request->is('user/sports')) {
            //Retorna mensagem juntamente com cookie 
            return $next($request);            
        }

        //Permitir logout mesmo se usuário não estiver logado
        if ($request->method() == 'GET' && $request->is('logout')) {
            //Retorna requisição com dados
            return $next($request);
        }

        // Acesso nova_home
        // Permitir busca via pré-cadastro
        $server = $request->server->getHeaders();
        if ( (($request->is('user/search') && $request->method() == "POST") 
        || ($request->is('user/*') && $request->method() == "GET")) 
        && $request->secure() == true && preg_match('/^https?:\/\/'. env('APP_DOMAIN') . '/', $server['ORIGIN'])) {
            return $next($request); 
        }

        //Se usuário não está autenticado
        if ($this->auth->guard($guard)->guest()) {
            return response(['error' => ['login' => 'Acesso não autorizado.']], 401);
        }

        return $next($request);        
        
    }
    
}
