<?php

namespace Core\Utils;

use aryelgois\Utils\Validation;
use aryelgois\Utils\Format;


class AppValidation
{
    protected $valid;
    protected $format;

    const STATES = [
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
        'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ];

    function __construct(){
        $this->valid    = new Validation();
        $this->format   = new Format();
    }

    /** Verifica tipo 'int'
     * @since 0.1
     * @param mixed $data
     */
    public function validInt($data)
    {
        return $this->verify('int', "([0-9]{1,})", $data);

    }

    /** Verifica tipo 'string'
     * @since 0.1
     * @param mixed $data
     */
    public function validString($data)
    {

        return $this->verify("(.+)", $data);

    }

    /** Verifica tipo 'float'
     * @since 0.1
     * @param mixed $data
     */
    public function validFloat($data)
    {

        return $this->verify("(.+\.)", $data);

    }

    /**
     * Função que verifica tipo de data
     * @since 0.1
     * @param string $type: Tipos permitidos int, string, float
     * @param string $regex: Padrão de expressão regular que verifica na varivel $data
     * @param string $data:  Os dados recebidos a serem verificados
     * */
    private function verify(string $type = 'string', string $regex, string $data)
    {

        //Verifica se valor é nulo
        if (is_null($data)) {
            //TODO: Retornar uma função de erro
            return false;
        }

        //Verifica se data contém padrão
        //TODO: Verificar algum meio de verificar de forma exata
        $valid = preg_match('/' . $regex . '/', $data, $match);

        if (!$valid) {
            //TODO: Retornar alguma especie de mensagem
            return false;
        }

        switch ($type) {
            case 'int':
                $check = filter_var($data, FILTER_SANITIZE_NUMBER_INT);
                break;
            case 'float':
                $check = filter_var($data, FILTER_SANITIZE_NUMBER_FLOAT);
                break;
            default:
                $check = filter_var($data, FILTER_SANITIZE_STRING);
                break;
        }

        return true;

    }

    //Função valida diferentes tipos de dados 
    function check_user_inputs($data) {

        $important = array(
            'type'          => '[1-4]{1}',
            'display_name'  => '[\sa-zA-Zéêáâãíóôõúûü]+', 
            'sport'         => '[0-9]{1,}',
            'user_pass'     => FILTER_SANITIZE_STRING,
            'user_email'    => FILTER_VALIDATE_EMAIL, 
            'cpf'           => array('validation', 'cpf'), 
            'cnpj'          => array('validation', 'cnpj'),
            'club_site'     => FILTER_VALIDATE_URL,
            'my-videos'     => FILTER_VALIDATE_URL
        );

        //Expressõe regulares
        $validFormat = array(
            'rg'        => '([0-9]{1,}\.?[0-9]{1,}\.?[0-9]{1,}\-?[0-9])',
            'telefone'  => '(\(?[0-9]{2}\)?)?\s?([0-9-]{4,5})(\-)?([0-9]{4})',
            'weight'    => '([0-9]{2,})',
            'height'    => '([0-2]{1}[.,][0-9]{2,})',
            'birthdate' => '([0-9]{2}\/[0-9]{2}\/[0-9]{4})',
            'empates'   => '([0-9]{1,})',
            'vitorias'  => '([0-9]{1,})',
            'titulos'   => '([0-9]{1,})',
            'jogos'     => '([0-9]{1,})',
            'derrotas'  => '([0-9]{1,})',
            'visibility' => '([1-4]{1})'
        );

        //Informações Básicas
        $user = array(
            'user_login'    => '([a-zA-Z0-9_-])+',
            'posicao',
            'gender'        => '((fe)?male)',    
            'formacao',
            'howknowus'
        );
        
        //Estatisticas
        $stats = array(
            'stats', //TODO: Verificar se é string serializada
            'clubes' //TODO: Deve ser serialize
        );

        $club = array(
            'club_liga',
            'club_sede', 
            'stats-sports',
        );
        
        //Endereço
        $address = array(
            'address',
            'city'      => '[\sa-zA-Zéêáâãíóôõúûü]+',
            'state'     => '[a-zA-Z]{2}',
            'country'   => '[a-zA-Z\s]+',
            'neighbornhood' => '[0-9a-zA-Z\s]+',
        );

        $mixed = array(
            'biography',
            'titulos-conquistas' //TODO: Deve ser serialize
        );

        foreach ($data as $key => $value) {
            
            //Percorre array e executa metodos de filtragem
            if (array_key_exists($key, $important)) {
                $action = $important[$key];
                
                if(is_array($action)){
                    $data[$key] = $this->load($action, $value);
                } 
                elseif(is_string($action)){
                    $data[$key] = (preg_match('/'.$action.'/', $value, $match )) ? filter_var($match[0], FILTER_SANITIZE_STRING) : false;
                }
                else{
                    $data[$key] = filter_var($value, $action);
                }                
                continue;
            }
            
            //Percorre array e executa expressões regulares
            if (array_key_exists($key, $validFormat)) {
                $action = $validFormat[$key];
                $data[$key] = (preg_match('/'.$action.'/', $value, $match )) ? filter_var($match[0], FILTER_SANITIZE_STRING) : false;
                continue;
            }
            
            //Percorre array e executa expressões regulares
            if (array_key_exists($key, $user)) {                
                $action = $user[$key];
                $data[$key] = (preg_match('/'.$action.'/', $value, $match )) ? filter_var($match[0], FILTER_SANITIZE_STRING) : false;
                continue;
            }

            //Percorre array e executa expressões regulares
            if (array_key_exists($key, $address)) {                
                $action = $address[$key];
                $data[$key] = (preg_match('/'.$action.'/', $value, $match )) ? filter_var($match[0], FILTER_SANITIZE_STRING) : false;
                continue;
            } else {
                //Filtra as outras variaveis
                $data[$key] = filter_var($value, FILTER_SANITIZE_STRING);
            }

        }

        return $data;
    }

    //Função formata diferentes tipos de dado e aplica erros
    function check_filtered_inputs($data, $isUpdate = false) {

        $errorMsg   = [];
        $fields     = [
            'cpf'  => array('format', 'cpf'),
            'cnpj' => array('format', 'cnpj')
        ];

        foreach ($data as $key => $value) {
            
            //Se valor for falso adiciona erro ao array
            if ($value == false) {
                $errorMsg['error'][] = array($key => 'Campo Inválido!');
                continue;
            }
            
            //Verifica estados válidos
            if ($key == 'state' && !in_array($value, self::STATES)) {
                $errorMsg['error'][] = array($key => 'Sigla UF Inválida!');
                continue;
            }

            //Verifica se key existe e executa função de formatação
            if (array_key_exists($key, $fields) ) {
                $action = $fields[$key];
                $data[$key] = $this->load($action, $value);
                continue;
            }

        }

        //Se $isUpdate é false, cria um usuário de login baseado no email 
        if(!$isUpdate){
            //Criando user_login
            $data['user_login'] = $this->create_user_login($data['user_email']);
        }

        //Formatando display_name
        $data['display_name'] = ucwords($data['display_name']);

        //Verifica qtd de erros e retorna
        if (count($errorMsg) > 0) {
            return $errorMsg;
        }

        return $data;

    }

    //Carrega classe adequadra via string dinamicamente
    function load(Array $array, $value = null) {
        
        $obj = ($array[0] == 'validation')? $this->valid : $this->format;
        
        $func = $array[1];
        
        return $obj->$func($value);
    }

    //Criar user_login baseado no email
    protected function create_user_login($data) {
        preg_match('/(.+)@/', $data, $match);
        return '@'. $match[1];
    }

}
