<?php

require_once __DIR__.'/../core/autoload.php';
require_once __DIR__.'/../vendor/autoload.php';

try {
    (new Dotenv\Dotenv(__DIR__.'/../'))->load();
} catch (Dotenv\Exception\InvalidPathException $e) {
    //
}

/*
|--------------------------------------------------------------------------
| Create The Application
|--------------------------------------------------------------------------
|
| Here we will load the environment and create the application instance
| that serves as the central piece of this framework. We'll use this
| application as an "IoC" container and router for this framework.
|
*/

$app = new Laravel\Lumen\Application(
    realpath(__DIR__.'/../')
);

//config(require(__DIR__.'/../app/config/session.php'));  //Sessões
config(require(__DIR__.'/../app/config/services.php')); //API Socialize

$app->withFacades(TRUE, [
    'Laravel\Socialite\Facades\Socialite' => 'Socialite'
]);

//$app->withEloquent();

/*
|--------------------------------------------------------------------------
| Register Container Bindings
|--------------------------------------------------------------------------
|
| Now we will register a few bindings in the service container. We will
| register the exception handler and the console kernel. You may add
| your own bindings here if you like or you can make another file.
|
*/

$app->singleton(
    Illuminate\Contracts\Debug\ExceptionHandler::class,
    App\Exceptions\Handler::class
);

$app->singleton(
    Illuminate\Contracts\Console\Kernel::class,
    App\Console\Kernel::class
);

$app->singleton('cookie', function () use ($app) {
    return $app->loadComponent('session', 'Illuminate\Cookie\CookieServiceProvider', 'cookie');
});

$app->bind('Illuminate\Contracts\Cookie\QueueingFactory', 'cookie');

/*
|--------------------------------------------------------------------------
| Register Middleware
|--------------------------------------------------------------------------
|
| Next, we will register the middleware with the application. These can
| be global middleware that run before and after each request into a
| route or middleware that'll be assigned to some specific routes.
|
*/

//Carrega autenticação
$app->middleware([
    App\Http\Middleware\Authenticate::class
]);

//Carregando Middlewares do App
$app->routeMiddleware([
    aryelgois\Medools\MedooConnection::loadConfig(__DIR__.'/../app/config/database.php')
]);

/*
|--------------------------------------------------------------------------
| Register Service Providers
|--------------------------------------------------------------------------
|
| Here we will register all of the application's service providers which
| are used to bind services into the container. Service providers are
| totally optional, so you are not required to uncomment this line.
|
*/

//Service provider de authorização
$app->register(App\Providers\AuthServiceProvider::class);

//Service provider de cookie
$app->register(Illuminate\Cookie\CookieServiceProvider::class);

//$app->register(\Illuminate\Session\SessionServiceProvider::class); 
//Service provider Socialite
$app->register(\Laravel\Socialite\SocialiteServiceProvider::class);


/*
|--------------------------------------------------------------------------
| Load The Application Routes
|--------------------------------------------------------------------------
|
| Next we will include the routes file so that they can all be added to
| the application. This will provide all of the URLs the application
| can respond to, as well as the controllers that may handle them.
|
*/

$app->router->group([
    'namespace' => 'App\Http\Controllers',
], function ($router) {
    require __DIR__.'/../routes/web.php';
});

return $app;
