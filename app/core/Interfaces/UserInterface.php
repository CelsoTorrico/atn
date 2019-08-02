<?php

namespace Core\Interfaces;

interface UserInterface {

    /* GETS */
    /**
     * Get badge by id
     *
     * @return array[]
     */
    public function getUser( $filter);

    public function getFriends( $filter);

    /* ADD */    
    public function addUser($id, $data);

    /* UPDATE */
    public function updateUser($id, $data);

    /*DELETE*/
    public function deleteUser($id);

    public function hasPermission();

    public function notAuthorized();

    public function updateBiography();

    public function updateFormation();

    public function updateTitulos();

    public function updateMyVideos();

    public function updateEstatisticas();

    public function updatePersonalData();

    public function registerUser();

}