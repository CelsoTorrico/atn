<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppCoreServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton('\Core\Login', function ($app) {
            return new App();
        });
    }
}
