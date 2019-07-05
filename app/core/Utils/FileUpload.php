<?php

namespace Core\Utils;


use Symfony\Component\HttpFoundation\File\UploadedFile;
use Core\Database\PostModel;
use Core\Database\UsermetaModel;
use Illuminate\Support\Facades\Storage;

class FileUpload {

    protected $model;
    protected $fileClass;
    protected $ID;
    protected $postID;
    public    $filename;
    public    $mimeType;
    public    $lastInsertFileUrl;

    private $disk;

    /** 
     * @param $postID  ID do post_parent ou user photo 
     * @param $fileClass Classe de UploadFile referenciada no controller
     * @param $type Tipo de modelo a ser aplicado para inserção no banco
     * */
    public function __construct(int $userID, int $postID=null, UploadedFile $fileClass=null, string $type='timeline'){

        //Definindo storage do arquivo >> AMAZON S3
        $this->disk = Storage::disk('s3');
        
        //Inicializando variaveis
        $this->ID           = $userID;
        $this->postID       = $postID;
        $this->fileClass    = $fileClass;        
        $validTypes         = ['timeline', 'learn', 'profile_img', 'pdf', 'report'];
        
        //Verifica se tipo é válido
        if (in_array($type, $validTypes)) {
            $this->type = $type;
        }        

    }

    public function insertFile(){
        
        //Atribuindo caminho a var
        $this->lastInsertFileUrl = $this->moveDirectory();
        $urlFile = $this->lastInsertFileUrl;

        //Contruindo modelo e inserindo dados a cadastrar
        $this->defineModel($urlFile);

        if ($this->model->isFresh()) {
            //Insere dados no banco e retorna true ou false
            return $this->model->save();
        }
        else{
            //Insere dados no banco e retorna true ou false
            return $this->model->update($this->model->columns());
        }
        

    }

    private function defineModel(string $urlFile){
        
        //Se tipo não for definido não terminar execução
        if (is_null($this->type)) {
            return false;
        }

        //Atribui modelo correspondente
        switch ($this->type) {   
            case 'profile_img':
                $this->model  = new UsermetaModel();
                $this->model->user_id = $this->ID;
                $this->model->meta_key = 'profile_img';
                $this->model->meta_value = $urlFile;
                break;
            case 'report':
                $this->model  = new UsermetaModel();
                $this->model->user_id = $this->ID;
                $this->model->meta_key = 'report';
                $this->model->meta_value = $urlFile;
                break;
            default:
                $this->model = new PostModel();
                $this->model->post_author = $this->ID;
                $this->model->post_parent = $this->postID;
                $this->model->post_content = '';
                $this->model->post_type = 'attachment';
                $this->model->guid = $urlFile;
                $this->model->post_mime_type = $this->mimeType;
                break;
        }

    }


    private function moveDirectory() {

        //Atribui classe a arquivo
        $file = $this->fileClass;
        
        //data atual para inserção do arquivo
        $date = date('Y/m/d');

        //Atribuindo informações de arquivo nas variaveis de classe
        $this->filename = $file->getClientOriginalName();
        
        //mime-type
        $this->mimeType = $file->getMimetype();

        //Diretório para upload do arquivo
        $dir = env('APP_FILES').$date;

        $result = $this->disk->put($dir, $file, 'public');

        //Se falso, retorna falso
        if(!$result){
            return false;
        }

        //Atribui url do arquivo
        $url = $this->disk->url($result);

        //Retorna caminho onde arquivo foi inserido
        return $url;
    }

}