<?php 

namespace Core\Service;

use Core\Profile\UserClub;
use Core\Service\Sport;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Chart\Chart;
use PhpOffice\PhpSpreadsheet\Chart\DataSeriesValues;
use PhpOffice\PhpSpreadsheet\Chart\DataSeries;
use PhpOffice\PhpSpreadsheet\Chart\Layout;
use PhpOffice\PhpSpreadsheet\Chart\PlotArea;
use PhpOffice\PhpSpreadsheet\Chart\Legend;
use PhpOffice\PhpSpreadsheet\Chart\Title;
use PhpOffice\PhpSpreadsheet\IOFactory;
use RecursiveIteratorIterator;
use RecursiveArrayIterator;

/**
 * Classe para exportar relatórios de uso e outras info 
 * 
 * @param UserClub $user    Usuário de contexto para acesso as funcionalidades
 */
class Report {

    public      $user; //user
    protected   $id;
    public      $spreadsheet;
    private     $recursive;
    
    //Contrução da classe
    public function __construct(UserClub $user) {

        //Inicializa modelos e classes
        $this->user = $user;
        $this->spreadsheet = new Spreadsheet();
    }

    /**
     * Retorna relatório em formato JSON
     * 
     * @since 2.1     * 
     * @param array $user_ids   Array de ids de usuários
     * @param array $filter     Array com os parametros da pesquisa de usuarios
     * 
     * @return array
     */
    function get(Array $user_ids, Array $filter = []):array{
        
        //Validar e sanitizar os id's de usuários
        $user_ids = filter_var_array($user_ids, FILTER_SANITIZE_NUMBER_INT);

        //Retornar qtd total de usuários do clube
        $total = count($this->user->getTeamUsers());

        //Retornar array de usuários com dados dos mesmos
        $list_users = $this->user->getTeamUsers($user_ids, FALSE);
        $totalFilter = count($list_users);

        //Atribuindo o nome do tipo de usuário
        if(key_exists('type', $filter) && !empty($filter['type'])) {
            //Função para retornar apenas nomeclatura do tipo
            $filter['type'] = $this->user->getUserType($filter['type'], false);
        }

        //Atribuindo o nome do esporte pelo id
        if(key_exists('sport', $filter) && !empty($filter['sport'])) {
            $sport = new Sport();
            foreach ($filter['sport'] as $key => $value ) {
                $filter['sport'][$key] = $sport->_getSport((int) $value); 
            }            
        }

        //Estruturando array de dados
        $export = [
            'total'     => ['Total de Usuários', $total],
            'found'     => ['Total de Usuários exportados', $totalFilter],
            'fields'    => ['Filtros utilizados', $filter],
            'users'     => ['Lista de Usuários', $list_users]
        ];

        //Retorna
        return $export;
    }

    /**
     * Retorna relatório em formato JSON
     * 
     * @since 2.1
     * @param array $export     Array com dados estruturados
     * @param bool $format      True para PDF e False para XLS
     *       
     * @return file
     */
    function download(Array $export, bool $format = true) {
        //Executa fn e retorna
        return $this->downloadFile($export, $format);
    }

    /**
     * Exporta relatório formato de PDF ou Excel
     * 
     * @since 2.1
     * @param array $export Array com dados para montar arquivo
     * @param bool $format Tipo de formato, true em 'pdf' e false para 'xls' 
     * 
     * @return file
     */
    private function downloadFile(Array $export, bool $isPDF = false) {
        
        //Inicializando string
        $filename = '';

        //Criando worksheets
        $chartSheet = new Worksheet($this->spreadsheet, 'Geral');
        $chartSheet->getPageSetup()->setFitToWidth(1);

        $sheet = new Worksheet($this->spreadsheet, 'Lista de Usuários');
        $sheet->getPageSetup()->setFitToWidth(1); 
        
        //Adicionando os worksheets ao arquivo
        $this->spreadsheet->addSheet($chartSheet, 1);
        $this->spreadsheet->addSheet($sheet, 2);
        
        //Remove default worksheet
        $this->spreadsheet->removeSheetByIndex(0);
        
        //Organiza conteúdo para worksheet
        $this->dataUsersComposer($sheet, $export);
        
        //Insere gráfico
        $this->chartComposer($chartSheet, $export);
        
        //Inicializa documento xlsx
        if ($isPDF) {
            $writer = IOFactory::createWriter($this->spreadsheet, 'Mpdf');
            $writer->writeAllSheets();
            $ext = 'pdf';
        } else {
            $writer = IOFactory::createWriter($this->spreadsheet, 'Xlsx');
            $ext = 'xlsx';
        }
        
        //Setar arquivo para suportar gráfico
        $writer->setIncludeCharts(true);

        //Verifica se diretório de cache existe
        if(!is_dir(env('APP_IMAGES'))) {
            //Cria se não existir
            mkdir(env('APP_IMAGES'), 644);
        }
        
        //Salvar arquivo
        $writer->save($path = env('APP_IMAGES').'report.'.$ext);
        
        //Retorna string com caminho do arquivo
        return $path;
    }


