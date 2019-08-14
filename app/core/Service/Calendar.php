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
use Illuminate\Http\UploadedFile;

/**
 *  Função de CRUD de Calendários para Clubes
 *  
 *  @since 2.1
 */
class Calendar extends Timeline {

    const TYPE = 'calendar';

    /**
     * Retorna apenas um item
     * @param int $ID   Item de evento a ser retornado
     * @since 2.1
     */
    function get(int $ID) {
        
        //REtorna array com item selecionado
        $eventArray = $this->getAll(1, ['ID' => $ID]);

        //Se há erro, retornar var
        if(key_exists('error', $eventArray)) {
            return $eventArray;
        }

        //Instanciando classe de comentário
        $comment = new Comment($ID);

        //Combina array com comentários e likes
        $eventArray = array_merge($eventArray[0], [
            'list_comments' => $comment->getAll()
        ]);

        //Retorna primeiro item
        return $eventArray;
    }

    /* Retorna lista de timeline */
    function getAll(int $paged = 0, array $filter = ['' => '']) {     

        //Retorna lista de usuário que está conectado
        $following = $this->following;

         //Qtd de itens por página
         $perPage = 4;

         //A partir de qual item contar
         $initPageCount = ($paged <= 1)? $paged = 0 : ($paged * $perPage) - $perPage;
 
         //Paginação de eventos
         $limit = [$initPageCount, $perPage];

         //Atribuir todos itens de timeline
        $allCalendars   = [];

        //Localiza posts com determinada visibilidade
        $visibilityPosts = [
            'postmeta.meta_key'      => 'post_visibility',
            'postmeta.meta_value'    => [(int) $this->currentUser->type['ID']]
        ];

        /**
         * Atribuir posts de clubes na requisição de timelines
         * @since 2.1
         */
        if(count($this->currentUser->clubs) > 0) {
            foreach ($this->currentUser->clubs as $key => $value) {
                if (!key_exists('ID', $value)) continue;
                //Adiciona ao filtro para localizar posts de clubes que pertence
                $visibilityPosts['postmeta.meta_value'][] = (int) $value['ID'];
            }
        }

        //Retorna todos posts de feed baseado nas conexões
        $db = $this->model->getDatabase();

        //Atribui filtro para pesquisa de tl de perfis que segue
        $following = (count($following) > 0)? ['posts.post_author' =>  $following] : ['posts.post_author[!]' => ''];

        //Retorna todos posts de feed baseado nas conexões
        $allCalendars = $db->select('posts', 
            ['[><]postmeta' => ['ID' => 'post_id']],
            ['posts.ID'], 
            [ 
                'posts.post_type'     => static::TYPE,
                'posts.post_status'   => [
                    'open', 'publish', '0'
                ],
                'OR'   => array_merge($following, [
                    'AND'   => $visibilityPosts,
                    'AND'   => $filter
                ]),               
                'LIMIT'  => $limit,
                'ORDER'  => ['posts.post_date' => 'DESC'],
                'GROUP'  => 'posts.ID'
            ]);
        
        //Retorna resposta
        if( count($allCalendars) > 0){

            //Array para retornar dados
            $calendars = [];
            
            foreach ($allCalendars as $key => $item) {

                //Carrega modelo
                $this->model->load(['ID' => $item['ID']]);

                //Atribui dados do modelo
                $timelineData = $this->model->getData();

                //Verifica se usuário tem permissão de enxergar post
                if (!$this->isVisibility()) {
                    continue;
                }

                //Verifica se usuário tem permissão de enxergar post
                if (key_exists('post_author', $filter) && !$this->isVisibility($filter['post_author'])) {
                    continue;
                }

                $user = new User();
                $timelineData['post_author'] = $user->getMinProfile($timelineData['post_author']);

               //Inicializa classe de comentários passando ID do POST
                $comment = new Comment($timelineData['ID']);

                //Combina array timeline e comentários
                $calendars[$key] = array_merge($timelineData, [
                    'quantity_comments' => $comment->getQuantity(),
                    'has_like' => $this->like->isPostLiked($timelineData['ID'])             
                ]); 

                //Instanciando modelo para gravação dos dados
                $metaModel = new PostmetaModel();

                //Retornando valores de postmeta
                $postmeta = $metaModel->getIterator([
                    'post_id'   => $timelineData['ID'], 
                    'meta_key'  => ['post_image', 'post_video_url', 'post_visibility', 'post_calendar_date', 'post_calendar_type', 'post_calendar_address', 'post_calendar_people']
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

                    } elseif ($v->meta_key == 'post_calendar_type') {
                        
                        //Retorna o tipo de calendário em formato legivel
                        $calendars[$key]['post_meta'][$v->meta_key] = [ $v->meta_value,  $this->_getCalendarTypeName((int) $v->meta_value)];

                    } else {
                        
                        //Adiciona ao metadados ao array do item
                        $calendars[$key]['post_meta'][$v->meta_key] = $v->meta_value;
                    }
                    
                }

                //Se item tiver mídias anexadas
                $attachModel = new PostModel();
                if ($attachAll = $attachModel->getIterator(['post_parent' => $timelineData['ID'], 'post_type' => 'attachment'])) {
                    
                    foreach ($attachAll as $attachItem) {
                        
                        //Verifica se é valido
                        if ( !$attachAll->valid() ) {
                            continue;
                        }

                        //Atribuindo arquivo inserido
                        $calendars[$key]['attachment'][] = $attachItem->guid;

                    }

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

    /** 
     * Retorna as lista de tipos de eventos a cadastrar 
     * 
     * @since 2.1
     * */
    function getTypes() {
        
        //Inicializando classe de tipos
        $model = new CalendarTypeModel();
        
        //Retorna todos os tipos
        $types = $model->dump();

        //Retorna os tipos
        return $types;

    }

    /** 
     * Retorna tipo de calendário em forma legível 
     * 
     * @param int $typeID   Id de tipo 
     * @since 2.1
     * */
    private function _getCalendarTypeName(int $typeID) {
        
        $model = new CalendarTypeModel(['ID' => $typeID]);

        return $model->type;

    }

    /**
     * Adiciona um item de Evento
     * 
     * @param array $data   Array de valores a ser inserido na criação do evento
     * */
    function add( $data ) {
        return $this->register($data);
    }

    /**  
    *   Atualizar um Evento
    */
    function update( $data, $id) {
        return $this->register($data, $id);
    } 

    private function register(Array $data, int $postID = null) {

        //Se não for enviado nenhum dado, retornar mensagem
        if(count($data) <= 0) {
            //Mensagem de erro no cadastro
            return ['error' => ['calendar' => 'Nenhuma nova informação foi enviada.']];
        }

        //Formata data e horário enviado em array
        if (!empty($data['post_calendar_date']))
            $data['post_calendar_date'] = explode(',', $data['post_calendar_date']); 

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
                    
                    //Verifica se visibilidade definida é válido para usuário
                    foreach ($levels as $key => $value) {
                        //Adiciona valor de visibilidade encontrado
                        if( (int) $meta_value == $value['value']) {
                            //Se encontrado, adiciona e para lopping
                            $meta_value = (int) $value['value']; 
                            break; 
                        }
                        
                    }

                    //Se não exitir o tipo de visibilidade, insert valor padrão
                    if(is_null($meta_value) || $meta_value < 0) 
                        $meta_value = 0;              
                }
                
                //Preencher modelo com os dados
                $metaModel->fill([
                    'post_id'       => $lastInsert['ID'],
                    'meta_key'      => $meta_key,
                    'meta_value'    => $meta_value
                ]);

                //Verifica se item é existente no banco
                if($metaModel->isFresh()) {
                    //Atribui novo valor no banco
                    $metaModel->save();
                } else {
                    //Faz update de valores no banco
                    $metaModel->update(['post_id', 'meta_key', 'meta_value']);
                }              
                
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

            //Cria arquivo 'ics' e adicionando ao post como attachment
            $this->setIcs($lastInsert['ID'], $filtered['post_title'], $sameday = $metaFiltered['post_calendar_date'][0].$metaFiltered['post_calendar_date'][1], $sameday, $filtered['post_content'], $metaFiltered['post_calendar_address']);

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

    /** 
     * Setando dados para criação de arquivo ics 
     * @since 2.1
     * */
    private function setIcs(int $post_id, string $title, string $start = '', string $end = '', string $description = '', string $location = '') {

        $name = 'calendar_event_'.$post_id;
        $dataMerged = "BEGIN:VCALENDAR\nVERSION:2.0\nMETHOD:PUBLISH\nBEGIN:VEVENT\nDTSTART:".date("Ymd\THis\Z", strtotime($start))."\nDTEND:".date("Ymd\THis\Z", strtotime($end))."\nLOCATION:".$location."\nTRANSP: OPAQUE\nSEQUENCE:0\nUID:\nDTSTAMP:".date("Ymd\THis\Z")."\nSUMMARY:".$title."\nDESCRIPTION:".$description."\nPRIORITY:1\nCLASS:PUBLIC\nBEGIN:VALARM\nTRIGGER:-PT10080M\nACTION:DISPLAY\nDESCRIPTION:Reminder\nEND:VALARM\nEND:VEVENT\nEND:VCALENDAR\n";

        return $this->saveIcsFile($post_id, $name, $dataMerged);
    }
    
    /** 
     * Retornando link do arquivo ics 
     * @since 2.1
     * */
    private function saveIcsFile(int $post_id, string $name, string $data) {
        $filepath = env('APP_IMAGES').$name.".ics";
        if( file_put_contents($filepath, $data)){
            
            //Inicializa classe UploadedFile
            $file = new UploadedFile($filepath, $name, 'text/calendar');
            
            //Inicializa classe de upload
            $upload = new FileUpload($this->currentUser->ID, $post_id, $file, 'ics');
            
            //Insere arquivo em servidor
            $upload->insertFile();
        }
        
        
    }

}