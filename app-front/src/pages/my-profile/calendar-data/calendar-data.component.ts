import { Component } from '@angular/core';
import { NavController, ToastController, ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Api, User } from '../../../providers';
import { StatsList } from '../../../providers/useful/stats';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';


@Component({
    selector: 'calendar-data',
    templateUrl: 'calendar-data.html'
})
export class MyProfileCalendarComponent {

    calendarObservable: Observable<ArrayBuffer>;

    //Campos para preenchimento
    calendar: any = {
        post_title: <string>'',
        post_excerpt: <string>'',
        post_content: <string>'',
        post_calendar_date: <any>[],
        post_calendar_type: <string>'',
        post_calendar_address: <string>'',
        post_calendar_people: <any>[]
    }

    eventTypes: any = []

    public errorSubmit:string

    public addFormData: any;

    public visibility: any;

    constructor(
        public user: User,
        public api: Api,
        public viewCtrl: ViewController,
        public statsList: StatsList,
        public translateService: TranslateService) {

        this.translateService.setDefaultLang('pt-br');

        //Função a ser executada após requisição de dados de usuário
        this.addFormData = function ($this: any) {

            //Adicionando valores a classe user
            let atributes = $this.user._user;
        }

    }

    //Função que inicializa
    ngOnInit() {
        //Retorna dados de usuário
        this.user._userObservable.subscribe((resp: any) => {
            this.addFormData(this);
        });

        this.getTypesEvent();
    }

    getTypesEvent() {
        //Retorna opções de visibilidade
        let getEventObservable = this.api.get('calendar/types');
        getEventObservable.subscribe((resp: any) => {
            if (Object.keys(resp).length > 0) {
                this.eventTypes = resp;
            }
        });
    }

    //Salvar dados do formulário
    save(form: NgForm, $event) {

        $event.preventDefault();

        this.calendarObservable = this.api.post('/calendar', this.calendar);

        //Enviar dados a serem salvos
        this.calendarObservable.subscribe((resp: any) => {

            // Se mensagem contiver parametro 'success'
            if (Object.keys(resp).length <= 0) {
                return;
            }

            //Erro ao submeter novo evento
            if(resp.error != undefined) {
                this.errorSubmit = resp.error.calendar;
                return;
            }

            //Fechar modal e retornar data
            this.dismiss(resp);
        });

    }

    //Fechar modal
    dismiss(data: any = null) {
        this.viewCtrl.dismiss(data);
    }

    customTrackBy(index: number, item: any): number {
        return index;
    }

    //Quando um input tem valor alterado
    fileChangeEvent(fileInput: any) {
        if (fileInput.target.files && fileInput.target.files[0]) {

            var reader = new FileReader();

            reader.onload = function (e: any) {
                let preview = document.getElementById('preview');
                preview.style.backgroundImage = 'url(' + e.target.result + ')';
                preview.style.display = 'block';
            }

            reader.readAsDataURL(fileInput.target.files[0]);
        }
    }

}