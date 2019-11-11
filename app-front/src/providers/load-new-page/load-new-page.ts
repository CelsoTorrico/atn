import { ToastController, NavController } from "ionic-angular";
import { TranslateService } from "@ngx-translate/core";
import { Injectable } from "@angular/core";

@Injectable()
export class loadNewPage{
    
    constructor (
        public toastCtrl: ToastController,
        public translateService: TranslateService){}

    //Função que inicializa
    ngOnInit() {
        
    }
    
    //Redireciona em sucesso ou Imprime erro
    getPage(resp:any, navCtrl:NavController, pageComponent:any){

        let positionMessage:string = 'bottom';
        let toast;

        //Se for string, imprime alerta na hora
        if (typeof resp == 'string'){ 
            toast = this.createToast(resp, positionMessage);    
        }
        //Se sucesso redireciona para página
        else if(resp.success != undefined) {
            navCtrl.push(pageComponent);
            return;
        //Erros em geral
        } else {
            toast = this.createToast(resp.error, positionMessage);      
        } 

        //Exibe alerta
        toast.present();
    }

    //Cria um alerta baseado em argumentos passados
    createToast(resp:string, positionMessage:string){
        return this.toastCtrl.create({
            message: resp,
            duration: 3000,
            position: positionMessage
          });
    }

}