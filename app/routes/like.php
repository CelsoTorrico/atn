<?php

/*########## LIKES ###############*/

$router->group(['prefix' => 'like'], function () use ($router) {

    //Adicionar Like
    $router->get('/{post_id:[0-9]+}', 'LikeController@get');

});
