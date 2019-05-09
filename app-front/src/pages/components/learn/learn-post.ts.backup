import { ToastController, NavParams } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Api } from '../../../providers';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'learn-post',
  template: `
    <ion-item>
        <ion-item-divider>
            <ion-row>
                <ion-col>
                    <ion-item>
                        <ion-thumbnail>
                            <img />
                        </ion-thumbnail>
                        <ion-label>{{ currentLearnItem.post_content }}</ion-label>
                    </ion-item>
                </ion-col>
                <ion-col col-2>
                    Viz
                </ion-col>
                <ion-col col-2>
                    <button ion-button end (click)="openComment(currentLearnItem.ID)">
                        {{ "Ver mais" | translate }}
                    </button>
                </ion-col>
            </ion-row>
        </ion-item-divider>
    </ion-item>
  ` 
})
export class LearnPost {

  public $postID:number;
  
  @Input() public currentLearnItem:any = {
    ID: '',
    attachment: '',
    guid: '',
    post_author: {
      ID: '',
      display_name: '',
      profile_img: {

      }
    },
    post_content: '',
    post_date: '',
    post_type: '',
    quantity_comments: ''
  }; 

  public commentText:any = { comment_content : <string> ''};

  public commentShow:any;

  public static getLearnUrl = 'learn/';

  constructor(
    public api: Api,
    public navCtrl: NavController, 
    private toastCtrl: ToastController,
    private params: NavParams,  
    public translateService: TranslateService) { 
        this.translateService.setDefaultLang('pt-br');
        
        //Adicionando enviadors da view anterior
        this.$postID = this.params.get('post_id');  
    } 

  //Retorna
  ngOnInit() {

  }

  //Mostrar campo de comentário
  openComment(event) {
    event.preventDefault();
  }

  //Submeter um comentário ao post
  submitComment($postID:number, form:NgForm, event) {
    
    event.preventDefault();

    //Se formulário estiver inválido, mostrar mensagem
    if (form.status == 'INVALID') {
        
        let toast = this.toastCtrl.create({
          message: 'Preencha os campos de email e senha!',
          duration: 4000,
          position:'bottom'
        });

        toast.present();
        
        return;
    }

    //Enviado um comentário a determinada timeline
    let items = this.api.post(LearnPost.getLearnUrl + $postID, this.commentText).subscribe((resp:any) => {
       
      //Se não existir items a exibir
      if(resp.length <= 0){
        return;
      }

      //Sucesso 
      if(resp.success != undefined){
        
        let toast = this.toastCtrl.create({
          message: resp.success.comment,
          duration: 4000,
          position:'bottom'
        });

        toast.present();
      }     

    }, err => { 
        return; 
    }); 
    
  }

}
