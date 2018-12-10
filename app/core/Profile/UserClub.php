<?php 

namespace Core\Profile;
use Core\Database\PrivatemetaModel;
use Core\Database\UsermetaModel;
use Core\Database\UserModel;

class UserClub extends User{

    protected $private;
    protected $userModel;
    protected $metaModel;

    function __construct(){
        
        //Retorna lista de usuários de propriedade
        //$this->metaModel = new UsermetaModel();

        //privatemetadados para retornar qtd de usuários permitidos
        $this->private = new PrivatemetaModel(['usertype' => $this->type]);

    }

    public function getUsers(){
        
        //Carregando metadados de usuários
        $users = $this->metaModel->getIterator(['parent_user' => $this->ID, 'limit' => $this->private->meta_value]);

        //Retorna se houve erro ou nenhum usuário
        if(!is_array($users) || count($users) <= 0){
            return ['error' => ['users' => 'Nenhum usuário a exibir.']];
        }

        //Percorre array de usuários
		foreach ($users as $key => $value) {
            
        }

    }

    public function getUser(){

    }

    public function addUser(){

    }

    public function updateUser(){

    }

    public function deleteUser(){

    }

}