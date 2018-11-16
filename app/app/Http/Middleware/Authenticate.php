<?php

namespace App\Http\Middleware;

use Closure;
use Core\Profile\Login as Login;


class Authenticate
{
    /**
     * The authentication guard factory instance.
     *
     * @var \Illuminate\Contracts\Auth\Factory
     */
    protected $auth;

    /**
     * Create a new middleware instance.
     *
     * @param  \Illuminate\Contracts\Auth\Factory  $auth
     * @return void
     */
    public function __construct(Login $auth)
    {
        $this->auth = $auth;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string|null  $guard
     * @return mixed
     */
    public function handle($request, Closure $next)
    {   
        $request = $this->checkAuth();
        $next($request);
    }

    //Verifica se usuário tem permissão de acessar componente
    protected function checkAuth(){

        //Se usuário 'não' estiver logado
        if( ! $this->logged() ):
            return "Usuário não autorizado! Faça login.";
            exit;
        endif;
    }

    //Verifica se user esta logado, se não volta para a tela de login
    protected function logged ():bool{

        //Se usuário 'não' estiver logado
        if( ! $this->auth->isLogged() ):
            //Destroi sessão e volta tela de login
            $this->auth->setLogout();
            return false;
         else:
            return $this->cookie();
        endif;
    }

    //Verifica se user esta logado, se não volta para a tela de login
    protected function cookie():bool{
    
        //Se cookie estiver válido
        if( $this->auth->isCookieValid() ):
            //Redireciona para painel
            return true;         
        else:
            return false;
        endif; 
    }
    
}
