import { ToastController} from 'ionic-angular';
import { Component, Input } from '@angular/core';
import { Api } from '../../../providers';

@Component({
  selector: 'comment-form',
  template: `
        <ion-item-group [id]="'form-' + parentItem" style="display:none !important;">
            
          <ion-list>
              <ion-item>
                  <ion-avatar item-start>
                      <ion-img [src]="">User Img</ion-img> 
                  </ion-avatar>
                  <ion-textarea name="comment_content" [(ngModel)]="commentText" type="text" placeholder="{{ 'YOUR_COMMENT' | translate }}" required ></ion-textarea>
                  <button ion-button small end (click)="submitComment($event)">{{ "PUBLISH" | translate }}</button>
              </ion-item>
          </ion-list>                
            
        </ion-item-group>
  `
})
export class CommentForm {

  @Input() public parentItem:number;

  public commentText:string;

  constructor(
    public api: Api,
    private toastCtrl: ToastController ) {} 

  //Retorna
  ngOnInit() {
    
  }

  //Submeter um comentário ao post
  submitComment($event) {
    
    $event.preventDefault();

    //Enviado um comentário a determinada timeline
    let items = this.api.post('timeline/comment/' + this.parentItem, { comment_content : this.commentText}).subscribe((resp:any) => {
       
      //Se não existir items a exibir
      if(resp.length <= 0){
        return;
      }

      //Sucesso 
      if(resp.success != undefined){

        //Reseta campo
        this.commentText = '';
        
        let toast = this.toastCtrl.create({
          message: resp.success.comment,
          duration: 8000,
          position:'bottom'
        });

        toast.present();
      }     

    }, err => { 
        return; 
    }); 
    
  }


}
