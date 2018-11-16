<?php

namespace Gafp;

class Project extends Connect{

    /*###### GET ###### */

    /* Retorna lista de projetos */
    function getListProjects( \Gafp\User $user ){
        
        $this->user_has_access($user);

        //Query
        $result = $this->pdo->select('project', [
            '[>]company'    => ['company' => 'id'],
            '[>]model'      => ['model' => 'id']           
        ],[
            'project.id', 'project.date_created', 'project.responsibles[Object]',
            'project.approvers[Object]', 'company.name(company)', 'model.name(model)'
        ],[
            'ORDER'  =>  ['project.date_created' => 'DESC']
        ]);

        foreach ($result as $key => $value) {
           //Se houver responsáveis, adicionar ao array
            if( isset($value['responsibles']) && count($value['responsibles']) > 0 ){   
                $result[$key]['responsibles'] = $user->getUsers(['id' => $value['responsibles']]);
            }

            if( isset($value['approvers']) && count($value['approvers']) > 0 ){   
                $result[$key]['approvers'] = $user->getUsers(['id' => $value['approvers']]);
            }
        }
        
        return $this->data_return($result);

    }

    /* Retorna projeto por ID */
    function getProject( \Gafp\User $user, $ID){
        
        $this->user_has_access($user);
       
        $result = $this->pdo->get('project', [
            '[>]company'    => ['company' => 'id'],
            '[>]model'      => ['model' => 'id']         
        ],[
            'company.id(company)','model.id(model)', 
            'project.id','project.responsibles[Object]','project.approvers[Object]',
            'project.date_plan','project.date_approver','project.date_max'
        ],[
            'project.id'  =>  $ID
        ]);

        //Retorna todos os usuários do projeto
        $result['users'] = $user->getUsers(['project' => $ID]);

        return $this->data_return($result);
    }

    /* Retorna lista de projetos */
    function getResponsibleProject( \Gafp\User $user, $projectID, $ID){
        
        $this->user_has_access($user); //permissão
        //Query do projeto
        $result = $this->pdo->get('project', ['responsibles[Object]'],['id' => $projectID]);
        //Verifica se retornou array de resultado
        if($result <= 0 || !$result['responsibles']){
            return false;
        }
        
        //Procura id do usuário no array
        $found = array_search( strval($ID), $result['responsibles'], false);
        //Verifica resultado é diferente de booleano
        return (!is_bool($found) && $found !== false)? true : false;  //Se encontrou true
        
    }

    /* Retorna valores para campos relativos a projetos */
    function getProjectFields(\Gafp\User $user, $field = ""){

        $this->user_has_access($user);

        switch ($field) {
            case 'company':
                $result = $this->pdo->select('company',[
                    'id', 'name'
                ]);
                break;
            case 'area':
                $result = $this->pdo->select('area',[
                    'id', 'name'
                ]);
                break;
            case 'user':
                $result = $this->pdo->select('users',[
                    'id', 'username'
                ]);
                break;
            case 'model':
                $result = $this->pdo->select('model',[
                    'id', 'name'
                ]);
                break;
            case 'approver':
                $result = $this->pdo->select('approver',[
                    'id', 'name'
                ]);
                break;            
            default:
                $result = [];
                break;
        }

        return $this->data_return($result);

    }

    /*####### ADD ######## */

    /* Adiciona um novo projeto */
    function addProject($data, \Gafp\User $user){
        
        $this->user_has_access($user);

        //Percorre array de data e executa função para atribuir
        foreach ($data as $key => $value) {
            $add_data[$key] = $this->addProjectFields($user, $key, $value);
        }

        //Insere os dados obtidos anteriormente
        $result = $this->pdo->insert('project', $add_data);

        $idResult = $result->id();
        
        //Se resultado for false encerra função
        if(!$this->data_return_insert($idResult))
            return false;
        
        //Retorna dados de usuário
        $newItem = $this->getProject($user, $idResult);
        return $newItem; 

    }

    //Adicionando campos na base basedo nas colunas
    function addProjectFields( \Gafp\User $user, $type_field, $data){
        
        $this->user_has_access($user); //Verifica permissão

        $defaultColumns = array('company', 'model', 'users', 'final'); //tipos permitidos
        
        //Se for diferente do defido, retorna acesso não autorizado
        if( !in_array($type_field, $defaultColumns) )
                return 'Access Not Authorized.';
        
        //Definindo a função a ser executada
        $func = 'addProject_' . $type_field . '_FieldData';

        //retorna resultado
        return $this->$func($user, $data);

    }

