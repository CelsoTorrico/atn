import { ZipcodeService } from './../../providers/zipcode/zipcode';
import { CareerList } from './../../providers/career/career';
import { ToastController, LoadingController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { User } from './../../providers/user/user';
import { profileTypeList } from './../../providers/profiletypes/profiletypes';
import { GenderList } from './../../providers/gender/gender';
import { Component, EventEmitter, Output } from '@angular/core';
import { BrazilStates } from '../../providers/useful/states';
import { SportList } from '../../providers/sport/sport';

@Component({
  selector: 'profile-databox',
  template: `
      <div id="profile-required">

        <h2 margin>Preencha as informações faltantes!</h2>

        <form #updateRequiredForm="ngForm" (submit)="submitRegister(updateRequiredForm, $event)">

        <ion-row>

          <ion-col col-6>
              <ion-label stacked> {{ "PROFILE" | translate }}</ion-label>
              <ion-select full id="tipo" [(ngModel)]="$typeUserSelected" name='typeUserSelected' full required>
                <ion-option *ngFor="let item of $typeUserList" [value]="item.valor">
                  {{item.texto}}
                </ion-option>
              </ion-select>
          </ion-col>

          <ion-col col-6 *ngIf="$typeUserSelected == 2">
              <p><br /><small>Treinadores, Fisioterapeutas, Nutricionistas, Juízes e outros</small></p>
          </ion-col>

        </ion-row>

        <ion-row *ngIf="$typeUserSelected != 2">

          <ion-col col-12>
              <ion-label stacked>{{ "SPORTS" | translate }}</ion-label>
              <tag-input required [(ngModel)]="$sportsSelected" [addOnBlur]="false" [onlyFromAutocomplete]="true"
                placeholder="{{ 'WRITE_SPORT' | translate }}" secondaryPlaceholder="{{ 'WHICH_SPORT' | translate }}" name="sportSelected">
                <tag-input-dropdown [autocompleteItems]="$sportList" [matchingFn]="$tagInputChange" ></tag-input-dropdown>
              </tag-input>
          </ion-col>

        </ion-row>   

        <ng-container *ngIf="$typeUserSelected == 2">

            <ion-row
            >

              <ion-col col-6>
                  <ion-label stacked>{{ "CAREER" | translate}}</ion-label>
                  <ion-select name="$account.career" [(ngModel)]="$account.career" interface="popover">
                      <ion-option *ngFor="let item of $careerList" [value]="item">
                        {{ item }}
                      </ion-option>
                  </ion-select>
              </ion-col>

              <ion-col col-6>
                <ng-container *ngIf="$account.career == 'Outros'">
                  <ion-label stacked>&nbsp;</ion-label>
                  <ion-input id="career" [(ngModel)]="$account.other_career" type="text" name="other_career" placeholder="{{'CAREER_OTHERS' | translate}}" required full></ion-input>
                </ng-container>
              </ion-col>

              <ion-col col-12>
                <ion-label stacked>{{ 'GENDER' | translate}}</ion-label>
                <ion-select id="gender" [(ngModel)]="$account.gender" name='gender' full required>
                  <ion-option *ngFor="let item of $genderList" [selected]="item.valor == 'male'" [value]="item.valor">
                    {{item.texto}}
                  </ion-option>
                </ion-select>
              </ion-col>
            </ion-row>

            <ion-row>
              <ion-col col-4>
                  <ion-label stacked>{{ 'ZIPCODE' | translate}}</ion-label>
                  <ion-input id="cep" [(ngModel)]="$account.zipcode" type="text" name="zipcode" placeholder="{{'ZIPCODE' | translate}}" max="8" pattern="[0-9]{5}[0-9]{3}" (keyup)="queryZipcode($event)"
                    required full></ion-input>
              </ion-col>
              <ion-col col-8>
                <ion-label stacked>{{ 'ADDRESS' | translate}}</ion-label>
                <ion-input id="endereco" [(ngModel)]="$account.address" type="text" name="address" placeholder="{{'ADDRESS' | translate}}" [disabled]="($account.address)? false : true"
                    required full></ion-input>
              </ion-col>
            </ion-row>

            <ion-row>                
              <ion-col col-6>
                <ion-label stacked>{{ 'NEIGHBORNHOOD' | translate}}</ion-label>
                <ion-input id="bairro" [(ngModel)]="$account.neighbornhood" type="text" name="neighbornhood" placeholder="{{'NEIGHBORNHOOD' | translate}}" [disabled]="($account.neighbornhood)? false : true"
                  required full></ion-input>
              </ion-col>
              <ion-col col-6>
                  <ion-label stacked>{{ 'CITY' | translate}}</ion-label>
                  <ion-input type="text" [(ngModel)]="$account.city" name="city" placeholder="{{'CITY' | translate}}" [disabled]="($account.city)? false : true" required></ion-input>
                </ion-col>
            </ion-row>

            <ion-row>                
              <ion-col col-5>
                <ion-label stacked>{{ 'STATE' | translate}}</ion-label>
                <ion-select class="select-state" id="state" [(ngModel)]="$account.state" name="state" placeholder="{{ 'STATE' | translate }}" [disabled]="($account.state)? false : true"
                    full required>
                    <ion-option *ngFor="let item of $statesList" [value]="item">
                      {{item}}
                    </ion-option>
                  </ion-select>
              </ion-col>
              <ion-col col-7>
                <ion-label stacked>{{ 'COUNTRY' | translate}}</ion-label>
                <ion-input type="text" [(ngModel)]="$account.country" name="country" placeholder="{{'COUNTRY' | translate}}" required></ion-input>
              </ion-col>
            </ion-row>

        </ng-container>

        <ion-row>
          <ion-col>
            <button type="submit" full ion-button>{{'SAVE' | translate}}</button>
          </ion-col> 
        </ion-row>
        
      </form>

    </div>
  `,
  styles: [`
    #profile-required{
      background-color: #fff;
      width: 500px;
      max-width: 90%;
      max-height: 70%;
      padding: 15px 20px;
      margin-left: auto;
      margin-right: auto;
      top: 50%;
      position: relative;
      transform: translateY(-50%);
      overflow-y: scroll;
      border:1px solid #444;
    }
  `]
})
export class ProfileRequired {

  @Output() requiredFormSubmited = new EventEmitter();

  $statesList: any;
  $sportTable: any;
  $genderList: any;
  $sportList: any;
  $typeUserList: any;
  $careerList: any;

  public $account: any = {
    country:  "Brasil",
    career:   "Coach",
    gender:   "male"
  };

  $sportsSelected: any; //Esportes selecionados
  $typeUserSelected: number = 1; //Perfil Default
  $tagInputChange; //Armazena função

  $error: string;

  constructor(
    private user: User,
    private toastCtrl: ToastController,
    private zipcodeService: ZipcodeService,
    private loading: LoadingController,
    careerList: CareerList,
    states: BrazilStates,
    private sport: SportList,
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

    //Carrega lista de profissões
    this.$careerList = careerList.list;

    //Adicionar item "Outros" para inserção de carreira não existente
    if (this.$careerList.indexOf('Outros') <= -1) {
      this.$careerList.push('Outros');
    }

    //Função armazenada em variavel para selecionar esporte
    this.$tagInputChange = sport.tagInputChange;

  }


  //Ao submeter evento é emitido evento para captura da classe pai
  //Salvar dados do formulário
  submitRegister(form: NgForm, $event) {

    $event.preventDefault();

    //Se formulário estiver inválido, mostrar mensagem
    if (form.status == 'INVALID') {
      return this.toastCtrl.create({
        message: 'Por favor, preencha todos campos solicitados!',
        duration: 4000
      }).present();
    }

    //Campos válidos
    let saveFields:any = {
      type:     1,
      sport: {
        value: []
      }
    }
    
    //Combina os dois objetos em um só
    saveFields = { ...this.$account, ...saveFields };

    //Atribui tipo de usuário selecionado
    saveFields.type = this.$typeUserSelected;

    //Em caso de usuário especificar carreira não presente na lista
    if(this.$account.other_career != undefined) {
        saveFields.career.value = this.$account.other_career;
    }

    //Define ID's dos esportes selecionados
    if (this.$sportsSelected) {
      for (const element of this.$sportsSelected) {
        let value = this.sport.setChooseSports(element);
        saveFields['sport'].value.push(value);
      }
    }

    //Preencher campos esporte obrigatório
    if (saveFields.sport != undefined && saveFields.sport.value.length <= 0) {
      return this.toastCtrl.create({
        message: 'Por favor, preencha todos campos solicitados!',
        duration: 4000
      }).present();
    }

    //Inicializa loading
    let loading = this.loading.create({ content: 'Loading'});
    loading.present();

    //Realiza update de dados do usuario
    this.user.update(saveFields).subscribe((data:any) => {

      //Fecha loading
      loading.dismiss();

      if (data.success != undefined) {

        //Fecha o painel de dados faltantes
        this.requiredFormSubmited.emit({
          update: true
        });

        //mostrar resposta do salvamento
        this.toastCtrl.create({
          message: data.success.register,
          duration: 4000
        }).present();

      } else {
        
        //mostrar resposta do salvamento
        this.toastCtrl.create({
          message: data.error.register,
          duration: 4000
        }).present();

      }

    });

  }

  //Fazer pesquisa de CEP (API) ao preencher todos numeros
  queryZipcode($event) {
    let input = $event.target;
    let validacao = /^[0-9]{5}[0-9]{3}/i;
    let regex = input.value.search(validacao);

    if (regex == 0) {
      this.zipcodeService.setCEP(input.value);
      this.zipcodeService.getAdressData().subscribe((data: any) => {

        //Se houve erro no retorno
        if (data.erro != undefined) {
          return this.toastCtrl.create({
            message: "CEP não válido. Preencha corretamento o cep de seu endereço.",
            duration: 2000
          }).present();
        }

        this.$account.address = data.logradouro;
        this.$account.neighbornhood = data.bairro;
        this.$account.city = data.localidade;
        this.$account.state = data.uf;
      });
    }
  }

}