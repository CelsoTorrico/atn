<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Core\Profile\Login;
use Core\Profile\UserClub;
use Closure;

class ClubController extends Controller
{

    protected $club;
    
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(Request $request)
    {
        //Verifica se classe de usuário corresponde a necessária
        //User padrão
        $this->user = $request->user();
        
        //User Instituição
        $this->club = $this->isClass($request->user());
    }

    /**
     * Retorna lista de usuários que pertencem ao usuario master
     * 
     * @version 2.1 Adicionado argumento $filter (array) para filtragem
     * @since 2.0
     */
    function getAll(int $id = null, Request $request) {
        
        //Se for enviado dados de filtragem = POST Method
        if( $request->method() == 'POST') {            
            //Realiza a pesquisa
            return $this->search($request);
        };

        //Define tipo de visulização de usuário: visitante e logado
        if(!is_null($id)){
            $club = $this->user->getUser($id);
            if($club && $club->type['ID'] >= 3){
                $result = $club->getTeamUsers();
            }             
        } else {
            //Atribui resposta
            $result = $this->club->getTeamUsers();
        }
        
        //Retorna resposta
        return response()->json($result);
    }

    //Adiciona um usuário 
    function addClubUser(Request $request){

        //Verifica se é array ao invés de objeto
        if (is_array($this->club) && isset($this->club['error']) || is_null($this->club)) {
            return $this->club;
        }
        
        //Campos obrigatórios
        $require = ['display_name', 'user_email', 'user_pass', 'confirm_pass', 'type'];

        //Verifica se campos obrigatórios estão presentes
        if(!$request->has($require)) {
            return response(['error' =>["register", "Campos não submetidos! Tente novamente!"]]); 
        }

        //Verifica se campos obrigatórios estão presentes
        if(!$request->filled($require)) {
            return response(['error' =>["register", "Falta preencher campos obrigatórios!"]]); 
        }

        //Realiza cadastro e retorna resultado
        if( array_key_exists('error', $response = $this->club->addUser($request->all())) ){
            return response($response);
        }

        //Realiza o login
        return $response;
    }

    //Atualiza informações de usuário
    function updateUser(Request $request, int $id){

        //Verifica se é array ao invés de objeto
        if (is_array($this->club) && isset($this->club['error']) || is_null($this->club)) {
            return $this->club;
        }

        //Atualizando perfil
        $result = $this->club->updateUser($request->all(), $id);
        
        //Retorna resposta
        return response()->json($result);

    }

    /**
     * Remover um usuário como integrante da equipe
     * 
     * @version 2.1 - Removido a função de deletar permanentemente, agora apenas remove da equipe
     * @since 2.0
     * @param int $user_id - Id do usuário
     *  */
    function deleteUser(int $user_id) {

        //Redireciona para função de adicionar e remover usuários da classe atual
        return $this->setToTeam($user_id);

    }

    /**
     *  Adicionar ou remover usuário da equipe a partir do perfil visitado
     *  @since 2.1
     *  @param int $user_id - Id do usuário
     * 
     */
    function setToTeam(int $user_id){
        
        //Se zero, para execução
        if($user_id <= 0){
            return ['error' => ['user' => 'Usuário inexistente.']];
        }

        //Se usuário não tiver as permissões de instituição, retorna erro
        if(!is_a($this->club, 'Core\Profile\UserClub')) {
            return response()->json($this->club);
        }

        //Seta usuário na classe UserClub
        $result =  $this->club->setUserToTeam($user_id);

        //Retorna resposta
        return response()->json($result);
    }

    //Reativa um usuário
    function activeUser($id) {

        //Verifica se é array ao invés de objeto
        if (is_array($this->club) && isset($this->club['error']) || is_null($this->club)) {
            return $this->club;
        }

        //Atualizando perfil
        $result = $this->club->activeUser($id);
        
        //Retorna resposta
        return response()->json($result);
    }

    //Retorna Lista de clubes para alimentar selects
    function listClubs(){

        //Atualizando perfil
        $result = UserClub::getAllClubs();
        
        //Retorna resposta
        return response()->json($result);

    }

    /**
     * Função de pesquisa de membros da instituição
     * 
     * @since 2.1
     */
    private function search(Request $request, int $page = 0){
        //Atribui aos parametros de busca a segmentação para apenas usuarios membros da instituição
        $params = array_merge($request->all(), ['parent_user' => (int) $this->club->ID]);

        //Realiza a pesquisa e retorna a resposta
        return response()->json($this->club->searchUsers($params, $page));
    }

    /** 
     * Verifica se a classe é do tipo UserClub 
     * 
     * */
    private function isClass($class){
        //Verifica se é classe necessária
        if (!is_a($class, 'Core\Profile\UserClub')) {
            return ['error' => ['club' => 'Você não tem previlégio para acessar essas funcionalidades!']];
            exit;
        }

        //retorna classe
        return $class;
    }
    
}
