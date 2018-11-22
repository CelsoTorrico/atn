<?php 

/** ######## AUTH ############ */

//Post credenciais de login
$router->post('/login', 'LoginController@login');

//Desloga e finaliza sessão
$router->get('/logout', 'LoginController@logout');

//Registrar uma nova conta
$router->post('/register', 'LoginController@register');