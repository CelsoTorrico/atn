<?php 

namespace Core\Profile\Resume;

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

        //Atribui array ao array de detalhes
        $$data->profileDetails = [
            'Clubes' => $data->metadata->clubs, 
            'Formação' => $data->metadata->formacao, 
            'Cursos' => $data->metadata->cursos,
            'Títulos | Conquistas' => $data->metadata->titulos,
            'Eventos' => $data->metadata->eventos
        ];

        $html = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">

<head>
     <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>';
     
     $html = '<title>'.  $data->display_name . '</title>;

     <style type="text/css">
        * { margin: 0; padding: 0; }
        body { background-color: #000, color:#fff; }
     </style>
</head>

<body style="font: 16px Helvetica, Sans-Serif; line-height: 24px; background: url(images/noise.jpg);">

    <div id="page-wrap" style="width: 800px; margin: 40px auto 60px;">';
    
        $html .= '<img src="' . $data->profile_img .'" alt="Photo" id="pic" style="position:absolute;float: right; margin: -30px 0 0 0;width:100px;" />
    
        <div id="contact-info" class="vcard">
        
            <!-- Microformats! -->';

        $html .= '<h1 class="fn" style="margin: 0 0 16px 0; padding: 0 0 16px 0; font-size: 32px; font-weight: bold; letter-spacing: -2px; border-bottom: 1px solid #999;">' . $data->display_name .'</h1>';
        
        $html .= '<p style="margin: 0 0 16px 0;">
                Telefone: <span class="tel">' . $data->telefone  .'</span><br />
                Email: ' . $data->user_email  .'</a>
            </p>
        </div>
                
        <div id="objective">
            <p style="margin: 0 0 16px 0;">'. $data->biography .'</p>
        </div>
        
        <div class="clear" style="clear: both;"></div>
        
        <dl>
            <dd class="clear" style="clear: both;width: 600px; float: right;"></dd>';

        foreach ($data->profileDetails as $key => $value) {

            //Se não for array de valores
            if (!is_array($value) || count($value) <= 0) {
                continue;
            }
            
            $html .= '<dt style="font-style: italic; font-weight: bold; font-size: 18px; text-align: right; padding: 0 26px 0 0; width: 150px; float: left; height: 100px; border-right: 1px solid #999;">' . ucwords($key) .'</dt><dd style="width: 400px; float: left;">';

            //Percorre array e atribui data ao html
            foreach ($value as $k => $v) {

                //Se for array atribui valores 
                if (is_array($v) && key_exists('club_name', $v)) {
                    $t = $v['club_name'];
                    $v = (key_exists('certify', $v))? '<span style="position: absolute; bottom: 0; right: 0; font-style: italic; font-family: Georgia, Serif; font-size: 16px; color: #999; font-weight: normal;">'. $v['certify'] . '</span>':'';
                    //Atribui ao html
                    $html .= '<h2 style="font-size: 20px; margin: 0 0 6px 0; position: relative;">'. $t .'</h2><p style="margin: 0 0 16px 0;">'. $v .'<br />';
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
}
