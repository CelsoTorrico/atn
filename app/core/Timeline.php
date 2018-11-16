<?php

namespace Core;

use Core\Profile\User as User;
use Core\Connect as Connect;
use Core\Interfaces\ProductInterface as ProductInterface;

class Timeline implements ProductInterface {

    public static $pdo;
    protected static $validTypeData;

    /** V1 */
    public function __construct() {
		$this->user_id = get_current_user_id();
	}

	public static function get_current_user_timeline_posts( $user_id = 0, $limit = 20 ) {
		global $wpdb;
		$posts = $wpdb->get_results( "SELECT * FROM at_posts WHERE post_type = 'timeline' and post_author = {$user_id} ORDER BY post_date DESC LIMIT {$limit}" );
		return !empty( $posts ) ? $posts : false;
    }
    /** /V1 */


    function __contruct(){
        self::$pdo = new Connect();
        self::$TypeData = self::$pdo::$validTypeData;
    }

    /* Retorna lista de planos */
    function getProduct($id){
        
        //Verificação do tipo de data
        if ( ! self::$TypeData->validInt($id) ) {
            //TODO: Implementar essa função de retorno
            return 'formato de data não permitido';
        }

        $result = $this::$pdo->get( 'product',
        [   '[>]visibility'  => ['visibility_id' => 'ID'],
            '[>]category'    => ['category_id' => 'ID'],
            '[>]user'        => ['user_id' => 'ID'],  
            '[>]business'    => ['business_id' => 'ID']  
        ],[ 
            'visibility.name(visibility)','category.name(category)','user.name(user)', 'business.name(business)'
        ],
        [   'product.ID' => $id ]);

        //Interar sobre cada plano e retornar atividades e agregar ao array        
        //$result['activitys'] = $this->getListActivityPlan($user, $id);         

        return $result;
    }

    /* Retorna lista de planos */
    function getListProduct(User $user, $id){
        
        $this->user_has_access($user);        
        
        $result = $this->pdo->select('plan', [
            '[>]project' => ['project' => 'id'],
            '[>]status'  => ['status' => 'id']            
        ],[
            'plan.id', 'plan.name', 'plan.because', 'plan.who', 'status.status(statusText)',
            'project.date_plan(datePlan)', 'project.date_approver(dateApprover)', 'project.date_max(dateFinal)'
        ],[
            'plan.owner' => $id,
            'plan.status[!]' => 3
        ]);

        //Interar sobre cada plano e retornar atividades e agregar ao array
        foreach ($result as $key => $value) {
            $result[$key]['activitys'] = $this->getListActivityPlan($user, $value['id']);
        }        

        if(! $result):
            return false;
        else:
            //Retorna dados de usuário
            return $result;            
        endif;
    }

    /* Retorna lista de planos para os aprovadores */
    function getQuantityProduct(User $user){
        
        $this->user_has_access($user); //Verifica acesso
        $current = $user->currentUser(); //Retorna dados do usuário atual

        //Retorna lista de aprovadores
        $approvers = $this->pdo->get('project',['approvers[Object]'],['id' => $current['project']]);

        if(!in_array($current['id'], $approvers['approvers'])){
            return false;
        }
        
        $result = $this->pdo->select('plan', [
            '[>]users'   => ['owner'     => 'id'], 
            '[>]status'  => ['status' => 'id'],
            '[>]project' => ['project' => 'id'],            
        ],[
            'plan.id', 'plan.name', 'plan.because', 'plan.who', 
            'status.status(statusText)', 'users.username',
            'project.date_plan(datePlan)', 'project.date_approver(dateApprover)', 'project.date_max(dateFinal)'
        ],[
            'plan.project' => $current['project'],
            'plan.status[!]' => 3
        ]);

        //Interar sobre cada plano e retornar atividades e agregar ao array
        foreach ($result as $key => $value) {
            $result[$key]['activitys'] = $this->getListActivityPlan($user, $value['id']);
        }        

        if(! $result):
            return false;
        else:
            //Retorna dados de usuário
            return $result;            
        endif;
    }    

