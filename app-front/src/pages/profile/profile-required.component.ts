import { NgForm } from '@angular/forms';
import { User } from './../../providers/user/user';
import { profileTypeList } from './../../providers/profiletypes/profiletypes';
import { GenderList } from './../../providers/gender/gender';
import { Component, EventEmitter, Output } from '@angular/core';
import { BrazilStates } from '../../providers/useful/states';
import { SportList } from '../../providers/sport/sport';
import { animate } from "@angular/animations";

@Component({
  selector: 'profile-databox',
  template: `
      <div id="profile-required">

        <h2>Preencha as informações faltantes!</h2>

        <form #updateRequiredForm="ngForm" (submit)="submitRegister(updateRequiredForm); $event.preventDefault()">

          <ion-item-group>
          
            <ion-list>
              <ion-list-header stacked>
                {{ "PROFILE" | translate }}
              </ion-list-header>

              <ion-select id="tipo" [(ngModel)]="$typeUserSelected" name='typeUserSelected' full required>
                <ion-option *ngFor="let item of $typeUserList" [value]="item.valor">
                  {{item.texto}}
                </ion-option>
              </ion-select>

            </ion-list>

          </ion-item-group>

          <ion-item-group>

            <ion-list>

              <ion-list-header stacked>
                {{ "SPORTS" | translate }}
              </ion-list-header>

              <tag-input margin required [(ngModel)]="$sportsSelected" [addOnBlur]="false" [onlyFromAutocomplete]="true"
                placeholder="{{ 'WRITE_SPORT' | translate }}" secondaryPlaceholder="{{ 'WHICH_SPORT' | translate }}" name="sportSelected">
                <tag-input-dropdown [autocompleteItems]="$sportList" [matchingFn]="$tagInputChange" ></tag-input-dropdown>
              </tag-input>

            </ion-list>

          </ion-item-group>    

          <ion-item>
            <button type="submit" full ion-button>{{'SAVE' | translate}}</button>
          </ion-item>
        
        </form>

        <p *ngIf="$error">{{ $error }}</p>

      </div>
  `,
  styles: [`
    #profile-required{
      background-color: #fff;
      width: 500px;
      padding: 15px 20px;
      margin-left: auto;
      margin-right: auto;
      top: 50%;
      position: relative;
      transform: translateY(-50%);
    }
  `],
  animations: [
    animate('0.3s 0 ease-in')
  ]
})
export class ProfileRequired {

  @Output() requiredFormSubmited = new EventEmitter();

  private $statesList: any;
  private $sportTable: any;
  private $genderList: any;
  $sportList:any;
  $typeUserList: any;
  $sportsSelected:any; //Esportes selecionados
  $typeUserSelected:number = 1; //Perfil Default
  $tagInputChange; //Armazena função

  $error:string;

  constructor(
    private user: User,
    private sport: SportList,
    states: BrazilStates,
    gender: GenderList,
    profileType: profileTypeList) {

    //Carrega lista de estados do provider
    this.$statesList = states.statesList;

    //Carrega lista de esportes
    sport.load().then((resp) => {
      //Tabela de Esportes com ID e nome
      this.$sportTable = sport.table;
      this.$sportList = sport.list;
    })

    //Atribui tipos de usuários
    this.$typeUserList = profileType.list;

    //Atribui generos
    this.$genderList = gender.list;

    //Função para selecionar esporte
    this.$tagInputChange = sport.tagInputChange;

  }


  //Ao submeter evento é emitido evento para captura da classe pai
  //Salvar dados do formulário
  submitRegister(form:NgForm) {

    //Se formulário estiver inválido, mostrar mensagem
    if (form.status == 'INVALID') {
      this.$error = 'Por favor, preencha todos campos solicitados!'; 
      return;
    }

    //Campos válidos
    let saveFields: any = {
      sport: {
        value: []
      },
      type: this.$typeUserSelected
    }

    //Define ID's dos esportes selecionados
    for (const element of this.$sportsSelected) {
      let value = this.sport.setChooseSports(element);
      saveFields['sport'].value.push(value);
    }    

    if(saveFields.sport.value.length <= 0) {
      //mostrar erro
    }

    //Realiza update de dados do usuario
    this.user.update(saveFields).subscribe((data:any) => {
      
      if(data.success != undefined) {
        this.requiredFormSubmited.emit({
          update: true
        })
      }

    });

  }

}