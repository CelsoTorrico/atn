import { ToastController} from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { Component, Input } from '@angular/core';
import { Api } from '../../../providers';

@Component({
  selector: 'comment-form',
  template: `
        <ion-item-group [id]="'form-' + parentItem">
            <form #commentForm="ngForm" name='commentForm' (ngSubmit)="submitComment(commentForm, $event)">
                <ion-list>
                    <ion-item>
                        <ion-avatar item-start>
                            <ion-img [src]="">User Img</ion-img>
                        </ion-avatar>
                        <ion-textarea name="comment_content" [(ngModel)]="commentText.comment_content" type="text" placeholder="{{ 'YOUR_COMMENT' | translate }}" required ></ion-textarea>
                    </ion-item>
                </ion-list>                
            </form>
        </ion-item-group>
  `
})
export class CommentForm {

  @Input() public parentItem:number;
  
  @Input()  public currentCommentItems:any[]; 

  public commentText:any = { comment_content : <string> ''};

  public commentShow:any;  

  constructor(
    public api: Api,
    private toastCtrl: ToastController ) {
      
    } 

  //Retorna
  ngOnInit() {
    
  }

  //Submeter um comentário ao post
  submitComment(form:NgForm, event) {
    
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
    let items = this.api.post('timeline/comment' + this.parentItem, this.commentText).subscribe((resp:any) => {
       
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