    /** 
     * Função de fazer a composição do relatório  
     * 
     * @param Worksheet $sheet  Objeto do tipo Worksheet
     * @param array $data   Array com dados de usuário
     * @since 2.1
     * */
    private function dataUsersComposer(Worksheet $sheet, Array $data = []) {

        $this->id = null; //A ser utilizado na criação das estatisticas de esporte

        //Função para interar sobre dados de usuário e atribuindo a arquivo Excel
        $recursive = function(Array $array, Worksheet $sheet, int $r = 0, int $c = 0, bool $showName = false) {

            //Atribuir ID do usuario no loop
            if (key_exists('ID', $array))
                $this->id = (int) $array['ID'];  

            //Adiciona keys inseridas para não haver repetição de dados
            $repeated = ['user_login', 'favorite', 'following', 'totalFavorite', 'totalMessages', 'totalNotifications', 'session_tokens', 'searched_profile', 'my-videos', 'views'];
            
            foreach ( $array as $key =>  $value ) { 

                // Chaves de dados a ignorar
                if (in_array($key, $repeated)) {
                    continue;
                }

                //Nome da chave de dado
                ($showName)?: $sheet->setCellValueByColumnAndRow($c, 1, $key);

                // Se for atributos de metadata invocar metódo novamente
                // Fazer uma verificação com modelo de usermeta completa adicionando todas as chaves e fazendo os dados dos usuários preencher planilha corretamente
                if ($key == 'metadata') {  
                    
                    //Atribuindo todos os tipos de dados de usuário
                    $usermetas = $this->user->getUsermetaFields();
                    
                    //Combinando array de dados de usuário com campos disponíveis
                    $value = array_merge(array_fill_keys($usermetas, ''), $value);

                    //Removendo campos repetidos no perfil
                    unset($value['type']);
                    unset($value['sport']);
                    unset($value['clubes']);
                    unset($value['stats-sports']);
                    
                    //Invocando função novamente com posição atual da coluna
                    $recursive = $this->recursive;
                    $recursive($value, $sheet, $r, $c, false);
                    continue;

                } elseif (is_array($value)) {
                    
                    //Inicializando variavel para atrubuir dados
                    $newValue = '';

                    //Percorrer os valores de usermeta 'clubs'
                    if (in_array($key, ['clubs', 'sport', 'formacao', 'cursos', 'titulos-conquistas', 'eventos', 'club_liga'])  && count($value) > 0) {
                        //Se existir key 'value'
                        $value = (key_exists('value', $value))? $value['value'] : $value;

                        //Se vazio, pular proximo
                        if (empty($value)) continue;

                        //Percorre array e transforma em string
                        foreach ($value as $k => $v) {
                            //Atribuindo valor
                            $newValue .= implode('-', $v) . ', ';
                        }

                    } elseif ($key == 'stats') {

                        //Se não existir valor na metadata
                        if(!key_exists('value', $value) || count($value['value']) <= 0){
                            continue;
                        }

                        //Interando e escrevando dados no arquivo
                        foreach ($value['value'] as $k => $v) {

                            //Instanciando interador
                            if (is_array($v)) {
                                //Tranforma array em objeto
                                $i = new RecursiveIteratorIterator(new RecursiveArrayIterator($v));
                                //Verifica se existem dados abaixo
                                if(!$i->callHasChildren())
                                continue;
                            } else {
                                //Se nessa etapa o dado não for array, pular proximo
                                continue;
                            }                           

                            //Verifica se existe worksheet, se não cria novo
                            $statSheet = (is_null($s = $this->spreadsheet->getSheetByName($k)))? new Worksheet($this->spreadsheet, $k) : $s;  

                            //Adicionando planilha / worksheet
                            $this->spreadsheet->addSheet($statSheet);

                            $colName = $i->key(); //Nome da coluna
                            $row = 2; //Linha inicial 
                            $col = 2; //Coluna inicial

                            //Adicionando ID de usuário para inicio da coluna de dados
                            $statSheet->setCellValueByColumnAndRow(1, 1, 'ID');
                            $statSheet->setCellValueByColumnAndRow(1, $row, $this->id);

                            foreach ($i as $ia => $ib) {
                                //Escreve valores na posição definida do Excel
                                $statSheet->setCellValueByColumnAndRow($col, 1, $colName.': '.$ia);
                                $statSheet->setCellValueByColumnAndRow($col, $row, $ib);
                                $col++; //proxima coluna
                            }
                            $row++;//proxima linha

                        }
                        continue;

                    } elseif (key_exists('type', $value)) {
                        
                        //Verifica se existe chave e atribui valor
                        $newValue = $value['type'];

                    } elseif (key_exists('type', $value)) {
                        
                        //Verifica se existe chave e atribui valor
                        $newValue = $value['value'];

                    } else {
                        //Se novo valor for do tipo array, separar em string com virgula
                        $newValue = (is_array($value))? implode(', ', $value) : $value;
                    }
                    
                    //Se novo valor for do tipo array, separar em string com virgula
                    $newValue = (is_array($newValue))? implode(', ', $newValue) : $newValue;
                    
                    //Escreve valores na posição definida do Excel
                    $sheet->setCellValueByColumnAndRow($c, $r, $newValue);

                } else {                      
                    //Escreve valores na posição definida do Excel
                    $sheet->setCellValueByColumnAndRow($c, $r, $value);
                }                            
                
                //Adicionando elemento para não repetir em proximo loop
                $repeated[] = $key;

                $c++; //Somando valor no loop
            } 
        };

        //Atribuindo função a variavel
        $this->recursive = $recursive;

        //Interando sobre array de usuários pesquisados
        $r = 2; //Linha que inicia a listagem de usuario, 1 reservada para nomear colunas
        for ($i=0; $i < count($data['users'][1]) ; $i++) { 
            //A cada usuário, listar e escrever campos e dados
            $recursive($data['users'][1][$i], $sheet, $r, 1, ($i == 0)? true : false );
            $r++;
        }        

        return; //Encerra função

    }