    /*####### ADD ######## */

    /* Adiciona um novo projeto */
    function addProduct( User $user, $data){
        
        $this->user_has_access($user); //Verifica permissão
        $current = $user->currentUser(); //Retorna dados do usuário atual

        //Insere os dados obtidos anteriormente
        $result = $this->pdo->insert('plan', [ 
            'project'       => filter_var($current['project'], FILTER_SANITIZE_NUMBER_INT),
            'name'          => filter_var($data['name'], FILTER_SANITIZE_STRING),            
            'because'       => filter_var($data['because'], FILTER_SANITIZE_STRING),
            'place'         => filter_var($data['place'], FILTER_SANITIZE_STRING),
            'moment'        => $this->data_converter_to_insert($data['moment']),
            'who'           => filter_var($data['who'], FILTER_SANITIZE_STRING),
            'how'           => filter_var($data['how'], FILTER_SANITIZE_STRING),
            'cost'          => filter_var($data['cost'], FILTER_SANITIZE_STRING),
            'owner'         => filter_var($current['id'], FILTER_SANITIZE_NUMBER_INT)
        ]);

        //Retorna ID
        $idResult = $this->pdo->id();

        //Se existir atividades adicionadas
        if(isset($data['activitys']) && is_array($data['activitys'])){
            $activityResult = $this->pdo->update('activity', [
                'plan' => $idResult
            ],[
                'id' => filter_var_array($data['activitys'], FILTER_SANITIZE_NUMBER_INT)
            ]);
        }
        
        //Retorna resultado
        if(isset($idResult) && $idResult > 0){
            return array('type' => 'success', 'msg' => 'Plano criado com sucesso! ID: ' . $idResult);
        }
        else{
            return array('type' => 'danger', 'msg' => 'Não foi possível criar o plano, tente novamente.');
        }

    }

    // UPDATE  ############################################

    /* Atualiza um plano */
    function updateProduct( User $user, $id, $data){
        
        $this->user_has_access($user);

        //Insere os dados obtidos anteriormente
        $result = $this->pdo->update('plan', [ 
            'name'          => filter_var($data['name'], FILTER_SANITIZE_STRING),            
            'because'       => filter_var($data['because'], FILTER_SANITIZE_STRING),
            'place'         => filter_var($data['place'], FILTER_SANITIZE_STRING),
            'moment'        => $this->data_converter_to_insert($data['moment']),
            'who'           => filter_var($data['who'], FILTER_SANITIZE_STRING),
            'how'           => filter_var($data['how'], FILTER_SANITIZE_STRING),
            'cost'          => filter_var($data['cost'], FILTER_SANITIZE_STRING)
        ],['id' => $id]);

        //Se existir atividades adicionadas
        if(isset($data['activitys']) && is_array($data['activitys'])){
            $activityResult = $this->pdo->update('activity', [
                'plan' => $id
            ],[
                'id' => filter_var_array($data['activitys'], FILTER_SANITIZE_NUMBER_INT)
            ]);
        }

        //Retorna resultado
        if(isset($result) && !is_null($result)){
            return array(
            'type' => 'success', 
            'msg' => 'Plano atualizado com sucesso!');
        }
        else{
            return array(
            'type' => 'danger', 
            'msg' => 'Não foi possível atualizar o plano, tente novamente.');
        }

    }  

    // DELETE #############################################

    /* Deletar um plano */
    function deleteProduct( User $user,  $ID){
        
        $this->user_has_access($user); //Verifica permissão

        //Contruindo Query
        $result = $this->pdo->delete('plan',['id' => $ID]);
        
        //Retorna resultado
        if(is_object($result) && $result){
            return array('type' => 'success', 'msg' => 'Plano deletado.');
        }
        else{
            return array('type' => 'danger', 'msg' => 'Não foi possível deletar o plano. Tente novamente.');
        }
    }

