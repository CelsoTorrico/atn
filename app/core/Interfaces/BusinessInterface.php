<?php

namespace Core\Interfaces;

interface BusinessInterface{

    public function getBusiness($data);

    public function getListBusiness($data);

    public function addBusiness($data);

    public function updateBusiness($data);

    public function deleteBusiness($data);

    public function getBusinessProducts();

    public function getBusinessComments();

}