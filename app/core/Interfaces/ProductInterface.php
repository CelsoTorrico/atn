<?php

namespace Core\Interfaces;
use Core\Profile\User as User;

interface ProductInterface{

    public function getProduct($id);

    public function getListProduct(User $user, $id);

    public function getQuantityProduct(User $user);

    public function addProduct(User $user, $data);

    public function updateProduct(User $user, $id, $data);

    public function deleteProduct(User $user,  $ID);

    function updateProductStatus(User $user, $id, $data);

    function countActivitysByStatus(\Gafp\User $user, $dataConditional);

    function countApprovedPlansByStatus(\Gafp\User $user, $dataConditional);

}