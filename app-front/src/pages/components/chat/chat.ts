import { NavParams } from 'ionic-angular';
import { Component, Input, SimpleChange } from '@angular/core';
import { Api, User } from '../../../providers';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'chat-room',
    templateUrl: 'chat.html'
})
export class Chat {

    @Input() public $roomID: number;

    public currentUser:any = {
        ID: <number>null
    };

    public $chatMessages: any[] = [];

    public $chatNoMessages: string;

    public $message: string = '';

    openChat:number;

    private messageModel:any = {
        author: {
            ID: <string>''
        },
        content: <string>'',
        viewer: <boolean>true,
        date: new Date()
    } 

    private static $getChatMessagesUrl: string = 'chat/';

    constructor(
        public api: Api, 
        public user: User, 
        public params: NavParams, 
        private socket: Socket,
        public translateService: TranslateService ) {

        this.translateService.setDefaultLang('pt-br');

        //Função para adicionar chat para abrir inicialmente
        this.openChat = this.params.get('room_open');

        //Retorna dados de usuário de contexto
        this.user.subscribeUser(function($this){
            $this.currentUser = $this.user._user;
        }, this); 

        //Função que executa após o envio de mensagens
        //Recupera dados do socket.IO
        this.getMessages().subscribe((message:any) => {

            //Se string estiver vazia
            if(message == ''){
                return;
            }

            //Transforma string em formato json
            let messageObj = JSON.parse(message);
            
            //Objeto de mensagem
            let messageToInsert = {
                author: {
                    ID: <string>''
                },
                content: <string>'',
                viewer: <boolean>true,
                date: new Date()
            };

            //Atribui valores de modo a ser exibido corretamente
            messageToInsert.author.ID = messageObj.author_id;
            messageToInsert.content   = messageObj.content;
            messageToInsert.viewer    = (this.currentUser.ID == messageObj.author_id)? true : false;

            //Adiciona ao último item da lista
            if (this.$chatMessages.unshift(messageToInsert)) {
                
                //Pegar elemento de container de mensagens
                let messageList = document.getElementsByClassName("messages-list");

                //Move tela até o fim
                setTimeout(function(){
                    messageList[0].scrollTop = 9999999999; 
                }, 300);
                
            }

        });
    }

    //Quando iniciar classe
    ngOnInit() {
        
        if(this.openChat != undefined){            
            this.$roomID = this.openChat;       
        }

        if (this.$roomID != undefined) {
            this.getRoomMessages();
        }
    }

    //Quando a view estiver carregada
    ngAfterContentInit() {
        this.activeChat();
    }

    //Quando ocorrer mudança nos atributos da classe
    ngOnChanges(changes: SimpleChange) {
        if (this.$roomID != undefined) {
            this.socket.connect();
            this.getRoomMessages();
            this.activeChat();  
        }
    }

    //Abre chat com mensagens
    private getRoomMessages() {

        //Retorna a lista de esportes do banco e atribui ao seletor
        this.api.get(Chat.$getChatMessagesUrl + this.$roomID).subscribe((resp: any) => {

            //Se não existir items a exibir
            if (resp.length <= 0) {
                return;
            }

            //Exibe erro
            if (resp.error) {
                this.$chatNoMessages = resp.error.chat;
                this.$chatMessages = [];
                return;
            }

            //Emite um evento para adicionar o contexto da room para o Redis
            let channel = resp[0].room_id;
            this.socket.emit('enterChannel', { channel: channel });

            //Adicionando valores a variavel global
            resp.forEach(element => {
                element.viewer = (this.currentUser.ID == element.author.ID)? true : false;
                this.$chatMessages.push(element);
            });

            //Mensagem se não houver mensagens
            this.$chatNoMessages = '';

            //Pegar elemento de container de mensagens
            let messageList = document.getElementsByClassName("messages-list");

            //Move tela até o fim
            setTimeout(function(){
                messageList[0].scrollTop = 9999999999; 
            }, 300);

        }, err => {
            return;
        });

    }

    //Abre uma nova página de profile
    addRoomMessage($event) {

        $event.preventDefault();

        //Retorna a lista de esportes do banco e atribui ao seletor
        this.api.post(Chat.$getChatMessagesUrl + this.$roomID, { chat_content: this.$message })
            .subscribe((resp: any) => {
                //Limpa o campo
                this.$message = '';
            }, err => {
                return;
            });

    }

    //Retorna observable que retorna mensagens
    getMessages():Observable<{}> {
        let observable = new Observable(observer => {
            this.socket.on('addMessage', (data) => {
                observer.next(data);
            });
        })
        return observable;
    }

    //Define uma conversa como selecionada
    activeChat() {
        let chats:NodeListOf<HTMLElement> = document.querySelectorAll("member-chat button");
        Array.from(chats).forEach(function(element, index) {
            element.style.backgroundColor = "#ffffff";
            if(element.classList.contains('activated') || element.id == 'chat' + this.$roomID) {
                element.style.backgroundColor = "#eeeeee";
            }        
        });        
    }

}