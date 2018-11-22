<?php

namespace App\Http\Middleware;

use Closure;
use Core\Profile\Login as Login;
use Illuminate\Http\Request;


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
    public function __construct(){}
    

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string|null  $guard
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {   
        /** Validação antes de retornar Closure $next */
        return $next($request);
    }

    //Verifica se usuário tem permissão de acessar componente
    function checkAuth($request){
        
    }
    
}
