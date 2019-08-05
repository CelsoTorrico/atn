import { VisibilityList } from './../../../providers/visibility/visibility';
import { CalendarSingle } from '../../components/calendar/calendar-single.component';
import { Component } from '@angular/core';
import { ViewController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Api } from '../../../providers';
import { StatsList } from '../../../providers/useful/stats';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { CalendarList } from '../../../providers/calendartypes/calendar';

@Component({
    selector: 'calendar-data',
    templateUrl: 'calendar-data.html'
})
export class MyProfileCalendarComponent {

    calendarObservable: Observable<ArrayBuffer>

    //Campos para preenchimento
    calendar: any = {
        ID: <number>null,
        post_title: <string>'',
        post_excerpt: <string>'',
        post_content: <string>'', 
        post_image: <any>null, 
        post_visibility: <number>null,
        post_video_url: <string>'',
        post_calendar_date: <any>[],
        post_calendar_type: <string>'1',
        post_calendar_address: <string>'',
        post_calendar_people: <any>[],
        attachment: <any>[],
        post_meta: <any>{},
        quantity_comments: '' 
    }

    public post_id:number

    public visibility: any[]

    public eventTypes: any[]

    public errorSubmit:string

    public loading_placeholder:string

    constructor(
        public  api: Api,
        public  params: NavParams,
        public  viewCtrl: ViewController,
        public  statsList: StatsList,
        private loading: LoadingController,
        public  translateService: TranslateService,
        visibilityList: VisibilityList,
        calendarList: CalendarList) {

        this.translateService.setDefaultLang('pt-br');

        this.translateService.get(["POST", "LOADING"]).subscribe((data) => {
            this.loading_placeholder    = data.LOADING;
        });

        //Carrega campos de visibilidade
        visibilityList.load().then(() => {
            this.visibility = visibilityList.table
        });

        //Carrega tipos de eventos
        calendarList.load().then(() => {
            this.eventTypes = calendarList.table; 
        });

        //Carrega pre-dados no caso de atualização
        this.post_id = this.params.get('data'); 

    }

    //Função que inicializa
    ngOnInit() {
        if (this.post_id != undefined) { 
            this.loadCalendarData(this.post_id); //Carregando dados do post
        }
    } 

    //Carrega dados do calendário
    loadCalendarData($post_id:number) {
    
        //Inicializando observer
        this.api.get('calendar/' + $post_id).toPromise().then((resp:any) => {
    
          if (resp.error != undefined || resp.length <= 0) {
            return;
          }
    
          for (const key in resp) {
            
            //Verifica se existe propriedade nos atributos de calendário
            if (!this.calendar.hasOwnProperty(key)) {
                continue;
            }

            //Adiciona ao postmeta
            if(key == 'post_meta') {
                //Intera e atribui a array
                for (const k in resp[key]) {
                    if (this.calendar.hasOwnProperty(k)) {
                        this.calendar[k] = resp[key][k];                   
                    }
                }
                continue;
            }

            //Adicionando a imagem
            if(key == 'attachment') {

                //Encontrar a ultima imagem anexada e usar como thumbnail
                let thumbnailAttachment = CalendarSingle.defineAttachment(resp[key], 'image');
                let preview = document.getElementById('preview');
                preview.style.backgroundImage = 'url(' + thumbnailAttachment + ')';
                preview.style.display = 'block';

                continue;
            }

            this.calendar[key] = resp[key]; 

          }
    
        });
        
      }

    //Salvar dados do formulário
    save(form: NgForm, $event):Subscription {

        $event.preventDefault();

        //Se não houver dados no atributo post_title
        

        //Loading
        const loading = this.loading.create({ 
            content: this.loading_placeholder 
        });

        loading.present();

        //Convertendo data em objeto FormData
        let formData = new FormData();

        //Anexando imagem a objeto
        if ($event.target[8].files[0] != undefined) {
            //O campo de imagem deve permanecer na ordem
            let file = $event.target[8].files[0];
            formData.append('post_image', file, file.name);
        }

        //Intera sobre objeto com valores enviados e atribui a objeto FormData
        for (const key in this.calendar) {
            
            //Se for imagem, ir para proximo item
            if(key == 'post_image') {
                continue;
            }

            //Verificando se propriedade existe
            if (this.calendar.hasOwnProperty(key)) {
                formData.append(key, this.calendar[key]);                 
            }
        }

        //Verifica se é atualização ou criar novo
        if( this.post_id != undefined ) {
            //Atualizar item informado ID
            this.calendarObservable = this.api.post('calendar/'+ this.post_id, formData);
        } else {
            //Criar um novo item
            this.calendarObservable = this.api.post('calendar', formData);
        }

        //Enviar dados a serem salvos
        return this.calendarObservable.subscribe((resp: any) => {

            //Remove tela de loading
            loading.dismiss();

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