<?php

namespace Core\Service;

use Core\Profile\User;
use Core\Profile\Login;
use Core\Service\Comment;
use Core\Utils\FileUpload;
use Core\Utils\VideoUrl;

use Core\Database\PostModel;
use Core\Database\PostmetaModel;
use Core\Database\CalendarTypeModel;

/**
 *  Função de CRUD de Calendários para Clubes
 *  
 *  @since 2.1
 */
class Calendar extends Timeline {

    const TYPE = 'calendar';

    /* Retorna lista de timeline */
    function getAll(int $paged = 0) {     

         //Qtd de itens por página
         $perPage = 4;

         //A partir de qual item contar
         $initPageCount = ($paged <= 1)? $paged = 0 : ($paged * $perPage) - $perPage;
 
         //Paginação de timeline
         $limit = [$initPageCount, $perPage];

        //Retorna todos posts de feed baseado nas conexões
        $allCalendars = $this->model->getIterator([
            'post_type'     =>  static::TYPE,
            'post_status'   => ['open', 'publish', '0'],
            'ORDER'         => ['post_date' => 'DESC'],
            'LIMIT'         => $limit
        ]);
        
        //Retorna resposta
        if( $allCalendars->count() > 0){

            //Array para retornar dados
            $calendars = [];
            
            foreach ($allCalendars as $key => $item) {

                //Verifica se é valido
                if ( !$allCalendars->valid() ) {
                    continue;
                }

                //Atribui dados do comentário
                $timelineData = $item->getData();

                $user = new User();
                $timelineData['post_author'] = $user->getMinProfile($item->post_author);

               //Inicializa classe de comentários passando ID do POST
                $comment = new Comment($item->ID);

                //Combina array timeline e comentários
                $calendars[$key] = array_merge($timelineData, [
                    'quantity_comments' => $comment->getQuantity()            
                ]); 

                //Instanciando modelo para gravação dos dados
                $metaModel = new PostmetaModel();

                //Retornando valores de postmeta
                $postmeta = $metaModel->getIterator([
                    'post_id'   => $item->ID, 
                    'meta_key'  => ['post_image', 'post_video_url', 'post_calendar_date', 'post_calendar_type', 'post_calendar_address', 'post_calendar_people']
                ]);

                //Atribuindo ao objeto Calendar
                foreach ($postmeta as $k => $v) {

                    //Verifica se é valido
                    if ( !$postmeta->valid() ) {
                        continue;
                    }

                    //Verifica se valor está em formato de array
                    if ($v->meta_key == 'post_calendar_date') {
                        //Decodifica array de banco
                        $calendars[$key]['post_meta'][$v->meta_key] = @unserialize($v->meta_value);
                    } else {
                        //Adiciona ao metadados ao array do item
                        $calendars[$key]['post_meta'][$v->meta_key] = $v->meta_value;
                    }
                    
                }

                //Se item tiver foto anexada
                if ($attach = $this->model->getInstance(['post_parent' => $item->ID, 'post_type' => 'attachment'])) {
                    $calendars[$key]['attachment'] = $attach->guid;
                }
                
            }

            //Retorna array de timelines
            return $calendars;
        } 
        else{
            //Retorna erro
            return ['error' => ['timeline', 'Nenhum item a exibir.']];
        }   
        
    }

    /** Retorna as opções de eventos a cadastrar */
    function getTypes() {
        
        //Inicializando classe de tipos
        $model = new CalendarTypeModel();
        
        //Retorna todos os tipos
        $types = $model->dump();

        //Retorna os tipos
        return $types;

    }

    /* Adiciona um item de timeline */
    function add( $data ) {
        return $this->register($data);
    }

    /* Atualiza um plano */
    function update( $data, $id) {
        return $this->register($data, $id);
    } 


    private function register(Array $data, int $postID = null) {

        //Se não for enviado nenhum dado, retornar mensagem
        if(count($data) <= 0) {
            //Mensagem de erro no cadastro
            return ['error' => ['calendar' => 'Nenhuma nova informação foi enviada.']];
        }

        //Filtrar inputs e validação de dados para PostModel
        $filtered = [
            'post_title'        => filter_var($data['post_title'], FILTER_SANITIZE_STRING),
            'post_excerpt'      => filter_var($data['post_excerpt'], FILTER_SANITIZE_STRING),
            'post_content'      => filter_var($data['post_content'], FILTER_SANITIZE_STRING),
            'post_author'       => (int) $this->currentUser->ID,
            'post_type'         => static::TYPE,
        ];        

        //Filtrar inputs e validação de dados para PostmetaModel
        $metaFiltered = [
            'post_visibility'   => (!empty($data['post_visibility']))? filter_var($data['post_visibility'], FILTER_SANITIZE_NUMBER_INT) : 0,
            'post_calendar_date' => filter_var_array($data['post_calendar_date'], FILTER_SANITIZE_STRING),
            'post_calendar_type' => filter_var($data['post_calendar_type'], FILTER_SANITIZE_NUMBER_INT),
            'post_calendar_address' => filter_var($data['post_calendar_address'], FILTER_SANITIZE_STRING),
            'post_calendar_people'  => (!empty($data['post_calendar_people']))? filter_var_array($data['post_calendar_people'], FILTER_SANITIZE_NUMBER_INT) : ''
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
            $result = ($load) ? $this->model->update(['post_title','post_excerpt', 'post_content', 'post_type']) : false;
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

            //Inseração de metadados
            foreach ($metaFiltered as $meta_key => $meta_value) {

                //Se não tiver valor a ser inserido pular para próximo no array
                if (empty($meta_value)) {
                    continue;
                }

                //Instanciando modelo para gravação dos dados
                $metaModel = new PostmetaModel();

                //Se enviado tipo de visibilidade de post
                if ($meta_key == 'post_visibility') {

                    //Tipos de visibilidades do usuário
                    $levels = parent::getVisibilityFields();

                    //Se não exitir o tipo de visibilidade
                    if (!array_search($meta_value, $levels)) {
                        return;
                    }
                }
                
                //Preencher modelo com os dados
                $metaModel->fill([
                    'post_id'       => $lastInsert['ID'],
                    'meta_key'      => $meta_key,
                    'meta_value'    => $meta_value
                ]);

                //Atribui valor de visibilidade ao post
                $metaModel->save();
                
                //Reseta variavel
                unset($metaModel);

            }

            //Se enviado video junto com conteúdo
            if (isset($data['post_video_url']) && !empty($data['post_video_url'])) {

                //Filtrando  url de video
                $videoUrl = filter_var($data['post_video_url'], FILTER_SANITIZE_URL);

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

            //Verifica se ID foi enviado = se é atualização
            if( !is_null($postID) )
            {
                //Mensagem de sucesso ao atualizar
                return ['success' => ['calendar' => 'Evento de calendário atualizado!']];   
            } else {
                //Mensagem de sucesso no cadastro
                return ['success' => ['calendar' => 'Novo evento de calendário cadastrada!']];
            }            

        }
        else{
            //Mensagem de erro no cadastro
            return ['error' => ['calendar' => 'Houve erro no cadastro de evento! Tente novamente mais tarde.']];
        }
    }


}