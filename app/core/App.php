<?php
/**
 * App AtletasNOW
 * Version: 0.2
 *
 * @link      https://github.com/iranalves85
 * @copyright Copyright (c) 2018-* Iran Alves
 * @license   Lumen (MIT License)
 */

namespace Core;

require "config.php";

//Connection class
use Core\Connection\Connect as Connect;
//Action class
use Core\Chat as Chat;
use Core\Post as Post;
use Core\Comment as Comment;
use Core\Timeline as Timeline;

//User class
use Core\Profile\Login as Login;
use Core\Profile\User as User;
use Core\Profile\Friends as Friends;
use Core\Profile\Config as Config;

//Utils class
use Core\Utils\DataConverter as DataConverter;
use Core\Utils\ArgValidation as ArgValidation;


class App{

    public $user;
    
    function __construct(){
        $this->user = $this->user();  
    }   

    function user(){
        return new User(new Connect());
    }

    function product(){
        return new Product();
    }

}