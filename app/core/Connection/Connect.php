<?php

namespace Core\Connection;


class Connect{

    //Class
    static public   $pdo;
    static public   $validTypeData;

    function __construct(){

        //setlocale();
        date_default_timezone_set ( 'America/Sao_Paulo' );
        
    }

}