<?php

namespace App\Providers;

use Core\Profile\Login;
use Core\Profile\User;
use Core\Database\UserModel;
use Core\Database\UsermetaModel;
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

        $this->app['auth']->viaRequest('api', function ($request) {

            //Carrega classe existente de logon anterior
            //$cookie = app('cookie')->queued(env('APPCOOKIE'));
            if ( !$request->hasCookie(env('APPCOOKIE')) ) {
                $user = null;
            } else {
                //Retorna cookie enviado
                $cookie = $request->header('cookie');

                //Carrega classe de usuário existente ou null
                $user = $this->get_current_user($cookie);
            }            

            //Retorna usuário
            return $user;

        });

    }


    //Retorna usuário atual através de Cookie
    protected function get_current_user(string $cookie) { 

        $cookieObj = Cookie::fromString($cookie);

        //Verifica cookie ainda é válido
        if ($cookieObj->getMaxAge() > time() ) {
            return null;
        }

        //Retorna dados armazenados
        $usermeta = new UsermetaModel();
        
        $isExist = $usermeta->load([
            'meta_key'      => 'session_tokens',
            'meta_value[~]' =>  '%'. (string) str_replace(['%', '.'],['\\%', '\\.'],$cookieObj->getValue()) . '%'
        ]);

        //Verifica cookie é valido
        if (!$isExist) {
            return null;
        }

        //Retorna classe determinada por tipo de usuário
        $class = User::typeUserClass(new UserModel(['ID' => $usermeta->user_id]));
        
        //Retorna classe
        return $class;
            
    }


}
