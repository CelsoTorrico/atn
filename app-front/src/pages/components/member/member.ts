import { MemberItem } from './item/member-item';
import { Component, Input } from '@angular/core';
import { ModalController, NavController } from 'ionic-angular';
import { Api } from '../../../providers';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'member-container',
    templateUrl: 'member.html'
})
export class Member {

    @Input() public listMembers: any[];
    @Input() public isFollowers: boolean = false;

    private static getFollowingUrl: string = 'follow';
    private static getFollowersUrl: string = 'followers';
    private $url: string;

    constructor(
        public api: Api,
        public navCtrl: NavController,
        public modalCtrl: ModalController,
        public translateService: TranslateService) {

        this.translateService.setDefaultLang('pt-br');

        //Define url padrão de requisição de membros
        this.$url = Member.getFollowingUrl;
    }

    //Retorna
    ngOnInit() {

        //Verifica se foi definido exibir seguidores
        if (this.isFollowers) {
            this.$url = Member.getFollowersUrl;
        }

        //Se não há membros injetados, fazer query
        if (this.listMembers == undefined) {
            this.queryMembers();
        }
    }

    //Seta a url para requisição
    public setMemberUrl($url: string) {
        return this.$url = $url;
    }

    //Retorna os membros
    queryMembers() {
        //Retorna a lista de esportes do banco e atribui ao seletor
        let items = this.api.get(this.$url).subscribe((resp: any) => {
            //Se não existir items a exibir
            if (resp.length > 0) {
                //Retorna array de membros
                this.listMembers = resp;
            }
        }, err => {
            return;
        });

    }

    //Carregar comentários
    getItem($postID: number, event) {
        event.preventDefault();

        //Invoca um modal passando ID da Timeline
        let modal = this.modalCtrl.create(MemberItem, { post_id: $postID });
        modal.present();
    }

    /*//Carregar comentários
    //Abrir modal com dados para atualizar perfil
    editData($component: string, $data: any = undefined, $fn = () => { this.reloadUserData() }) {

        //Criar modal do respectivo component
        let modal = this.modalCtrl.create(MyProfileAddMemberDataComponent, { data: $data });
        modal.onDidDismiss((data) => {

            //Se modal foi fechado sem enviar dados  
            if (data == null || data == undefined) {
                return;
            }

            //Verificar há mais de um dado no array 
            if (Object.keys(data).length <= 0) {
                return;
            }

            //Se houve erro
            if (data.error != undefined) {
                return;
            }

            //Retorna mensagem proveninete do servidor
            let responseText = data.success[Object.keys(data.success)[0]];

            //Mostrar resposta
            let toast = this.toastCtrl.create({
                message: responseText,
                duration: 3000,
                position: "bottom"
            });

            toast.present();

            //Executar função
            $fn();

        });*/

}
