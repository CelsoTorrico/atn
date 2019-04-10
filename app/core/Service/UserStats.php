<?php 

namespace Core\Service;

use Core\Database\UsermetaModel;
use Closure;

class UserStats {
    
    private $meta; //id
    private $type_id; //username
    private $sport; //sport array
    private $attr;
    public  $stats;
    
    //Contrução da classe
    public function __construct(array $metadata, int $type_id, $sport) {

        $this->meta     = $metadata; //Id usuario
        $this->type_id  = $type_id; //id de tipo de usuário
        $this->sport    = $sport; //array de ids e nome do esportes

        //Apenas atletas possuem estatisticas especificas de esporte
        if( !is_null($this->sport) && $this->type_id == 1) {
            $this->attr = $this->getSportAttributes();
        }

    }

    /** Retorna estatísticas gerais do atleta */
    function get() {

        /** Estatisticas Gerais de Atletas */
        $statsGerais = [
            'empates','vitorias', 'titulos', 'jogos', 'derrotas', 'titulos-conquistas'
        ];

        //Array de numeros
        $numeros  = [];
        $porcento = [];

        //Percorre array para trazer dados gerais
        foreach ($statsGerais as $value) {            
            
            //Se não exitir, próxima iteração
            if (!array_key_exists($value, $this->meta)) {
                continue;
            }

            //Verifica se dado registrado é em formato de número
            $n = $this->meta[$value]['value'];

            //Se for array de dados apenas atribui
            if(in_array($value, ['titulos', 'titulos-conquistas']) || is_array($value)){
                $numeros[$value] = $n;
                continue;
            }
            
            //Apenas permite e converte strings em int
            $valid = preg_match('/[-0-9]+/', $n, $n);

            //Verifica se houve conversão corretamente do número
            if($valid){
                $numeros[$value] = (int) $n[0];
            } else {
                $numeros[$value] = 0;
            }

        }

        //Retorna dados e soma atribuindo total
        $resultadoJogos = ['vitorias', 'empates', 'derrotas'];
        
        //Total de resultados
        $total = array_sum(array_only($numeros, $resultadoJogos));
        
        //Se total for diferente da soma de resultado de jogos, 
        //consideramos resultado como parametro para porcentagem
        if ( isset($numeros['jogos']) && $total != (int) $numeros['jogos']) {
            $total = $numeros['jogos'];
        }

        //Se total for maior que zero, fazemos calculo de porcentagem para exibir
        if ($total > 0) {
            //1 por cento
            $cento = (100 / $total);   

            //calculo de aproveitamento
            foreach ($resultadoJogos as $value) {
                //Se algum parametro não definido >> proximo
                if(!isset($numeros[$value])){
                    continue;
                }
                //Calculo de porcentagem (aproveitamento de partidas)
                $porcento['%-'.$value] = round(($numeros[$value] * $cento), 1);
            }
        }        

        //Atribui aproveitamento a var
        $numeros['aproveitamento'] = $porcento;
        
        //Monstando array de dados
        $mainSport = [
            'general'         => $numeros,
            'performance'     => [
                'stats'         => (!is_null($this->stats)) ? $this->stats : '',
            ]
        ];

        //Retornando array de dados estatisticos
        return $mainSport;

    }

    /** Função de setar as estatisticas do usuário para retornar com valores */
    public function setStats():void{
        
        //Se não houver estatisticas
        if (!isset($this->meta['stats']) || empty($this->meta['stats'] )) {
            return;
        }

        //Se não houve carregamento de esportes para comparação
        if(is_null($this->attr)){
            return;
        }

        //Atribui metadados
        $userstats = $this->meta['stats'];

        /** Verificar para compatibilidade com app v1.0 */
        $diff = array_intersect_key($this->attr, $userstats['value']);

        //Se não há chaves de esportes
        if (count($diff) <= 0 ) {
            //Execução de função de compatibilidade
            $this->arrangeInsertedData($userstats['value']);
        } else {
            //Percorre array de atributos de vários esportes
            //Função para atribuir vários esportes
            foreach ($diff as $key => $value) {
                $this->arrangeInsertedData([$key => $userstats['value'][$key]]);
            }
        }

    }

    /** Função para arranjar array de dados para ser inserido no banco de dados 
     * 
     * @since 2.0
     * @return string = Serialized array as string
     */
    public function arrangeStatsToUpdate(array $meta_value):void {

        foreach ($meta_value['value'] as $key => $value) {
            $this->arrangeInsertedData($value);
        }
    }

