<?php

namespace App\Http\Middleware;

use Core\App;
use Closure;

class Core
{

    use App;
    /**
     * Create a new middleware instance.
     *
     * @return void
     */
    public function __construct()
    {
       
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
        $next($request);
    }
    
}
