<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Core\Service\Report;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Illuminate\Http\UploadedFile;
use Core\Utils\FileUpload;

class ReportController extends Controller
{

    protected $report;
    
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(Request $request)
    {
        $this->report = new Report($request->user());
    }

    function get(Request $request) {
        
        //Verificando se os dados estão na requisição
        if (!$request->has('user_ids') || !$request->filled('user_ids')) {
            return ['error' => ['report' => 'Não foi possível consolidar o relatório com os dados informados. Tente novamente.']];
        }

        //Inicializa array vazio
        $filter = [];

        //Atribui valor dos filtros a variavel
        if ($request->has('filter') || $request->filled('filter')) {
            $filter = $request->input('filter');
        }

        //retorna resultado
        return response()->json($this->report->get($request->input('user_ids'), $filter));
    }

    function getFile(Request $request) {

        //Atributos de arquivo padrão 'Excel'
        $isPdf = false;
        $contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

        //Verifica se formato de arquivo solicitado 'pdf'
        if ('report/report.pdf' == $request->path()) {
            $isPdf = true;
            $contentType = 'application/pdf';
        }

        //Atribuindo dados exportados a var
        $export = $this->get($request);

        //Caminho do arquivo
        $file_path = $this->report->download(json_decode($export->content(), true), $isPdf);

        //retorna resultado
        $binaryFileResponse = new BinaryFileResponse($file_path, 200, ['Content-Type' => $contentType], true, 'attachment', true, true);

        //Classe de Arquivo
        $file = $binaryFileResponse->getFile();

        //Setando classe de upload
        $uploadFile = new UploadedFile($file->getPathname(), $file->getFilename(), $file->getMimeType());

        //Setando arquivo para upload
        $fileUpload = new FileUpload($this->report->user->ID, null, $uploadFile, 'report');
        
        //Insere arquivo na amazon e retorna resposta
        if ($fileUpload->insertFile()){
            return response()->json($fileUpload->lastInsertFileUrl);
        } else {
            return response()->json(['error' => ['report' => 'Houve erro ao gerar o relatório. Verifique com nosso suporte.']]);
        }

    }


}
