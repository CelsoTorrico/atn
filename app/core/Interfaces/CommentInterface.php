<?php

namespace Core\Interfaces;

interface CommentInterface{

    public function getComment();

    public function getListComment();

    public function getQuantityComment();

    public function addComment();

    public function updateComment();

    public function deleteComment();

}