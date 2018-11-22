<?php


/* ########## LOAD ROUTES ########################### */

require_once 'authentication.php';
require_once 'user.php';
require_once 'timeline.php';

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', function () use ($router) {
    return response(array(
        'app' => 'AtletasNOW',
        'version' => '2.0',
        'author' => 'Iran Alves'
    ));
});
