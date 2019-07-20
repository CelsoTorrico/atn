<?php

namespace Core\Service;

use Core\Profile\User;
use Core\Profile\Login;
use Core\Service\Comment;
use Core\Utils\VideoUrl;

use Core\Database\PostModel;
use Core\Database\PostmetaModel;

class Learn extends Timeline {

    const TYPE = 'aprenda';

    /* Retorna lista de timeline */
    function getAll(int $paged = 0, array $filter = []){     

        //Retorna lista de usuário que está conectado
        $following = $this->following;

         //Qtd de itens por página
         $perPage = 24;

         //A partir de qual item contar
         $initPageCount = ($paged <= 1)? $paged = 0 : ($paged * $perPage) - $perPage;
 
         //Paginação de timeline
         $limit = [$initPageCount, $perPage];

        //TODO: Retorna todos posts de feed baseado nas conexões
        $allTimelines = $this->model->getIterator([
            'post_type'     =>  static::TYPE,
            'post_status'   => ['open', 'publish', '0'],
            'ORDER'         => ['post_date' => 'DESC'],
            'LIMIT'         => $limit
        ]);
        
        //Retorna resposta
        if( $allTimelines->count() > 0){

            //Array para retornar dados
            $timelines = [];
            
            foreach ($allTimelines as $key => $item) {

                //Verifica se é valido
                if ( !$allTimelines->valid() ) {
                    continue;
                }

                //Atribui dados do comentário
                $timelineData = $item->getData();

                $user = new User();
                $timelineData['post_author'] = $user->getMinProfile($item->post_author);

               //Inicializa classe de comentários passando ID do POST
                $comment = new Comment($item->ID);

                //Combina array timeline e comentários
                $timelines[$key] = array_merge($timelineData, [
                    'quantity_comments' => $comment->getQuantity()            
                ]); 

                //Se item tiver foto anexada
                if ($attach = $this->model->getInstance(['post_parent' => $item->ID, 'post_type' => 'attachment'])) {
                    $timelines[$key]['attachment'] = $attach->guid;
                }
                
            }

            //Retorna array de timelines
            return $timelines;
        } 
        else{
            //Retorna erro
            return ['error' => ['timeline', 'Nenhum item a exibir.']];
        }   
        
    }

    /* Adiciona um item de timeline */
    function add( $data ){
        return $this->register($data);
    }

    /* Atualiza um plano */
    function update( $data, $id){
        return $this->register($data, $id);
    } 

    private function register($data, $postID = null){

        //Filtrar inputs e validação de dados
        $filtered = [
            'post_title'    => filter_var($data['post_title'], FILTER_SANITIZE_STRING),
            'post_excerpt'  => filter_var($data['post_excerpt'], FILTER_SANITIZE_STRING),
            'post_content'  => filter_var($data['post_content'], FILTER_SANITIZE_STRING),
            'post_author'   => $this->currentUser->ID,
            'post_type'     => static::TYPE
        ];        

        //Verifica ID
        if( !is_null($postID) )
        {
            //Verifica se existe registro no BD
            $load = $this->model->load([
                'ID' => $postID, 
                'post_author' => $this->currentUser->ID
            ]);

            //Insere novo valor a coluna selecionada
            $this->model->post_title = $filtered['post_title'];

            //Insere novo valor a coluna selecionada
            $this->model->post_excerpt = $filtered['post_excerpt'];

            //Insere novo valor a coluna selecionada
            $this->model->post_content = $filtered['post_content'];

            //Insere novo valor a coluna selecionada
            $this->model->post_type = $filtered['post_type'];

            //Atualiza registro no banco e retorna true ou false
            $result = ($load) ? $this->model->update(['post_content', 'post_type']) : false;
        }
        else{
            
            //Preenche colunas com valores
            $this->model->fill($filtered); 

            //Salva novo registro no banco
            $result = $this->model->save();
        }

        //SE resultado for true, continua execução
        if ($result) {

            //Pega id da última inserção
            $lastInsert = $this->model->getPrimaryKey();

            //Se enviado tipo de visibilidade de post
            if (isset($data['post_visibility'])) {

                $visibility = (int) $data['post_visibility'];

                //Tipos de visibilidades do usuário
                $levels = parent::getVisibilityFields();

                if (!array_search($visibility, $levels)) {
                    return;
                }

                //Inicializando modelo
                $postmeta = new PostmetaModel();
                
                $postmeta->fill([
                    'post_id'       => $lastInsert['ID'],
                    'meta_key'      => 'post_visibility',
                    'meta_value'    => $visibility
                ]);

                //Atribui valor de visibilidade ao post
                $postmeta->save();

            }

            //Se enviado video junto com conteúdo
            if (isset($data['post_video_url'])) {

                $videoUrl = (string) $data['post_video_url'];

                //Inicializa classe de upload
                $video = new VideoUrl($this->currentUser->ID, $lastInsert['ID'], $videoUrl);

                //Enviar arquivo e insere no banco
                $insertResult = $video->insertUrl();   

            }

            //Verifica se existe objeto para upload
            if (isset($data['post_image']) && is_a($data['post_image'], 'Symfony\Component\HttpFoundation\File\UploadedFile')) {

                $file = $data['post_image'];

                //Inicializa classe de upload
                $upload = new FileUpload($this->currentUser->ID, $lastInsert['ID'], $file);

                //Enviar arquivo e insere no banco
                $upload->insertFile();           
            }

            //Mensagem de sucesso no cadastro
            return ['success' => ['learn' => 'Matéria "Aprenda" cadastrada!']];

        }
        else{
            //Mensagem de erro no cadastro
            return ['error' => ['register' => 'Houve erro na inserção do post! Tente novamente mais tarde.']];
        }
    }

}