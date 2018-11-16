<?php

namespace Core\Interfaces;

use Core\User as User;

interface BadgeInterface{

    /* GETS */
    /**
     * Get badge by id
     *
     * @return array[]
     */
    public function getBadge(User $user, $id);

    public function getListBadge(User $user, $order);

    /* ADD */    
    public function addBadge(User $user, $data);

    /* UPDATE */
    public function updateBadge(User $user, $id, $data);

    /*DELETE*/
    public function deleteBadge(User $user, $id);

}