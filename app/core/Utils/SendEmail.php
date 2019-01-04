<?php

namespace Core\Utils;

use Core\Database\PostModel;
use Core\Database\UsermetaModel;
use PHPMailer\PHPMailer\PHPMailer;

class SendEmail {

    private  $mail;
    private  $fromName;
    private  $toEmail;
    private  $content;

    /** 
     * Instancia classe PHPmailer
     * */
    public function __construct(){
        
        //Inicializando variaveis
        $this->mail = new PHPMailer();      

    }

    /** Seta destinatarios das mensagens */
    public function setToEmail($emails) {

        //Verifica se é array de dados
        if (!is_array($emails) || count($emails) <= 1) {
            throw new Exception('Email deve ser array de email');
        } 

        //Percorre array de emails e nomes
        foreach ($emails as $key => $value) {   
            
            //Se for array com vários emails e nomes
            if (is_array($value)) { 
                $this->toEmail[] = [
                    filter_var_array($value['email'], FILTER_SANITIZE_EMAIL),
                    filter_var_array($value['name'], FILTER_SANITIZE_STRING)
                ];
                continue;
            }             

            //Se for único destinatário
            if ($key == 'email') {
                $this->toEmail['email'] = filter_var($emails['email'], FILTER_SANITIZE_STRING);
            } else {
                $this->toEmail['name'] = filter_var($emails['name'], FILTER_SANITIZE_STRING);
            }            

        }        

    }

    /** Seta o nome do remetente da mensagem */
    public function setFromName(string $name) {
        if(!is_string($name)){
            throw new Exception('Nome deve ser string');
        }
        $this->fromName = $name;
    }

    /** Seta o nome do remetente da mensagem */
    public function setSubject(string $subject) {
        if(!is_string($subject)){
            throw new Exception('Assunto deve ser string');
        }
        $this->subject = $subject;
    }

    /** Seta conteúdo da mensagem */
    public function setContent($content) {

        if(!is_string($content)){
            throw new Exception('Nome deve ser string');
        }
        //Sanitize var
        $this->content = filter_var($content, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    }

    /**
     * Envia e-mail para configurações e setadas
     */
    public function send(){
        try {
            
            //Atribui classe a var da classe para reutilização em metodos
            $mail = $this->mail;   

            //Server settings
            $mail->SMTPDebug = 2;                       // Enable verbose debug output
            $mail->isSMTP();                            // Set mailer to use SMTP
            $mail->Host = env('SMTP_HOST');             // Specify main and backup SMTP servers
            $mail->SMTPAuth = true;                     // Enable SMTP authentication
            $mail->Username = env('USER_EMAIL');        // SMTP username
            $mail->Password = env('USER_PASS');         // SMTP password
            $mail->SMTPSecure = env('SMTP_SECURE');     // Enable TLS encryption, `ssl` also accepted
            $mail->Port = env('SMTP_PORT');             // TCP port to connect to
        
            //Recipients
            $mail->setFrom(env('SMTP_FROM_EMAIL'), $this->fromName);

            foreach ($this->toEmail as $key => $value) {
                
                //Se for array com vários emails e nomes
                if (is_array($value)) { 
                    $mail->addAddress($value['email'], $value['name']);
                    continue;
                }       
                //Se for único
                $mail->addAddress($this->toEmail['email'], $this->toEmail['name']); 
            }
        
            //Content
            $mail->isHTML(true);       // Set email format to HTML
            $mail->Subject = $this->subject;
            $mail->Body    = $this->content;
            $mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

            //Envia email
            $mail->send();

            return ['success' => ['Email' => 'Mensagem enviada.']];

        } catch (Exception $e) {
            
            return ['error' => ['Email' => 'Mensagem não pode ser enviada. Erro: '. $mail->ErrorInfo]];
        }        

    }

}