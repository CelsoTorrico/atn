<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;


class CustomServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton(NameClass::class, function ($app) {
            return new NameClass();
        });
    }

}
