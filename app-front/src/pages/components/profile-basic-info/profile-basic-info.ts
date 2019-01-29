import { Component } from '@angular/core';
import { Api } from '../../../providers';

@Component({ 
  selector: 'profile-basic',
  templateUrl: 'profile-basic-info.html'
})
export class ProfileInfo {

  constructor(
    public api: Api) {}

  //Retorna
  ngOnInit() {
    
  }

}
