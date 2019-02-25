import { NavParams } from 'ionic-angular';
import { Component, Input, SimpleChange } from '@angular/core';
import { Api, User } from '../../../providers';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'chat-room',
    templateUrl: 'chat.html'
})
export class Chat {

    @Input() public $roomID: number;

    public $chatMessages: any[];

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

    private $getChatMessagesUrl: string = 'chat/';

    constructor(public api: Api, public params: NavParams, public user: User, private socket: Socket) {

        //Função para adicionar chat para abrir inicialmente
        this.openChat = this.params.get('room_open');

        //Função que executa após o envio de mensagens
        //Recupea dados do socket.IO
        this.getMessages().subscribe((message:any) => {

            //Se string estiver vazia
            if(message == ''){
                return;
            }

            //Transforma strinf em formato json
            let messageObj = JSON.parse(message);

            //Atribui valores de modo a ser exibido corretamente
            this.messageModel.author.ID = messageObj.author_id;
            this.messageModel.content   = messageObj.content;

            //Adiciona ao último item da lista
            this.$chatMessages.unshift(this.messageModel);
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

    //Quando ocorrer mudança nos atributos da classe
    ngOnChanges(changes: SimpleChange) {
        if (this.$roomID != undefined) {
            this.socket.connect();
            this.getRoomMessages();
        }
    }

    //Abre chat com mensagens
    private getRoomMessages() {

        //Retorna a lista de esportes do banco e atribui ao seletor
        this.api.get(this.$getChatMessagesUrl + this.$roomID).subscribe((resp: any) => {

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
            this.$chatMessages = resp;
            this.$chatNoMessages = '';

        }, err => {
            return;
        });

    }

    //Abre uma nova página de profile
    addRoomMessage($event) {

        $event.preventDefault();

        //Retorna a lista de esportes do banco e atribui ao seletor
        this.api.post(this.$getChatMessagesUrl + this.$roomID, { chat_content: this.$message })
            .subscribe((resp: any) => {
                //Limpa o campo
                this.$message = '';
            }, err => {
                return;
            });

    }

    getMessages():Observable<{}> {
        let observable = new Observable(observer => {
            this.socket.on('addMessage', (data) => {
                observer.next(data);
            });
        })
        return observable;
    }

}