    //Função para inserir empresas, verifica se existe e insere ou retorna
    private function addProject_company_FieldData($user = '', $data){
        
        $input = filter_var($data['company'], FILTER_SANITIZE_STRING);
        
        //Verifica se dado já existe e define função a exec
        if( $this->pdo->has('company',['name' => $input]) )
        {
            //Insere um novo valor
            $result = $this->pdo->get('company',
            ['id'],['name' => $input]);
            return $this->data_return_insert($result); //retorna (array) 'id' 
        }
        else{
            //Insere um novo valor
            $result = $this->pdo->insert('company',[
                'name' => $input
            ]);
            return $this->data_return_insert($this->pdo->id()); //retorna (int) id
        }        
    }

    //Função para selecionar modelos existentes
    private function addProject_model_FieldData($user = '', $data){

        $input = filter_var($data['model']['id'], FILTER_SANITIZE_STRING);
        
        //Verifica se dado já existe e define função a exec
        if( $this->pdo->has('model',['id' => $input]) )
        {
            //Pega valor
            $result = $this->pdo->get('model',
            ['id'],['id' => $input]);
            return $this->data_return_insert($result); //retorna (array) 'id 
        } 
                 
    }

    //Função que adiciona usuários ao projeto
    private function addProject_users_FieldData($user, $data){

        //Define o id da empresa a inserir os usuários
        //Se id não tiver defindo, adiciona um novo item a tabela
        if(isset($data['company']) && $data['company'] != 0){
            //Atribui ID de projeto
            $company = $data['company'];
        }
        else{
            //Atribui ID de projeto
            $company = $this->addProject_company_FieldData($user, $data);
        }

        //Define o id do projeto a inserir os usuários
        //Se id não tiver defindo, adiciona um novo item a tabela
        if(isset($data['project']) && $data['project'] != 0){
            //Atribui ID de projeto
            $project = $data['project'];
        }
        else{
            //Executa query adicionando dados prévios ao projeto
            $this->pdo->insert('project',[
                'company' => $company
            ]);

            //Retorna o ID do projeto criado
            $project = $this->pdo->id();
        }  
        
        $file = $data['uploadFile']['file']->file; //Arquivo enviado para variavel
        $result = []; //Inicializa array

        $filetype = \PHPExcel_IOFactory::identify($file);//Identifica arquivo
        $objReader = \PHPExcel_IOFactory::createReader($filetype); //inicializa classe de leitura
        $xl = $objReader->load($file); //carrega as informações do arquivo
        $objWorksheet = $xl->getActiveSheet(); //carrega apenas as informação das tabelas
        $lastColumn = $objWorksheet->getHighestColumn(); //aponta para primeira coluna do documento
        
        //Definindo as colunas válidas
        $validColumns = ['username', 'email', 'password', 'area', 'leader', 'type_user'];
        //Pega a primeira linha para usar 
        $columnNames = $objWorksheet->rangeToArray('A1:'. $lastColumn.'1'); 
        //Verifica se as colunas do documento é permitida
        foreach ($columnNames[0] as $key => $value) {
            if(! in_array($value, $validColumns)){
                $result['error'][] = "Coluna de dados '" . $value . "'não permitida para cadastro";
            }
        }
        
        //Se houver erros, encerrar execução
        if( !empty($result['error']) )
            return $result;

        $result['success'] = false;
        //Intera sobre o número de linhas no arquivo de upload
        foreach($objWorksheet->getRowIterator() as $rowIndex => $row) {
            //Ignora primeira linha
            if($rowIndex == 1){
                continue;
            }
            //Convert the cell data from this row to an array of values
            $arrayRow = $objWorksheet->rangeToArray('A'.$rowIndex.':'.$lastColumn.$rowIndex);
            //Combinamos os dois arrays para definir keys e values em um só
            $currentData = array_combine($columnNames[0], $arrayRow[0]);
            //Executa função de adicionar usuário
            $response = $user->insertMultipleUsers($currentData, $project, $company);
            //Verifica se houve algum erro e interrompe upload
            if(empty($response) || is_null($response)){
                $result['error'][]= "Houve algum problema na linha'" . $rowIndex . "', não foi possível inserir ou atualizar os usuários.";
                break;
            }
            else{
                $result['success'] = true;
            }            
        }

        //Se houve sucesso na inserção
        if($result['success']){

            //ID do projeto
            $projectID = $project;
            //ID da empresa
            $companyID = $company;

            //Retorna lista de usuários do projeto
            $userList = $user->getUsers(
                ['project' => $projectID, 
                'type_user[!~]' => 'superuser']);            

            //Retorna lista de usuários junto com ID do projeto
            return array('users' => $userList, 'project' => $projectID, 'company' => $companyID); 
        }
        else{ //Retorna erros adquiridos no looping
            $result['error'][] = "Houve algum problema na linha '" . $rowIndex . "', não foi possível inserir ou atualizar os usuários.";
            return $result;
        }
        
    }