    function updateProductStatus(User $user, $id, $data){
        
        $this->user_has_access($user);
        
        //Insere os dados obtidos anteriormente
        $result = $this->pdo->update('plan', ['status' => $data['status']],['id' => $id]);

        //Retorna resultado
        if(isset($result) && !is_null($result)){
            return array(
            'type' => 'success', 
            'msg' => ($data['status'] == 3)? 'Plano aprovado!' : 'Plano reaberto!');
        }
        else{
            return array(
            'type' => 'danger', 
            'msg' => 'Não foi possível aprovar o plano, tente novamente.');
        }
    } 

    ////// Lógica das Regras ///////////////////////

    private function ruleLogic($ruleDates, $planDeadline){

        //var de definição
        $status  = array(
            'warning' => array('badge' => 'warning', 'msg' => _WARNING_), 
            'danger'  => array('badge' => 'danger',  'msg' => _DANGER_), 
            'normal'  => array('badge' => 'normal',  'msg' => _PROGRESS_) 
        );
        $final = $status['normal']; //Status padrão a retornar

        //Se plano não tiver data definida
        if(empty($planDeadline)){
            //Retorna status do plano e atividade
            return $final;
        }

        $rule = unserialize($ruleDates); //deserializa dados
        $warning = $rule['warning']; //definições de alerta
        $danger  = $rule['danger']; //definições em atraso
        //Trasforma data em tipo "Data"
        $deadline = date_create($planDeadline);
        $currentDate = date_create();
        $interval = [];
        
        //Alerta
        if( !empty($warning) ){            
            $interval['warning'] = $this->date_conditional($warning, $deadline); //converte em data
        }
        
        //Em atraso
        if( !empty($danger) ){            
            $interval['danger'] = $this->date_conditional($danger, $deadline); //converte em data
        }
        
        //Se farol 'warning' for maior que a data atual
        if( isset($interval['warning']) && $currentDate >= $interval['warning'] && $currentDate < $interval['danger'] ){
            return $status['warning'];
            die();
        }
        //Se farol 'danger' for maior que a data atual
        else if(isset( $interval['danger']) && $currentDate >= $interval['danger']){
            return $status['danger'];
            die();
        }
        else{
            //Retorna status do plano e atividade
            return $final;
        }
        
    }

    /* Função de conversão de data */
    private function date_conditional($date_array, $date){

        //qtd de horários
        //'h' = 1 horas, 'd' = 24horas, 'm' = 720horas
        $qtdConvert = array('h' => 3600, 'd' => 86400, 'm' => 2592000 );
        $deadline = strtotime($date->format('Y-m-d')); //Converte data final timestamp

        if($date_array['conditional'] == 1){ //Após
            $dateDefined = ($date_array['qtd'] * $qtdConvert[$date_array['types']['identificador']]);
            return date_create(date('Y-m-d', $deadline + $dateDefined)); //calculo data atual mais horas definidas
        }
        else{ //Antes
            $dateDefined = ($date_array['qtd'] * $qtdConvert[$date_array['types']['identificador']]);
            return date_create(date('Y-m-d', $deadline - $dateDefined)); //calculo data atual mais horas definidas
        }
    }

    private function countStatus($planArray){

        //Definindo valores padrões
        $status['warning'] = ['badge' => _WARNING_, 'value' => 0];
        $status['danger']  = ['badge' => _DANGER_, 'value' => 0];
        $status['default'] = ['badge' => _PROGRESS_, 'value' => 0];

        //Contagem de itens
        foreach ($planArray as $key => $value) {
            switch ($value['rules']['msg']) {
                case _WARNING_:
                    $status['warning']['value'] = $status['warning']['value'] + 1;
                    break;
                case _DANGER_:
                    $status['danger']['value'] = $status['danger']['value'] + 1;
                    break;
                case _PROGRESS_:
                    $status['default']['value'] = $status['default']['value'] + 1;
                    break;
                default:
                    continue;
                    break;
            }
            
        }  

        return $status;
    }

