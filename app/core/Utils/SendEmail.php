<?php

namespace Core\Utils;

use PHPMailer\PHPMailer\PHPMailer;

class SendEmail {

    private  $mail;
    private  $fromName;
    private  $toEmail;
    private  $content;
    private  $plainContent;

    /** 
     * Instancia classe PHPmailer
     * */
    public function __construct(){
        
        //Inicializando variaveis
        $this->mail = new PHPMailer();    
        $this->mail->CharSet = 'UTF-8';  
        $this->mail->Encoding = 'base64';
        $this->mail->isHTML(true);                  // Set email format to HTML
        
        //Server settings
        $this->mail->SMTPDebug = 0;                       // Enable verbose debug output
        $this->mail->isSMTP();                            // Set mailer to use SMTP
        $this->mail->Host = env('SMTP_HOST');             // Specify main and backup SMTP servers
        $this->mail->SMTPAuth = true;                     // Enable SMTP authentication
        $this->mail->Username = env('USER_EMAIL');        // SMTP username
        $this->mail->Password = env('USER_PASS');         // SMTP password
        $this->mail->SMTPSecure = env('SMTP_SECURE');     // Enable TLS encryption, `ssl` also accepted
        $this->mail->Port = env('SMTP_PORT');             // TCP port to connect to

    }

    /** Seta destinatarios das mensagens */
    public function setToEmail(array $emails) {

        //Verifica se é array de dados
        if (!is_array($emails) || count($emails) < 1) {
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
        $this->subject = html_entity_decode($subject);
    }

    /** Seta conteúdo da mensagem */
    public function setContent(string $content) {

        if(!is_string($content)){
            throw new Exception('Content must be string');
        }

        //Sanitize var
        $content = html_entity_decode(htmlspecialchars($content));
        $this->plainContent = $content;
        $this->content = "
        <html>
            <head>
                <title>Plataforma AtletasNOW</title>
                <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
            </head>
            <body>" . $content ."</body>
        </html>
        ";
    }

    /**
     * Envia e-mail para configurações e setadas
     */
    public function send(){
        try {
            
            //Atribui classe a var da classe para reutilização em metodos
            $mail = $this->mail;
        
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
        
            $mail->Subject = $this->subject;
            $mail->Body = $this->content;
            $mail->AltBody = $this->plainContent;

            //Envia email
            $mail->send();

            return ['success' => ['email' => 'Mensagem enviada.']];

        } catch (Exception $e) {
            
            return ['error' => ['email' => 'Mensagem não pode ser enviada. Erro: '. $mail->ErrorInfo]];
        }        

    }

}