import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Api } from '../../../providers';

@Component({
  selector: 'comments',
  templateUrl: 'comment-item.html'
})
export class CommentItem {

  @Input() public currentCommentItems: any = [
    {
      comment_ID: '',
      comment_author: '',
      comment_date: '',
      comment_content: '',
      responses: []
    }
  ];

  @Input() public $postID: number;

  constructor(
    public api: Api,
    public navCtrl: NavController) {}

  //Retorna
  ngOnInit() {

  }

  //Mostrar campo de comentário
  openComment($commentID: number, event) {
    event.preventDefault();
    let $form = document.getElementById('form-' + $commentID);
    $form.style.display = 'block';
  }

  //Abre uma nova página de profile
  goToProfile($user_id: number) {
    this.navCtrl.push('ProfilePage', {
      user_id: $user_id
    });
  }


}
