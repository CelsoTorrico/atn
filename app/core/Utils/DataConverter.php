<?php 

namespace Core\Utils;

/**
 *  Classe para conversão de diferentes tipos de dados
 *  @since 2.0
 */
class DataConverter{

    /** 
     * Função que verifica var é array e se tem valores a exibir
     * @param $var $result 
    */
    public static function data_return($var){
        
        if(count($var) <= 0 || !is_array($var)):
            return false;
        else:
            //Retorna dados de usuário
            return $var;            
        endif;
    }

    /** 
     * Função que verifica se $var é numero inteiro
     * 
     * @param mixed $var = recebe id de inserção
     * @return mixed Retorna inteiro ou bolean FALSE
     * */
    public static function data_return_insert($var){        
        //Retorna dados de usuário
        if(is_array($var)):
            $id = (int) $var['id'];
        else:
            $id = (int) $var;
        endif;

        //Retorna $id ou false
        return ($id <= 0)? false : $id;            
    }

    /** 
     * Retornar apenas keys selecionada em array
     * 
     * @param array $data   array de valores a serem usadas 
     * @param array $only   keys definidas a serem exportadas, padrão é 'ID'
     * @return array    Retorna array com apenas keys definidass
    */
	public static function onlyKey(Array $data, $only = ['ID']){
        return array_keys($data, $only, true);
    }
    
    /** 
     * Retornar apenas parametros selecionados em objeto
     * 
     * @param object $data  Objeto a ser verificado
     * @param array $only   keys definidas a serem exportadas, padrão é 'ID'
     * @return array    Retorna array com apenas keys definidas
     * */
	public static function onlyObjectParameter(object $data, $only = ['ID']){
        $array = [];
        foreach ($only as $value) {
            $array[] = $data->$value;
        }
        return $array;
	}

    /** 
     * Converte data em formato do Brasil  
     * 
     * @param string $date  String de data a ser formatada
     * @return date Retorna objeto do tipo date
     * */
    public static function data_converter_to_insert($date){
        setlocale (LC_ALL, 'pt_BR');
        date_default_timezone_set('America/Sao_Paulo');
        return date('Y-m-d H:i:s', strtotime($date));
    } 

}