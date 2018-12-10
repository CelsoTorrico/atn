<?php 

namespace Core\Profile;
use Core\Database\PrivatemetaModel;
use Core\Database\UsermetaModel;

class UserClub extends User{

    protected $max_user;
    protected $my_users;

    function __construct(){
        
        //Retorna lista de usuários de propriedade
        $this->metaModel = new UsermetaModel();

        //quantidade máxima de usuários a gerenciar
        $this->private = new PrivatemetaModel();

    }

    public function getClubUsers(){
        
        //Retorna lista de usuários de propriedade
        $this->metaModel->getInstance();
        $this->metaModel->load(['parent_user' => $this->ID]);

        //quantidade máxima de usuários a gerenciar
        $this->private->load(['usertype' => $this->type]);

    }

    public function addUser(){

    }

    public function updateUser(){

    }

    public function deleteUser(){

    }

}