    /* ######## Gráficos ########################*/

    /* Conta planos para montar gráficos */
    function countActivitysByStatus(\Gafp\User $user, $dataConditional){
        
        $this->user_has_access($user);

        $status = [
            'owner' => array(),
            'leader' => array()
        ];

        //Condição
        $condition = [
            'activity.project'  => $dataConditional['project'],
            'plan.status'   => 1
        ];

        //Colunas padrões a retornar
        $columns = [
            '[>]plan'           => ['plan'      => 'id'],
            '[>]rule_define'    => ['project'   => 'project']             
        ];

        //Adiciona condições especificas
        if( isset($dataConditional['column']) ){
            $condition[$dataConditional['column']] = $dataConditional['value'];
        }

        //Adiciona condições especificas para usuário
        if( isset($dataConditional['user']) ){
            //Adiciona condição
            $condition['plan.owner'] = $dataConditional['user']; 
            //Pega lista de planos de funcionarios e converte em status
            $leadersPlan = $this->getListLeaderPlans($user, $dataConditional['user']);
            //Retorna qtd de alertas de planos            
            if(is_array($leadersPlan)): 
                $leadersActivitys = [];
                //Percorre array de planos e adiciona as atividades de cada a um novo array
                foreach ($leadersPlan as $key => $value) {
                    
                    //Valida se key contém array com valor maior que 0
                    if(!is_array($value['activitys']) && count($value['activitys']) <= 0)
                        continue;

                    foreach ($value['activitys'] as $chave => $valor) {
                        array_push($leadersActivitys, $valor);
                    }                    
                }
                //Faz a contagem por tipo de alerta
                $status['leader'] = $this->countStatus($leadersActivitys); 
            else: 
                $status['leader'] = false; 
            endif;
        }

        //Query
        $result = $this->pdo->select('activity', $columns, [
            'activity.moment','rule_define.rules(rules)'
        ], $condition);

        //Adiciona os alertas
        foreach ($result as $key => $value) {
            $result[$key]['rules'] = $this->ruleLogic($result[$key]['rules'], 
            $result[$key]['moment']);
        }

        //Retorna qtd de alertas de atividades
        $status['owner'] = $this->countStatus($result);        

        if(! $status):
            return false;
        else:
            //Retorna dados de usuário
            return $status;            
        endif;
    }

    /* Conta planos para montar gráficos */
    function countApprovedPlansByStatus(\Gafp\User $user, $dataConditional){
        
        $this->user_has_access($user);

        //condição
        $condition = [
            ':id' => $dataConditional['project']
        ];

        //Retorna qtd de itens por status
        $result = $this->pdo->query("SELECT count(plan.status) AS value, status.status AS badge FROM " . _PREFIX_ . "plan as plan LEFT JOIN " . _PREFIX_ . "status AS status ON plan.status = status.id WHERE plan.project = :id GROUP BY plan.status",
        $condition)->fetchAll();

        //Definindo valores padrões
        //Contagem de itens
        $status = array(
            'approved' => array('badge' => "Aprovado", 'value' => 0),
            //'finished' => array('badge' => "Finalizado", 'value' => 0),
            'default'  => array('badge' => "Em Aberto", 'value' => 0)
        );

        foreach ($result as $key => $value) {
            switch ($value['badge']) {
                case "Aprovado":
                    $status['approved']['value'] = $value['value'];
                    break;
                /*case "Finalizado":
                    $status['finished']['value'] = $value['value'];
                    break;*/
                case "Em Aberto":
                    $status['default']['value'] = $value['value'];
                    break;
                default:
                    continue;
                    break;
            }            
        }       

        if(! $status):
            return false;
        else:
            //Retorna dados de usuário
            return $status;            
        endif;
    }

}