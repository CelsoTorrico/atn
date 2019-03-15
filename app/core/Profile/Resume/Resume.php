<?php 


namespace Core\Profile\Resume;
use Core\Database\SportModel;
use Core\Database\UserModel;

class Resume {

    private $html;
    private $data;
    private $valid;

    function __construct($user, $validDataUser) {
        
        if(!is_object($user)){
            return;
        }

        $this->data     = $user;
        $this->valid    = $validDataUser;
    }
    
    private function defineHTML(){

        $data = $this->data;

        //Array de dados do usuário
        $profileMain = [
            'Telefone' => 'telefone',
            'Gênero' => 'gender',
            'Data de Nascimento' => 'birthdate', 
            'CPF' => 'cpf', 
            'RG' => 'rg', 
            'CNPJ' => 'cnpj',
            'Endereço' => 'address', 
            'Bairro' => 'neighbornhood', 
            'Cidade' => 'city', 
            'Estado' => 'state', 
            'País' => 'country',
            'CEP'   => 'zipcode'
        ];

        //Array de dados do usuário
        $profileDetails = [
            'Esportes'  => 'sport',
            'Clubes'    => 'clubes', 
            'Formação'  => 'formacao', 
            'Cursos'    => 'cursos',
            'Eventos'   => 'eventos',
            'Torneios'  => 'club_liga',
            'Títulos | Conquistas' => 'titulos-conquistas',
        ];

        /** Dados Pessoais e Empresariais */
        $html = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">

<head>
     <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>';
     
     $html.= '<title>'.  $data->display_name . '</title>;

     <style type="text/css">
        * { margin: 0; padding: 0; }
        body { background-color: #000, color:#fff; }
     </style>
</head>

<body style="font: 16px Helvetica, Sans-Serif; line-height: 24px; background: url(images/noise.jpg);">

    <div id="page-wrap" style="width: 800px; margin: 40px auto 60px;">';
    
        $html .= '<table style="width:100%;margin:0;padding:0;border:0;">
                    <tr>
                        <td valign="top" style="margin:0 15px 0 0;padding:0;border:0;">
                            <img src="' . 
                                $this->isAtributeSet('profile_img', $data->metadata) 
                            .'" alt="Photo" id="pic" style="position:relative; float:left; margin: 30px 15px 15px 0px;width:100px;" />
                        </td>
                        <td valign="top" style="margin:0;padding:0;border:0;">
                            <div id="contact-info" class="vcard">        
                            <!-- Microformats! -->
                            <h1 class="fn" style="margin: 0 0 35px 0; padding: 0 0 20px 0; font-size: 32px; font-weight: bold; letter-spacing: -2px; border-bottom: 1px solid #999;">' . $data->display_name .'</h1><br />
                            <div id="objective">
                                <p style="margin: 0 0 16px 0;">'
                                . $this->isAtributeSet('biography', $data->metadata)
                                .'</p>
                            </div>
                        </td>
                    </tr>
                </table>

                <hr />

                <table style="width:100%;margin:0;padding:0;border:0;">
                    <tr>
                        <td valign="top" style="margin:0 15px 0 0;padding:0;border:0;width:50%;">
                            <h2 class="fn" style="margin: 0 0 35px 0; padding: 0 0 20px 0; font-size: 18px; font-weight: bold; letter-spacing: -2px;">Dados Pessoais</h2>
                            <p style="margin: 0 0 16px 0;font-size:13px;">';

        foreach ($profileMain as $key => $value) {

            //Se não existir pula
            if(!key_exists($value, $data->metadata)){
                continue;
            }

            //Adicionado ao metadata
            $value = $this->isAtributeSet($value, $data->metadata);

            $html .= '<strong>'. ucwords($key) .':</strong> <span>' . $value  .'</span><br />';

        }
        
        $html .= '          </p>
                        </td>
                        <td valign="top" style="margin:0;padding:0 0 0 10px;border:0;">
                            <h2 class="fn" style="margin: 0 0 35px 0; padding: 0 0 20px 0; font-size: 18px; font-weight: bold; letter-spacing: -2px;">Dados Esportivos</h2>
                            <p style="margin: 0 0 0 16px;font-size:13px;">';

        //Criando array com apenas dados não mostrados 
        $keys = array_keys(array_flip(array_merge($profileMain, $profileDetails)));
        $metadata = array_diff_key(array_flip($this->valid), array_flip($keys));

        foreach( $metadata as $key => $value){
            
            //Se não existir pula
            if(!key_exists($key, $data->metadata)){
                continue;
            }

            //Ignorar estes dados
            if(in_array($key, ['my-videos', 'profile_img', 'type', 'views', 'searched_profile', 'biography', 'session_tokens', 'stats'])){
                continue;
            }

            //Adicionado ao metadata
            $value = $this->isAtributeSet($key, $data->metadata);

            $html .= '<strong>'. ucwords($key) .':</strong> <span>' . $value  .'</span><br />';
        }
                            
        $html .=        '</p>
                        </td>
                    </tr>
                </table>  
                
                <hr />
                
        </div>
        
        <div class="clear" style="clear: both;"></div>
        
        <dl><dd class="clear" style="clear: both;width: 600px; float: right;"></dd>';        
        

        foreach ($profileDetails as $key => $value) {

            //Se não existir pula
            if(!key_exists($value, $data->metadata)){
                continue;
            }

            //Adicionado ao metadata
            $value = (key_exists('value', $data->metadata[$value])) ? $data->metadata[$value]['value'] : $data->metadata[$value];

            //Se não for array de valores
            if (!is_array($value) || count($value) <= 0) {
                continue;
            }
            
            $html .= '<dt style="font-style: italic; font-weight: bold; font-size: 18px; text-align: right; padding: 0 26px 0 0; width: 150px; float: left; height: 100px; border-right: 1px solid #999;">' . ucwords($key) .'</dt><dd style="width: 400px; float: left;">';

            //Percorre array e atribui data ao html
            foreach ($value as $k => $v) {

                //Se for array atribui valores 
                if ($key == 'Clubes') {

                    $club_certify = (key_exists('certify', $v))? '<span style="position: absolute; bottom: 0; right: 0; font-style: italic; font-family: Georgia, Serif; font-size: 16px; color: #999; font-weight: normal;">'. $v['certify'] . '</span>':'';
                    
                    if (!key_exists('ID', $v)){
                        //Atribui ao html
                        $html .= '<p style="margin: 0 0 16px 0;">'. $v['club_name'] . $club_certify.'<br />';
                    } else {
                        $model = new UserModel;
                        $club = $model->load(['ID' => $v['ID']]);                        
                        //Atribui ao html
                        $html .= '<p style="margin: 0 0 16px 0;">'. $model->display_name . $club_certify.'<br />';
                    }                   

                }//Se for array atribui valores 
                else if ($key == 'Esportes') {
                    
                    $model = new SportModel;
                    $sport = $model->load(['ID' => $v]);
                    
                    //Atribui ao html
                    $html .= ($sport)? '<div style="margin: 0 10px 10px 0;">'. $model->sport_name .'</div>': '';

                }//Se for array atribui valores 
                else{
                    //Atribui ao html
                    $html .= '<h2 style="font-size: 20px; margin: 0 0 6px 0; position: relative;">'. $v[0] .'</h2><p style="margin: 0 0 16px 0;">'. $v[1] .'<br />' . $v[2].'<br />';
                }
            }
            
            $html .='</p></dd><dd class="clear" style="clear: both;width: 600px; float: right;"></dd>';
        }
        
        $html .= '<div class="clear" style="clear: both;"></div></div></body></html>';

        $this->html = $html;
    }

    public function returnHTML(){
        $this->defineHTML();
        return $this->html;
    }

    private function isAtributeSet($key, $array) {

        //Adicionado ao metadata
        $value = (key_exists($key, $array)) ? $array[$key] : null;

        //Se não existir retornar vazio
        if(is_null($value)){
            return '';
        }

        //Retorna dados armazenado na key 'value' se existir
        return (key_exists('value', $value))? $value['value'] : $value;

    }

}
