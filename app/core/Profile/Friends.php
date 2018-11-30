<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Amigos
 *
 * @author Iran
 */

namespace Core\Profile;

use Core\Database\FollowersModel;
use Core\Database\UserModel;
use Core\Database\UsermetaModel;

class Friends {

	private $ID;
	private $model;
	private $userModel;
	private $usermetaModel;
	private $validUsermeta;
	private $onlyKey;

	function __construct($id, $filter = array()){

		//Atribui id de usuario corrente
		$this->ID = $id; 
		$this->model = new FollowersModel();
		
		//List of valid input filters
        $this->validUsermeta = array(
            'ID', 'sport', 'type', 'city', 'state', 'country', 'gender'
		);

	}

	//Verifica as metadatas válidas
	private function validFilter(Array $data):array{

		$array = [];

		//Intera sobre array
        foreach ($this->validUsermeta as $key) {
			if( array_key_exists($key, $data ) ){
				$array[$key] = $data[$key];
			}            
		}
		
		return $array;

	}
	
	//Retorna lista de usuários conecatdos
	public function get():Array{
		
		//Carrega array de relacionamentos IDS
		$response = $this->model->dump(['from_id' => $this->ID]);

		if(is_array($response) && count($response) > 0){
			return $this->getFollowerData($response);
		}
		else{
			return ['error' => ['followers' => 'Você não tem nenhuma conexão.' ]];
		}
	}

	//Retorna dados dos followers
	private function getFollowerData($UserArray){

		$array = [];

		foreach ($UserArray as $value) {
			if( array_key_exists('to_id', $value)){
				$user = new User();
				$array[] = $user->get($value['to_id']);
				continue;
			}
		}

		return $array;

	}
    
}
