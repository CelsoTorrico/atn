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

	private $id;
	private $model;
	private $userModel;
	private $usermetaModel;
	private $validUsermeta;

	function __construct($id, $filter = array()){

		//Atribui id de usuario corrente
		$this->ID = $id; 
		$this->model = new FollowersModel();
		
		//List of valid input filters
        $this->validUsermeta = array(
            'sport', 'type', 'city', 'state', 'country', 'gender'
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
		$response = $this->model->load(['from_id' => $this->ID]);

		if($response){
			return $this->model->getData();
		}
		else{
			return [];
		}
	}

	//Retornar apenas key selecionada em array
	function onlyKey($data, $only = 'ID'){

		$array = [];

		foreach ($data as $key => $value) {
			$array[] = $data[$only];
		}

		return $array;
	}

    
    /** V1 */
    public function following_action( $from_id = 0, $to_id = 0 ) {
		$request = (object) $_POST;
		if ( !$request->from_id || !$request->to_id ) return;

		$is_following = $this->is_following( $request->from_id, $request->to_id );

		if ( $is_following ) {
			$following = $this->remove_following( $request->from_id, $request->to_id );
		} else {
			$not_following = $this->create_following( $request->from_id, $request->to_id );
		}

		exit( json_encode( $following ? 'unfollow' : 'follow' ) );
	}

	public function create_following( $from_id = 0, $to_id = 0 ) {
		global $wpdb;
		$insert = $wpdb->query(
			sprintf( 'INSERT INTO %sfollowers (from_id, to_id) VALUES (%d, %d)', $wpdb->prefix, $from_id, $to_id )
		);

		return $insert;
	}

	public function remove_following( $from_id = 0, $to_id = 0 ) {
		global $wpdb;
		$remove = $wpdb->query(
			sprintf( 'DELETE FROM %sfollowers WHERE from_id = %d AND to_id = %d', $wpdb->prefix, $from_id, $to_id )
		);

		return $remove; 
	}

	public function is_following( $from_id = 0, $to_id = 0 ) {
		global $wpdb;
		$following = $wpdb->query(
			sprintf( 'SELECT * FROM %sfollowers WHERE from_id = %d AND to_id = %d', $wpdb->prefix, $from_id, $to_id )
		);

		return $following; 
	}

	public function followers_qty( $user_id ) {
		global $wpdb;
		$following = $wpdb->query(
			sprintf( 'SELECT * FROM %sfollowers WHERE to_id = %d', $wpdb->prefix, $user_id )
		);
		return $following;
	}

	public function followers_qty_obj( $user_id ) {
                global $wpdb;
                $following = $wpdb->get_results(
                        sprintf( 'SELECT * FROM %sfollowers WHERE to_id = %d', $wpdb->prefix, $user_id )
                );
                return $following;
        }

	public function following_by_role( $user_id, $role ) {
		global $wpdb;

		$following = $wpdb->get_results(
			"SELECT * FROM {$wpdb->prefix}followers as fl, {$wpdb->prefix}usermeta as um where fl.from_id = '{$user_id}' and fl.to_id = um.user_id and um.meta_key = '{$wpdb->prefix}capabilities' AND um.meta_value like '%{$role}%'"
		);

		// AND from_id IN (SELECT user_id FROM '.$wpdb->prefix.'usermeta WHERE meta_key = "at_capabilities" and meta_value LIKE "%'.$role.'%")
		return $following; 
	}

	public function followers_qty_by_role( $user_id, $role ) {
		global $wpdb;

		$following = $wpdb->get_results(
			"SELECT * FROM {$wpdb->prefix}followers as fl, {$wpdb->prefix}usermeta as um where fl.to_id = '{$user_id}' and fl.from_id = um.user_id and um.meta_key = '{$wpdb->prefix}capabilities' AND um.meta_value like '%{$role}%'"
		);

		// AND from_id IN (SELECT user_id FROM '.$wpdb->prefix.'usermeta WHERE meta_key = "at_capabilities" and meta_value LIKE "%'.$role.'%")

		return $following; 
	}
    
    //Login através das redes sociais
    public function add(){

    }
    
    //Login através das redes sociais
    public function delete(){

    }
}