    //Última etapa na inserção de um novo projeto
    private function addProject_final_FieldData($user = '', $data){
        
        $result = $this->updateProject($user, null, $data);
        
        //Retorna resultado
        if( $result && !is_null($result)){
            return array(
            'type' => 'success', 
            'msg' => 'Projeto criado com sucesso!');
        }
        else{
            return array(
            'type' => 'danger', 
            'msg' => 'Houve algum problema na criação do projeto, tente novamente.');
        }
    }

    //Atualizar um projeto
    function updateProject(\Gafp\User $user, $ID, $data){
        
        $columnToSerialize = ['responsibles', 'approvers']; //colunas a serializar
        $project_data = []; //Array

        //Prepara as informações para inserção no banco
        foreach ($data as $key => $value) {
            //aplicando filtro de string
            if( in_array($key, $columnToSerialize) ):                
                $project_data[$key] = serialize(filter_var_array($value, FILTER_SANITIZE_STRING));
            elseif( $key == ('project' || 'model') ):
                $project_data[$key] = filter_var($value, FILTER_SANITIZE_NUMBER_INT);
            else:
                $project_data[$key] = ($key == 'password')? password_hash(filter_var($value, FILTER_SANITIZE_STRING), PASSWORD_DEFAULT) : filter_var($value, FILTER_SANITIZE_STRING);
            endif;            
        }

        //Se $ID não foi definido ao invocar método, adiciona id vindo de $data
        if( is_null($ID) ){
            $ID = isset($project_data['project'])? $project_data['project'] : false;
        }

        //Se $ID não for vdd,termina método
        if(!$ID){
            return false;
            die();
        }
        
        //Query de inserção
        $result = $this->pdo->update('project',
        [   
            'model' => $project_data['model'],
            'responsibles' => $project_data['responsibles'],
            'approvers' => $project_data['approvers'],
            'date_plan' => $this->data_converter_to_insert($data['date_plan']),
            'date_approver' => $this->data_converter_to_insert($data['date_approver']),
            'date_max' => $this->data_converter_to_insert($data['date_max'])
        ],
        ['id' => $ID]);

        //Retorna resultado
        if(isset($result) && !is_null($result)){
            return array(
            'type' => 'success', 
            'msg' => (isset($data['new']) && $data['new'] == true)? 'Projeto criado com sucesso!' : 'Projeto atualizado com sucesso!'
            );
        }
        else{
            return array(
            'type' => 'danger', 
            'msg' => (isset($data['new']) && $data['new'] == true)? 'Houve um problema na criação do projeto, tente novamente.' : 'Houve algum problema na atualização do projeto, tente novamente.'
            );
        }
    }

    /* Deletar um modelo */
    function deleteProject( \Gafp\User $user,  $ID){
        
        $this->user_has_access($user); //Verifica permissão

        //Contruindo Query
        $result = $this->pdo->delete('project',['id' => $ID ]);
        
        //Retorna resultado
        if(is_object($result) && $result){
            return array('type' => 'success', 'msg' => 'Projeto deletado.');
        }
        else{
            return array('type' => 'danger', 'msg' => 'Não foi possível deletar o projeto. Tente novamente.');
        }
    }


    //////// Definições do projeto

    //Retorna regra do projeto
    function getRuleProject(\Gafp\User $user, $ID ){
        
        $this->user_has_access($user); //Verifica permissão

        //Verifica se existe registro do projeto no banco
        if( $this->pdo->has('rule_define',['project' => $ID ]) ){
            //Pega regras cadastradas
            $result = $this->pdo->get('rule_define',['rules[Object]'],['project' => $ID]); 
        }
        else{
            $result = false;
        }    
        
        //Retorna resultado
        if(is_array($result) && $result){
            return $result;
        }

    }

