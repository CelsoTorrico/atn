<?php

namespace Core\Utils;

use Core\Database\PostModel;
use Core\Database\UsermetaModel;

class VideoUrl {

    protected $model;
    protected $url;
    protected $ID;
    protected $postID;
    public    $filename;

    /** 
     * @param $userID   ID do author
     * @param $postID   ID do post_parent ou user photo 
     * @param $url      String da url de video a vincular
     * @param $type     Tipo de modelo a ser aplicado para inserção no banco
     * */
    public function __construct(int $userID, int $postID=null, string $url, string $type='learn'){
        
        //Inicializando variaveis
        $this->ID           = $userID;
        $this->postID       = $postID;
        $this->url          = $url;        
        $validTypes         = ['learn'];
        
        //Verifica se tipo é válido
        if (in_array($type, $validTypes)) {
            $this->type = $type;
        }        

    }

    /**
     * Insere uma url como post filho
     */
    public function insertUrl(){
        
        //Atribuindo caminho a var
        preg_match('#((https?|ftp)://(\S*?\.\S*?))([\s)\[\]{},;"\':<]|\.\s|$)#i', $this->url, $urlFile);

        //Se url não for válida
        if (count($urlFile) <= 0) {
            return false;
        }

        //Contruindo modelo e inserindo dados a cadastrar
        $this->defineModel($urlFile[0]);

        if ($this->model->isFresh()) {
            //Insere dados no banco e retorna true ou false
            return $this->model->save();
        }
        else{
            //Insere dados no banco e retorna true ou false
            return $this->model->update($this->model->columns());
        }        

    }

    /**
     * Preenche o modelo para atribuir os dados
     */
    private function defineModel(string $urlFile){
        
        //Se tipo não for definido não terminar execução
        if (is_null($this->type)) {
            return false;
        }

        //Atribui modelo correspondente
        switch ($this->type) {   
            default:
                $this->model = new PostModel();
                $this->model->post_author = $this->ID;
                $this->model->post_parent = $this->postID;
                $this->model->post_content = '';
                $this->model->post_type = 'attachment';
                $this->model->guid = $urlFile;
                $this->model->post_mime_type = 'text/plain';
                break;
        }

    }

}