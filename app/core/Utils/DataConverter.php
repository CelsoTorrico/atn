<?php 

namespace Core\Utils;

class DataConverter{


    //Função que verifica var retorno de resultado de query no banco
    public static function data_return($result){
        
        if(count($result) <= 0 || !is_array($result)):
            return false;
        else:
            //Retorna dados de usuário
            return $result;            
        endif;
    }

    //Função que verifica var retorno de resultado de query no banco
    //$result = recebe id de inserção
    public static function data_return_insert($result){        
        //Retorna dados de usuário
        if(is_array($result)):
            $id = (int) $result['id'];
        else:
            $id = (int) $result;
        endif;

        //Retorna $id ou false
        return ($id <= 0)? false : $id;            
    }

    //Retornar apenas keys selecionada em array
	public static function onlyKey(Array $data, $only = ['ID']){
        return array_keys($data, $only, true);
    }
    
    //Retornar apenas parametros selecionados em objeto
	public static function onlyObjectParameter(object $data, $only = ['ID']){
        $array = [];
        foreach ($only as $value) {
            $array[] = $data->$value;
        }
        return $array;
	}


    public static function data_converter_to_insert($date){
        setlocale (LC_ALL, 'pt_BR');
        date_default_timezone_set('America/Sao_Paulo');
        return date('Y-m-d H:i:s', strtotime($date));
    } 

}