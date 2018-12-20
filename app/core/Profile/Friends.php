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
	private $validUsermeta;
	private $onlyKey;
	private $onlyIDS;
	private $filter;

	/**
	 * @param $id = Id do usuário
	 * @param $filter = Filtragem de usuário através de parametros adicionais
	 * @param $only_ids = Define de deve retornar apenas array de ID'S
	 */
	function __construct($id = null, $filter = array(), $only_ids = false){

		//Atribui id de usuario corrente
		$this->ID = $id; 
		$this->filter = $filter;
		$this->onlyIDS = $only_ids;
		$this->model = new FollowersModel();
		
		//List of valid input filters
        $this->validUsermeta = ['sport', 'clubes', 'type', 'city', 'state'];

	}
	
	//Retorna lista de usuários conecatdos
	public function get():Array{
		
		//Define parametros de busca de perfis
		$filter = array_merge(
			$this->validFilter($this->filter), 
			(!is_null($this->ID))? ['from_id' => $this->ID] : array()
		); 

		//Carrega array de relacionamentos IDS
		$friends = $this->model->getIterator($filter);
		$listFriends = [];

		foreach ($friends as $user ){

			//Verifica se é válido
			if (!$friends->valid()) {
				continue;
			}
			
			//Retorna apenas ids de usuário
			if ($this->onlyIDS) {
				$listFriends[] = $user->to_id;
				continue;
			}

			//Retorna dados completos dos usuários
			$listFriends[] = $this->getFollowerData($user->getData());

		}

		if (count($listFriends) > 0) {
			return $listFriends;
		} else {
			return ['error' => ['followers' => 'Você não tem nenhuma conexão.' ]];
		}
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

	//Retorna dados dos followers
	private function getFollowerData($userData){

		//Verifica se existe campo requirido
		if( !array_key_exists('to_id', $userData)){
			return;
		}

		//Instancia classe e retorna dados
		$user = new User();
		return $user->get($userData['to_id']);

	}
    
}
