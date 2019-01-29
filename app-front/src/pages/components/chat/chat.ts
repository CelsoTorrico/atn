import { NavParams } from 'ionic-angular';
import { Component, Input, SimpleChange } from '@angular/core';
import { Api, User } from '../../../providers';

@Component({
    selector: 'chat-room',
    templateUrl: 'chat.html'
})
export class Chat {

    @Input() public $roomID: number; 

    public $chatMessages: any[];

    public $chatNoMessages:string;

    public $message:string = '';

    private $getChatMessagesUrl: string = 'chat/';

    constructor(public api: Api, public params: NavParams, public user: User) { }

    //Quando iniciar classe
    ngOnInit() {
        if(this.$roomID != undefined){
            this.getRoomMessages();    
        }        
    }

    //Quando ocorrer mudança nos atributos da classe
    ngOnChanges(changes: SimpleChange) {
        if(this.$roomID != undefined){
            this.getRoomMessages();    
        }
    }

    //Abre uma nova página de profile
    private getRoomMessages() {

        //Retorna a lista de esportes do banco e atribui ao seletor
        this.api.get(this.$getChatMessagesUrl + this.$roomID).subscribe((resp: any) => {

            //Se não existir items a exibir
            if (resp.length <= 0) {
                return;
            }

            //Exibe erro
            if(resp.error){
                this.$chatNoMessages = resp.error.chat;
                this.$chatMessages = [];
                return;
            }

            //Adicionando valores a variavel global
            this.$chatMessages = resp;
            this.$chatNoMessages = '';

        }, err => {
            return;
        });

    }

    //Envia mensagem para room em contexto
    sendMessage($event){
        
        //Só submeter quando clicar em Enter
        if ($event.code != 'Enter') { 
            return;
        }

        //Envia para servidor
        this.addRoomMessage();
    }

    //Abre uma nova página de profile
    private addRoomMessage() {

        //Retorna a lista de esportes do banco e atribui ao seletor
        this.api.post(this.$getChatMessagesUrl + this.$roomID, { 'chat_content' : this.$message } ).subscribe((resp: any) => {

            //Reseta campo de mensagem
            this.$message = '';

            //Exibe erro
            if(resp.error){
                this.$chatNoMessages = resp.error.chat;
                return;
            } 

            //Carrega novamente as mensagem atualizando
            this.getRoomMessages();

        }, err => {
            return;
        });

    }

}