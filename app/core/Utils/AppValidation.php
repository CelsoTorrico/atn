<?php

namespace Core\Utils;

use aryelgois\Utils\Validation;
use aryelgois\Utils\Format;
use stdClass;


class AppValidation
{
    protected $valid;
    protected $format;

    const OBJECT_VAR = '';

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
            'type'          => '[1-5]{1}',
            'display_name'  => '.*',
            'user_pass'     => FILTER_SANITIZE_STRING,
            'user_email'    => FILTER_VALIDATE_EMAIL, 
            'cpf'           => array('validation', 'cpf'), 
            'cnpj'          => array('validation', 'cnpj'),
            'club_site'     => FILTER_SANITIZE_URL,
            'profile_img'   => new StdClass()
        );

        //Expressõe regulares
        $validFormat = array(
            'rg'        => '([0-9]{1,}\.?[0-9]{1,}\.?[0-9]{1,}\-?[0-9])',
            'telefone'  => '(\(?[0-9]{2}\)?)?\s?([0-9-]{4,5})(\-)?([0-9]{4})',
            'weight'    => '([0-9]{2,})',
            'height'    => '([0-2]{1}[.,][0-9]{2,})',
            'birthdate' => '([0-9]{4}\-[0-9]{2}\-[0-9]{2})',
            'empates'   => '([0-9]{1,})',
            'vitorias'  => '([0-9]{1,})',
            'titulos'   => '([0-9]{1,})',
            'jogos'     => '([0-9]{1,})',
            'derrotas'  => '([0-9]{1,})',
            'parent_user' => '([0-9]{1,})' //ID USUARIO(PAI)
        );

        //Informações Básicas
        $user = array(
            'user_login'    => '([a-zA-Z0-9_-])+',
            'posicao'       => '.*',
            'gender'        => '((fe)?male)',
            'biography'     => '.*',
            'howknowus'     => '.*',
            'social_tokens' => '.*',
            'club_sede'     => '.*'
        );

        //Endereço
        $address = array(
            'address'       => '.*',
            'city'          => '[\sa-zA-Zéêáâãíóôõúûü]+',
            'state'         => '[a-zA-Z]{2}',
            'country'       => '[a-zA-Z\s]+',
            'neighbornhood' => '[0-9a-zA-Z\s]+',
        );
        
        //Array de dados
        $array = array(
            'stats'     => '.*', 
            'clubes'    => '[0-9]{1,}',
            'sport'     => '[0-9]{1,}',
            'club_liga' => '.*', 
            'stats-sports' => '.*',
            'titulos-conquistas' => '.*',
            'eventos' => '.*',
            'formacao'  => '.*',
            'cursos'    => '.*',
            'my-videos'     => 'https?\:\/\/www\.youtube\.com\/.*'
        );

        foreach ($data as $key => $originalValue) {

            //No caso de um update de perfil em que cada dado vem em forma de array
            // keys => value | visibility
            $value = (is_array($originalValue) && key_exists('value', $originalValue))? $originalValue['value'] : $originalValue;

            //Se valor enviado for null pula próximo item
            if(is_null($value)){
                continue;
            }

            //Se campo for na forma de array
            if (array_key_exists($key, $array)) {
                
                //Inicializando var
                $action = $array[$key];
                $checkedItem = [];

                //Percorre array fazendo validação e converte string em int
                $filtered = $this->sanitizeItem($value, $action);   
                
                //Atribui valor ao array
                $data[$key] = $this->add_value_to_var($data[$key], $filtered);

                continue;
            }
            
            //Percorre array e executa metodos de filtragem
            if (array_key_exists($key, $important)) {
                $action = $important[$key];
                
                if(is_array($action)){
                    //Executa métodos especificos de validação
                    $filtered = $this->load($action, $value);
                } 
                elseif(is_string($action)){
                    //Executa regular expression para validar
                    $filtered = (preg_match('/'.$action.'/', $value, $match ) && is_array($match)) ? filter_var($match[0], FILTER_SANITIZE_STRING) : false;
                }
                elseif(is_object($action)){
                    //Se for upload de imagem retornar classe
                    $filtered = $value;
                }
                else{
                    //Filtra o dado
                    $filtered = filter_var($value, $action);
                }  
                
                //Atribui valor ao array
                $data[$key] = $this->add_value_to_var($data[$key], $filtered);

                continue;
            }
            
            //Percorre array e executa expressões regulares
            if (array_key_exists($key, $validFormat)) {
                $action = $validFormat[$key];
                //Executa regular expression para validação
                $filtered = (preg_match('/'.$action.'/', $value, $match )) ? filter_var($match[0], FILTER_SANITIZE_STRING) : false;
                //Atribui valor ao array
                $data[$key] = $this->add_value_to_var($data[$key], $filtered);
                continue;
            }
            
            //Percorre array e executa expressões regulares
            if (array_key_exists($key, $user)) {                
                $action = $user[$key];
                //Executa regular expression para validação
                $filtered = (preg_match('/'.$action.'/', $value, $match )) ? filter_var($match[0], FILTER_SANITIZE_STRING) : false;
                //Atribui valor ao array
                $data[$key] = $this->add_value_to_var($data[$key], $filtered);
                continue;
            }

            //Percorre array e executa expressões regulares
            if (array_key_exists($key, $address)) {                
                $action = $address[$key];
                //Executa regular expression para validação
                $filtered = (preg_match('/'.$action.'/', $value, $match )) ? filter_var($match[0], FILTER_SANITIZE_STRING) : false;
                //Atribui valor ao array
                $data[$key] = $this->add_value_to_var($data[$key], $filtered);

                continue;
            } 

            //Filtra outros dados com padrão de validação e atribui a var
            $data[$key] = $this->add_value_to_var($data[$key], filter_var($value, FILTER_SANITIZE_STRING));

        }

        return $data;
    }

    //Função de verificar se visibilidade enviada está no formato permitido
    function check_user_input_visibility($visibility):int {

        //Se visibilidade não foi enviada retorna visibilidade padrão
        if(is_null($visibility)){
            return 0;
        }

        //Expressõe regulares
        $validFormat = '([1-5]{1})'; //ID TYPE USER

        //Executa regular expression para validação
        $filtered = (preg_match('/'.$validFormat.'/', $visibility, $match )) ? (int) filter_var($match[0], FILTER_SANITIZE_STRING) : 0;
        
        //Atribui valor ao array
        return $filtered;

    }

    //Função formata diferentes tipos de dado e aplica erros
    function check_filtered_inputs($data, $isUpdate = false) {

        $errorMsg   = [];
        $fields     = [
            'cpf'  => array('format', 'cpf'),
            'cnpj' => array('format', 'cnpj')
        ];

        foreach ($data as $key => $originalValue) {

            //No caso de um update de perfil em que cada dado vem em forma de array
            // keys => value | visibility
            $value = (is_array($originalValue) && key_exists('value', $originalValue))? $originalValue['value'] : $originalValue;
            
            /** Verificações de erros */
            //Se valor for falso adiciona erro ao array
            if ($value == false) {
                $errorMsg['error'][$key] = 'Campo Inválido!';
                continue;
            }
            
            //Verifica estados válidos
            if ($key == 'state' && !in_array($value, self::STATES)) {
                $errorMsg['error'][$key] = 'Sigla UF Inválida!';
                continue;
            }

            //Verifica se key existe e executa função de formatação
            if (array_key_exists($key, $fields) ) {
                //Ação de filtragem a executar
                $action = $fields[$key];
                //Executa ação e retorna dado
                $filtered = $this->load($action, $value);
                //Atribui valor a variavel
                $data[$key] = (is_array($data[$key]) && key_exists('value', $data[$key]))? ['value' => $filtered] : $filtered;

                continue;
            }

        }

        //Se $isUpdate é false, cria um usuário de login baseado no email e formata display_name
        if(!$isUpdate){
            //Criando user_login
            $data['user_login'] = $this->create_user_login($data['user_email']);
        }

        //Se display_name for setado para criação ou alteração
        if (isset($data['display_name']) && !empty($data['display_name'])) {
            //Formatando display_name
            $data['display_name'] = ucwords($data['display_name']);
        }

        //Verifica qtd de erros e combina com array de dados
        if (count($errorMsg) > 0) {
            $data = array_merge($data, $errorMsg);
        }

        //Retorna array 
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

    //Sanitar item
    private function sanitizeItem (array $value, string $action) {
        
        $sanitized = [];

        foreach ($value as $key => $item) {
            
            //Se for array reutiliza função
            if (is_array($item)) {
                $sanitized[$key] = $this->sanitizeItem($item, $action);
                continue;
            }

            //Executar regex e filtros
            $sanitized[$key] = (preg_match('/'.$action.'/', $item, $match))? filter_var($match[0], FILTER_SANITIZE_STRING) : false;
        } 

        return $sanitized;
    }

    //Adicionar valor a varíavel se for array ou não
    private function add_value_to_var($array, $value, string $keyVerify = 'value'){
        if (is_array($array) && array_key_exists($keyVerify, $array)){
            $array[$keyVerify] = $value;
        } else {
            $array = $value;
        }

        return $array;
    }

}
