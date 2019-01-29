import { MemberItem } from './item/member-item';
import { Component, Input } from '@angular/core';
import { ModalController, NavController } from 'ionic-angular';
import { Api } from '../../../providers';

@Component({
  selector: 'member-container',
  templateUrl: 'member.html'
})
export class Member {

    @Input() public listMembers:any[];

    private getMemberUrl:string = 'user';
  
    constructor(
        public api: Api,
        public navCtrl: NavController, 
        public modalCtrl: ModalController ) {} 

    //Retorna
    ngOnInit() {
        if (this.listMembers == undefined ){
            this.queryMembers();
        }
    }

    //Seta a url para requisição
    public setMemberUrl($url:string){
        return this.getMemberUrl = $url;
    }

    //Retorna os membros
    queryMembers(){
        //Retorna a lista de esportes do banco e atribui ao seletor
        let items = this.api.get(this.getMemberUrl).subscribe((resp:any) => {        
            //Se não existir items a exibir
            if(resp.length > 0){            
                //Retorna array de membros
                this.listMembers = resp;
            }
        }, err => { 
            return; 
        });

    }

    //Carregar comentários
    getItem($postID:number, event) {
        event.preventDefault();

        //Invoca um modal passando ID da Timeline
        let modal = this.modalCtrl.create(MemberItem, { post_id: $postID });
        modal.present(); 
    }

}
