<?php

namespace Core;

class Comment extends Connect{

    /* Retorna lista de planos */
    function getComment(\Gafp\User $user, $id){
        
        $this->user_has_access($user);

        $result = $this->pdo->get('plan',
        [   '[>]project' => ['project' => 'id'] ],
        [
            'plan.name', 'plan.because', 'plan.place', 'plan.moment', 'plan.who', 'plan.how', 'plan.cost', 'plan.owner','project.date_plan(datePlan)', 'project.date_approver(dateApprover)', 'project.date_max(dateFinal)'
        ],
        [   'plan.id' => $id ]);

        //Interar sobre cada plano e retornar atividades e agregar ao array        
        $result['activitys'] = $this->getListActivityPlan($user, $id);         

        return $result;
    }

    /* Retorna lista de planos */
    function getListComment(\Gafp\User $user, $id){
        
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
    function getListApproverComment(\Gafp\User $user){
        
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

    /* Retorna lista de planos */
    function getListLeaderPlans(\Gafp\User $user, $id){
        
        $this->user_has_access($user);

        //Retorna email do usuário atual
        $leader = $this->pdo->get('users',['email'],['id' => $id]);
        
        //Retornando arrays de id's de subordinados
        $sub = $this->pdo->select('users',
        ['id'],['leader[~]' => $leader['email']]);

        //Reestrutura o array de id's
        $IDSub = [];
        foreach ($sub as $key => $value) {
            $IDSub[] = $value['id'];
        }

        //Query que retorna lista de planos de subordinados
        $result = $this->pdo->select('plan', [
            '[>]users'          => ['owner'     => 'id'],            
            '[>]status'         => ['status'    => 'id'],
            '[>]project'        => ['project' => 'id'] 
        ],[
            'plan.id', 'plan.date_created', 'plan.project', 'plan.name', 'plan.because', 
            'plan.who', 'users.username', 'status.id(statusID)', 'status.status(statusText)',
            'project.date_plan(datePlan)', 'project.date_approver(dateApprover)', 'project.date_max(dateFinal)'
        ],[
            'plan.owner' => $IDSub
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

    /* Retorna valores para campos relativos a projetos */
    function getPlanFields(\Gafp\User $user, $field = array()){

        $this->user_has_access($user);

        switch ($field['field']) {
            case 'users':
                $result = $this->pdo->select('users',[
                    'id', 'username', 'email'
                ],$field['where']);
                break;                        
            default:
                $result = [];
                break;
        }

        return $this->data_return($result);

    }

    //Retorna atividade baseada em seu ID
    function getActivityPlan(\Gafp\User $user, $id ){
        
        $this->user_has_access($user);

        //Verifica se dado já existe e define função a exec
        if( $this->pdo->has('activity',['id' => $id]) )
        {
            $result = $this->pdo->get('activity',[
                '[>]status'         => ['status'    => 'id'],
                '[>]project'        => ['project'  =>  'id' ],
                '[>]model'          => ['project.model' => 'id' ],
                '[>]rule_define'    => ['project'   => 'project'],
            ],[
                'activity.what', 'activity.because', 'activity.place', 'activity.moment', 'activity.who', 'activity.how','activity.cost', 'activity.status', 'status.status(statusText)','activity.date_created','model.topics[Object](model)','rule_define.rules(rules)',
                'project.date_plan(datePlan)', 'project.date_approver(dateApprover)', 'project.date_max(dateFinal)'
            ],[
                'activity.id' => $id
            ]);

            //Verifica em cada item da lista as regras de datas (primary,warning,success,danger)
            $result['rules'] = $this->ruleLogic($result['rules'], $result['moment']);            

            //Trazer as evidencias da atividade
            $evidenceItens = $this->getActivityEvidence($user, $id);
            if(!$evidenceItens || !empty($evidenceItens)){
                $result['evidence'] = $evidenceItens;
            }           

            return $result; //retorna (array) 'id 
        } 

    }

    //Retorna lista de atividades relacionadas com id do Plano
    function getListActivityPlan(\Gafp\User $user, $id ){
        
        $this->user_has_access($user); //permissão de usuário

        $result = $this->pdo->select('activity',
        [   '[>]status'         => ['status'    => 'id'],
            '[>]rule_define'    => ['project'   => 'project'],
            '[>]project'        => ['project'   => 'id'],
        ],
        [
            'activity.id', 'activity.what', 'activity.who', 'activity.moment','activity.status', 'status.id(statusID)', 'status.status(statusText)', 
            'rule_define.rules(rules)', 'project.date_max'
        ],[
            'activity.plan' => $id
        ]);

        //Verifica em cada item da lista as regras de datas (primary,warning,success,danger)
        foreach ($result as $key => $value) {
            $result[$key]['rules'] = $this->ruleLogic($value['rules'], $value['moment']);
        } 
        
        if(! $result):
            return false;
        else:
            //Retorna lista de atividades
            return $result;            
        endif;

    }

    //Retorna atividade baseada em seu ID
    function getActivityEvidence(\Gafp\User $user, $id ){
        
        $this->user_has_access($user);

        //Verifica se dado já existe e define função a exec
        if( $this->pdo->has('evidence',['activity' => $id]) )
        {
            $result = $this->pdo->select('evidence',[
                'id', 'topic[Object]', 'action', 'date_created',
            ],[
                'activity' => $id
            ]);
    
            return $result; //retorna (array) 'id 
        } 

    }

    /*####### ADD ######## */


    /* Adiciona um novo projeto */
    function addPlan( \Gafp\User $user, $data){
        
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

    function addActivityPlan( \Gafp\User $user, $data){
        
        $this->user_has_access($user);
        $current = $user->currentUser();

        //Se data não definida, encerra função
        if(!isset($data['moment'])){
            return false;
        }

        //Insere os dados obtidos anteriormente
        $result = $this->pdo->insert('activity', [ 
            'project'       => $current['project'],
            'what'          => $data['what'],
            'because'       => $data['because'],
            'place'         => $data['place'],
            'moment'        => $this->data_converter_to_insert($data['moment']),
            'who'           => $data['who'],
            'how'           => $data['how'],
            'cost'          => $data['cost']
        ]);

        $idResult = $this->pdo->id(); //Id do insert para utilizar nas evidencias

        if( $result && isset($data['evidence']) && count($data['evidence']) > 0 ){
            //Insere os dados obtidos anteriormente
            foreach ($data['evidence'] as $key => $value) {
                $evidenceResult = $this->pdo->insert('evidence', [ 
                    'activity'      => $idResult,
                    'topic'         => $value['topic'],
                    'action'        => $value['action']
                ]);
            }
            
        }
        
        //Retorna resultado
        if(isset($idResult) && $idResult > 0){
            return array('activity' => $this->getActivityPlan($user, $idResult), 'id' => $idResult);
        }
        else{
            return false;
        }

    }

    // UPDATE  ############################################

    /* Atualiza um plano */
    function updatePlan( \Gafp\User $user, $id, $data){
        
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

    /* Atualiza um plano */
    function updateActivityPlan( \Gafp\User $user, $id, $data){
        
        $this->user_has_access($user);

        //Insere os dados obtidos anteriormente
        $result = $this->pdo->update('activity', [ 
            'what'          => $data['what'],
            'because'       => $data['because'],
            'place'         => $data['place'],
            'moment'        => $this->data_converter_to_insert($data['moment']),
            'who'           => $data['who'],
            'how'           => $data['how'],
            'cost'          => $data['cost']
        ],['id' => $id]);

        //Se tiver campos de evindecias preenchidos atualizar
        if( $result && isset($data['evidence']) && count($data['evidence']) > 0 ){
            
            //Inicializa
            $evidence   = []; //array
            //$evidenceID = $data['evidence'][0]['evidenceID']; //id

            //Percorre array para adicionar valores corretos
            foreach ( $data['evidence'] as $key => $value ) {

                //Atribuindo data
                $topic   = serialize(filter_var_array($value['topic'], 
                FILTER_SANITIZE_STRING ));
                $action  = filter_var($value['action'], 
                FILTER_SANITIZE_STRING);
                $evidenceID = ( isset($value['id'] ))? filter_var($value['id'], FILTER_SANITIZE_NUMBER_INT) : null;
                
                //Adiciona ou atualiza um item
                if( !is_null($evidenceID) && $this->pdo->has('evidence',['id' => $value['id']]))
                {
                    //Atualiza a evidencia
                    $evidenceResult = $this->pdo->update('evidence',
                    [
                        'topic' => $topic, 
                        'action' => $action ],
                    ['id' => $evidenceID ]);
                }
                else{
                    //Insere uma evidencia
                    $evidenceResult = $this->pdo->insert('evidence',
                    [
                        'activity' => $id,
                        'topic' => $topic, 
                        'action' => $action 
                    ]);
                }
                
            }

        }

        //Retorna resultado
        if(isset($result) && !is_null($result)){
            return array(
            'type' => 'success', 
            'msg' => 'Atividade atualizada com sucesso!');
        }
        else{
            return array(
            'type' => 'danger', 
            'msg' => 'Não foi possível atualizar a atividade, tente novamente.');
        }

    }

    function updatePlanStatus(\Gafp\User $user, $id, $data){
        
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

    function updateActivityPlanStatus(\Gafp\User $user, $id, $data){
        
        $this->user_has_access($user);
        
        //Insere os dados obtidos anteriormente
        $result = $this->pdo->update('activity', ['status' => $data['status']],['id' => $id]);

        //Retorna resultado
        if(isset($result) && !is_null($result)){
            return array(
            'type' => 'success', 
            'msg' => ($data['status'] == 2)? 'Atividade Finalizada!' : 'Atividade Reaberta!');
        }
        else{
            return array(
            'type' => 'danger', 
            'msg' => 'Não foi possível atualizar status da atividade, tente novamente.');
        }
    } 

    // DELETE #############################################

    /* Deletar um plano */
    function deletePlan( \Gafp\User $user,  $ID){
        
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

    /* Deletar uma atividade */
    function deleteActivityPlan( \Gafp\User $user,  $ID){
        
        $this->user_has_access($user); //Verifica permissão

        //Contruindo Query
        $result = $this->pdo->delete('activity',['id' => $ID ]);
        
        //Retorna resultado
        if(is_object($result) && $result){
            return array('type' => 'success', 'msg' => 'Atividade deletada.');
        }
        else{
            return array('type' => 'danger', 'msg' => 'Não foi possível deletar a atividade. Tente novamente.');
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