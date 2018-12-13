<?php

namespace App\Providers;

use Core\Profile\Login;
use Core\Profile\User;
use Symfony\Component\HttpFoundation\Cookie;

use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Boot the authentication services for the application.
     *
     * @return void
     */
    public function boot()
    {

        // Here you may define how you wish users to be authenticated for your Lumen
        // application. The callback which receives the incoming request instance
        // should return either a User instance or null. You're free to obtain
        // the User instance via an API token or any other method necessary.

        /*
        //Se valor for nulo, sessão não foi inicializada
        //No caso, de cookie e sessão inválida
        if ( is_null($response = User::get_current_user()) ) {
            return ['error' => ['login' => 'Sessão não foi inicializada.']];
        } 

        //Se for array de erros, retorna erro
        if (array_key_exists('error', $response)) {
            return $response;
        }      
        
        //Se perfil está inativado, somente permitir requisição de reativação
        if( $response->getStatus() == 1) {

            //Resposta padrão para perfis inativados
            $response = ['error' => ['login' => 'Perfil inativado, para poder realizar ações na plataforma é necessário reativa-lo.']];

            //Se usuário estiver com perfil desativado, permitir requisição
            if($request->path() == 'user/reactive' && $request->isMethod('PUT')){
                $response = $next($request);
            }

            return $response;

        }*/

        $this->app['auth']->viaRequest('api', function ($request) {

            //Carrega classe existente de logon anterior
            $cookie = app('cookie')->queued(env('APPCOOKIE'));

            //Carrega classe de usuário existente ou null
            //$user = $this->get_current_user($cookie);

            if (is_null($cookie)) {
                return null;
            }

            return $cookie;

        });

    }


    //Retorna usuário atual através de Cookie
    protected function get_current_user(Cookie $cookie) { 

        //Verifica cookie ainda é válido
        if ($cookie->getMaxAge() > time() ) {
            return null;
        }

        //Retorna dados armazenados
        $user = new User();

        //Verifica se existe sessão ativa
        if ( is_null($user) ) {
            return null;
        }
        
        $isExist = $user->model->load([
            'user_login' => $data
        ]);

        //Verifica cookie é valido
        if (!$isExist || $cookie != $user->model->token ) {
            return null;
        }

        //Retorna classe determinada por tipo de usuário
        $class = User::typeUserClass($user->model);
        
        //Retorna classe
        return $class;
            
    }


}