     /** 
     * Função de fazer a composição do gráfico
     * 
     * @param Worksheet $sheet  Objeto do tipo Worksheet (PHPOffice)
     * @param array $data   Array com dados de usuário
     * @since 2.1
     * @todo 
     * */
    private function chartComposer(Worksheet $sheet, Array $data = []) {

        //Verifica se há valores gerais a inserir
        if (count($data) > 0) {
            //Total de usuários
            $sheet->setCellValueByColumnAndRow(1, 1, $data['total'][0]);
            $sheet->setCellValueByColumnAndRow(1, 2, $data['total'][1]);

            //Total de usuários encontrados
            $sheet->setCellValueByColumnAndRow(2, 1, $data['found'][0]);
            $sheet->setCellValueByColumnAndRow(2, 2, $data['found'][1]);

            //Campos usados na pesquisa
            $sheet->setCellValueByColumnAndRow(1, 4, $data['fields'][0]);

            $r = 5;
            foreach ($data['fields'][1] as $key => $value) {
                $sheet->setCellValueByColumnAndRow(1, $r, $key);

                //Se for array de valores
                $value = (is_array($value))? implode(', ', $value) : $value;

                $sheet->setCellValueByColumnAndRow(2, $r, $value);    
                $r++;
            } 
        } 

        //Criação de um gráfico para adicionar ao Excel (new Chart())
        $labels = [
            new DataSeriesValues(DataSeriesValues::DATASERIES_TYPE_STRING, 'Geral!$A$1', null, 1)
        ];

        $axis = [
            new DataSeriesValues(DataSeriesValues::DATASERIES_TYPE_STRING, 'Geral!$A$1:$B$1', null, 2)
        ];

        $values = [
            new DataSeriesValues(DataSeriesValues::DATASERIES_TYPE_NUMBER, 'Geral!$A$2:$B$2', null, 2)
        ];

        $series = new DataSeries(
            DataSeries::TYPE_PIECHART,
            null,
            range(0, count($values) - 1),
            $labels,
            $axis,
            $values            
        );

        $layout =   new Layout();
        $layout->setShowVal(true);
        $layout->setShowPercent(true);

        $plot =     new PlotArea($layout, [$series]);
        $legend =   new Legend(Legend::POSITION_RIGHT, null, false);
        $title =    new Title('Total Usuários');

        $chart = new Chart(
            'chart',
            $title,
            $legend,
            $plot,
            true,
            0,
            null,
            null
        );

        $chart->setTopLeftPosition('A20');
        $chart->setBottomRightPosition('H20');
        $d = $sheet->addChart($chart);

    }

}