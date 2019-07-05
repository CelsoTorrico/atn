<?php


/* ########## LOAD ROUTES ########################### */

require_once 'authentication.php';
require_once 'user.php';
require_once 'timeline.php';
require_once 'learn.php';
require_once 'report.php';
require_once 'calendar.php';
require_once 'notify.php';
require_once 'follow.php';
require_once 'like.php';
require_once 'favorite.php';
require_once 'chat.php';
require_once 'comment.php';

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

/** Acesso liberado para images */
$router->get('/uploaded-images/*', function () use ($router) {
    return response();
});