    //Adiciona ou atualiza regras do projeto
    function updateRuleProject(\Gafp\User $user, $ID, $data ){

        $this->user_has_access($user); //Verifica permissão

        foreach ($data as $key => $value) {
            $value['types'] = filter_var_array($value['types'], FILTER_SANITIZE_STRING);
            $value['qtd'] = filter_var($value['qtd'], FILTER_SANITIZE_NUMBER_INT);
        }

        //Verifica se existe registro do projeto no banco
        if( $this->pdo->has('rule_define',['project' => $ID ]) ){
            //Atualizando a linha
            $result = $this->pdo->update('rule_define',[
                'rules' => serialize($data)
            ],['project' => $ID]);
        }
        else{
            //Criando uma nova linha
            $result = $this->pdo->insert('rule_define',[
                'project' => $ID,
                'rules' => serialize($data)
            ]);
        }  
        
        //Retorna resultado
        if(is_object($result) && $result){
            return array('type' => 'success', 'msg' => 'Regras atualizadas.');
        }
        else{
            return array('type' => 'danger', 'msg' => 'Não foi possível atualizar as regras. Tente novamente.');
        }

    }   

    //Retorna msg de email cadastrado
    function getMail(\Gafp\User $user, $id, $type ){        
        $this->user_has_access($user); //Verifica permissão
        //Insere dados no banco
        $result = $this->pdo->get('emails',['message'],['type'=> $type, 'project' => $id] );
        //Retorna resultado
        if(is_array($result) && $result){
            return $result;
        }
    }

    //Adiciona ou atualiza regras do projeto
    function sendMail(\Gafp\User $user, \PHPMailer\PHPMailer\PHPMailer $mail,  $data ){
        
        $this->user_has_access($user); //Verifica permissão

        $project = filter_var($data['project'], FILTER_SANITIZE_NUMBER_INT); 
        $msg    = filter_var($data['msg'], FILTER_SANITIZE_STRING);
        $type   = filter_var($data['type'], FILTER_SANITIZE_STRING);

        //Se dados não forem em formato de array
        if( !is_array($data) && !isset($data['email'] )){
            return;
        }

        //Adiciona os e-mails dos usuários selecionados
        if( isset($data['users']) && count($data['users']) > 0 ){
            foreach ($data['users'] as $key => $value) {
                //Adiciona o usuário ao recipiente de email
                $mail->addAddress($value['email'], $value['username']);
            }
        }

        //Adiciona e-mail de usuário selecionado alguma área
        if( isset($data['areas']) && count($data['areas']) > 0 ){
            //Percorre array e traz usuários das áreas selecionadas
            foreach ($data['areas'] as $key => $value) {
                $userList = $user->getUsers([
                    'area[~]' => $value
                ]);
            }
            //Se não houver usuários
            if(count($userList) <= 0 ){
                return;
            }
            //Adiciona os usuários ao PHPMailer
            foreach ($userList as $key => $value) {
                //Adiciona o usuário ao recipiente de email
                $mail->addAddress($value['email'], $value['username']);
            }
        }

        //Adiciona a mensagem no banco do projeto para envio futuros
        if( isset($data['msg']) && !empty($msg) ){
            if( $this->pdo->has('emails',['project' => $project, 'type' => $type ]) ){
                //Atualiza os dados no banco
                $result = $this->pdo->update('emails',
                [   'type' => $type,
                    'message' => $msg
                ],
                [   'project' => $project,
                    'type'  => $type    ]);
            }
            else{
                //Insere dados no banco
                $result = $this->pdo->insert('emails',
                [  'project' => $project,
                   'type' => $type,
                   'message' => $msg
                ]);
            }            
        }

        //Definições PHPMailer
        $mail->isSMTP();                                      
        $mail->Host = _HOST_;  
        $mail->SMTPAuth = true;                               
        $mail->Username = _USER_EMAIL_;                 
        $mail->Password = _USER_PASS_;                           
        $mail->SMTPSecure = _SMTP_SECURE_;                            
        $mail->Port = _PORT_;
        $mail->setFrom('from@example.com', 'Mailer');
        $mail->setLanguage('pt_br');

        //Content
        $mail->isHTML(true);  // Formato do E-mail
        $mail->Subject = ($type == 'charge')? 'Cobrança' : 'Boas-Vindas'; //Assunto
        $mail->Body    = $msg; //Mensagem html
        $mail->AltBody = $msg; //Mensagem plain-text
                
        //Retorna resultado
        if($mail->send()){
            return array('type' => 'success', 'msg' => 'E-mail enviado com sucesso.');
        }
        else{
            return array('type' => 'danger', 'msg' => 'Não foi possível enviar o e-mail. Tente novamente.');
        }

    }

}