    /** 
     * Função retorna os dados arranjados para serem inseridos no perfil do usuário 
     * 
     * @since 2.0
     * @return string serialized string 
     * */
    public function getStatsToUpdate():array{

        //Se parametro de estatisticas não forem encontradas criar um novo
        if (!array_key_exists('stats', $this->meta)) {
            $this->meta['stats']['value'] = [];
        }

        //Atribui estatisticas existentes a var
        $currentStats = $this->meta['stats']['value'];

        //Se estatisticas estiveren nula, atribuir atributos vazios
        if(is_null($this->stats)){
            $this->stats = $this->attr;
        }

        //Percorrer estatisticas e atribuir novos dados
        foreach ($this->stats as $sport => $stats) { 

            //Se esporte existir no perfil, atualiza os dados já preenchidos
            if (array_key_exists($sport, $currentStats)) {
                
                //Atribui Valores armazenados
                $r = $currentStats[$sport];
                
                //Atualiza os valores com novos, baseado em keys do array
                //$currentStats[$sport] = array_replace($r, $stats);

                //Sobre com novo dados enviados
                $currentStats[$sport] = $stats;

                continue;
            }

            //Atribui array de esporte inteiro ao array
            $currentStats[$sport] = $this->stats[$sport];

        }

        //Retorna array para ser salvo ou atualizado em banco
        return ['value' => $currentStats];
    }

    /** 
     * Função para compatibilidade de versão anterior do app atletasNOW v1.0 
     * Versão 1.0, armazena dados diretamente, sem definir o tipo de esporte
     * 
     * @since 2.0
     * */
    private function arrangeInsertedData($stats) {

        //Se estatisticas não estiver no formato de array
        if(!is_array($stats)){
            return;
        } 
        
        //Retorna a chave atual
        $currentSport = key($stats);
        
        //Key escapados para coincidir
        $arr = [];
        /*foreach ($stats[$currentSport] as $item => $content) {
            $arr[$this->subsChar($item)] = $content; //escape    
        }*/

        $arr = $stats[$currentSport];
        //Verifica se esporte existe no array de atributos
        if(!array_key_exists($currentSport, $this->attr)){
            return false;
        }

        //Percorre array para atribuir dados
        foreach ($this->attr[$currentSport] as $key => $value) {   
            
            //Setando variavel
            //$key = $this->subsChar($key); //escape            

            foreach($value as $i => $c){
                
                //Converte key em formato escapado
                //$i = $this->subsChar($i);  
                
                //Se key não existir, próximo key
                if (!isset( $arr[$key]) || !array_key_exists($i, $arr[$key])){
                    continue;
                }

                //Campos de strings comuns
                $this->stats[$currentSport][$key][$i] = $arr[$key][$i];

                //Verifica se chaves coincidem e que valor deve ser número
                /*if (!in_array($i, ['time']) && !empty($arr[$key][$i])) {
                    preg_match('/[-0-9]+/', $arr[$key][$i], $insert);
                    //Atribui valor via regex
                    $this->stats[$currentSport][$key][$i] = (int) $insert[0];
                }
                else {
                    //Campos de strings comuns
                    $this->stats[$currentSport][$key][$i] = $arr[$key][$i];
                }*/

            }  

        }

    }

    /**
     * Retorna atributos do atleta por tipo de esporte
     * 
     * @since 2.0 
     * @return mixed
     */
    private function getSportAttributes() {

        //Inicializa array
        $sportName = [];

        //Percorre array e coverte caracteres
        foreach ($this->sport as $key => $value) {
            $sportName[] = $this->subsChar($value['sport_name']); 
        }          

        //Carrega listagem de atributos dos esportes
        $sportList = $this->attr = require(__DIR__ . '/stats/StatsModel.php');
        
        //Retorna esportes e atributos do usuário
        return array_only($sportList, $sportName);
    } 

    /** 
     * Formata string para formato de key em array 
     * 
     * @since 2.0
     * @return string
     * */
    private function subsChar(string $string):string {

        //Array de caracteres a substituir
        $chars = array(    
            'Š'=>'S', 'š'=>'s', 'Ž'=>'Z', 'ž'=>'z', 'À'=>'A', 'Á'=>'A', 'Â'=>'A', 'Ã'=>'A', 'Ä'=>'A', 'Å'=>'A', 'Æ'=>'A', 'Ç'=>'C', 'È'=>'E', 'É'=>'E',
            'Ê'=>'E', 'Ë'=>'E', 'Ì'=>'I', 'Í'=>'I', 'Î'=>'I', 'Ï'=>'I', 'Ñ'=>'N', 'Ò'=>'O', 'Ó'=>'O', 'Ô'=>'O', 'Õ'=>'O', 'Ö'=>'O', 'Ø'=>'O', 'Ù'=>'U',
            'Ú'=>'U', 'Û'=>'U', 'Ü'=>'U', 'Ý'=>'Y', 'Þ'=>'B', 'ß'=>'Ss', 'à'=>'a', 'á'=>'a', 'â'=>'a', 'ã'=>'a', 'ä'=>'a', 'å'=>'a', 'æ'=>'a', 'ç'=>'c',
            'è'=>'e', 'é'=>'e', 'ê'=>'e', 'ë'=>'e', 'ì'=>'i', 'í'=>'i', 'î'=>'i', 'ï'=>'i', 'ð'=>'o', 'ñ'=>'n', 'ò'=>'o', 'ó'=>'o', 'ô'=>'o', 'õ'=>'o',
            'ö'=>'o', 'ø'=>'o', 'ù'=>'u', 'ú'=>'u', 'û'=>'u', 'ý'=>'y', 'þ'=>'b', 'ÿ'=>'y',
            ' ' => '-'
        );
        
        //formata string em caixa baixa e retorna
        return strtolower(strtr( $string, $chars ));

    }

}