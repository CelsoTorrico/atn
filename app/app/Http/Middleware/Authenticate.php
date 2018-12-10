<?php

namespace App\Http\Middleware;

use Closure;
use Core\Profile\Login;
use Core\Profile\User;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Cookie;


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
        if (!$class = User::get_current_user()) {
            return ['error' => ['login' => 'Sessão ainda foi não inicializada.']];
        }     

        return $next($request);
        
        
    }
    
}
