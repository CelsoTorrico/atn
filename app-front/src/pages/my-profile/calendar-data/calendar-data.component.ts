import { CalendarSingle } from '../../components/calendar/calendar-single.component';
import { Component } from '@angular/core';
import { ViewController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Api, User } from '../../../providers';
import { StatsList } from '../../../providers/useful/stats';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';


@Component({
    selector: 'calendar-data',
    templateUrl: 'calendar-data.html'
})
export class MyProfileCalendarComponent {

    calendarObservable: Observable<ArrayBuffer>

    //Campos para preenchimento
    calendar: any = {
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

    public visibility: any = []

    public eventTypes: any = []

    public errorSubmit:string

    public loading_placeholder:string

    constructor(
        public  user: User,
        public  api: Api,
        public  params: NavParams,
        public  viewCtrl: ViewController,
        public  statsList: StatsList,
        private loading: LoadingController,
        private toastCtrl: ToastController,
        public  translateService: TranslateService) {

        this.translateService.setDefaultLang('pt-br');

        this.translateService.get(["POST", "LOADING"]).subscribe((data) => {
            this.loading_placeholder    = data.LOADING;
        });

        //Carrega pre-dados no caso de atualização
        let post_id = this.params.get('data');
        if (post_id != undefined) {
            this.loadCalendarData(post_id); //Carregando dados do post
            this.post_id = post_id; //Atribuindo propriedade da classe
        }

    }

    //Função que inicializa
    ngOnInit() {

        //Carregando campos de visibilidade
        this.getVisibility();

        //Carregando campos de tipos de eventos
        this.getTypesEvent();
    }

    //Carrega dados do calendário
    loadCalendarData($post_id:number) {
    
        //Inicializando observer
        let $observer = this.api.get('calendar/' + $post_id);
        
        //Fazendo requisição
        $observer.subscribe((resp:any) => {
    
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

    //Retorna dados de visibilidade
    getVisibility() {
        //Retorna a lista de esportes do banco e atribui ao seletor
        let items = this.api.get('timeline/visibility').subscribe((resp: any) => {

            //Se não existir items a exibir
            if (resp.length > 0) {
                this.visibility = resp;
            }

        }, err => {
            return;
        });

    }

    //Retorna lista com tipos de eventos
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