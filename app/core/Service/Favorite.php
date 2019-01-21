<?php

namespace Core\Service;

use Core\Profile\User;
use Core\Service\Notify;
use Core\Database\FavoriteModel;
use Core\Utils\DataConverter;
use Illuminate\Http\Request;

class Favorite {

    protected $model;
    protected $currentUser;

    public function __construct($user){
        
        $this->model = new FavoriteModel();
        $this->currentUser = $user;

        //Retorna classe usuário ou retorna erro
        if( is_null($this->currentUser) ){
            return ['error' => ['favorite' => 'Você não tem permissão.']];
        }

    }

    /** Retornar todos os seguidores */
    public function getFavorites(){

        //Filtrar inputs e validação de dados
        $favoriteData = [
            'from_id'     => $this->currentUser->ID,
        ];

        //Insere dados no modelo
        $favoriters = $this->model->getIterator($favoriteData);
        
        //Inicializando lista de diferentes tipos de favoritos
        $list = [
            'Atletas'   => [],
            'Clubes'    => [],
            'Outros'    => []
        ];


        //Iterar sobre os seguidores
        foreach ($favoriters as $item) {
            
            if (!$favoriters->valid()) {
                continue;
            }
            
            //Retorna dados
            $item = $item->getData();

            
            //Instanciando classe usuário
            $user = new User();

            //Atribui dados de usuário ao array
            $currentFavorite = $user->getMinProfile($item['to_id'], ['type']);

            //ID de tipo de usuário
            if (!array_key_exists('type', $currentFavorite)){
                $type = $user->getUserType($currentFavorite['ID']);
            }
            else{
                $type = (int) $currentFavorite['type'];
            }            

            //Atribui favoritos em respectiva lista
            switch ($type) {
                case 1:
                    $list['Atletas'][] = $currentFavorite;
                    continue; 
                case 4:
                    $list['Clubes'][] = $currentFavorite;
                    continue;
                default:
                    $list['Outros'][] = $currentFavorite;
                    continue;
            } 
        }       

        return $list;

    }

    /** Começar a seguir */
    public function defineFavorite(int $user_id){

        //Se zero, para execução
        if($user_id <= 0){
            return ['error' => ['favorite' => 'Usuário inexistente.']];
        }

        //Filtrar inputs e validação de dados
        $favoriteData = [
            'to_id'   => $user_id,
            'from_id'     => $this->currentUser->ID
        ];

        //Insere dados no modelo
        $exist = $this->model->load($favoriteData);

        //Se existir, remove seguir
        if($exist) {
            return $this->removefavorite($this->model);
        }
        
        //Continua a inserção, insere dados no modelo
        $this->model->fill($favoriteData);

        //Insere data no banco
        if ( $this->model->isFresh() ) {
            $result = $this->model->save();
        }
        else{
            $result = $this->model->delete();
        }        

        if($result){
            //Registra notificação para seguido
            $notify = new Notify($this->currentUser);
            $notify->add(4, $user_id, $this->currentUser->ID);
            
            //Mensagem de sucesso no cadastro
            return ['success' => ['favorite' => 'Você favoritou esse usuário!']];
        }
        else{
            //Mensagem de erro no cadastro
            return ['error' => ['favorite' => 'Houve erro! Tente novamente mais tarde.']];
        }
    }

    /** Deixar de seguir */
    private function removeFavorite($model){

        //Salva os dados no banco
        $result = $model->delete();

        //SE resultado for true, continua execução
        if ($result) {
            //Mensagem de sucesso no cadastro
            return ['success' => ['favorite' => 'Este usuário foi excluído dos favoritos!']];
        } else {
            //Mensagem de erro no cadastro
            return ['error' => ['favorite' => 'Houve erro! Tente novamente mais tarde.']];
        }
    }

}