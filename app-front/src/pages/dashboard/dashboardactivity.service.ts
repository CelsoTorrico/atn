import { Injectable } from '@angular/core';
import { Api } from "../../providers";

@Injectable()
export class DashboardLastActivityService {

    list:any = [];

    constructor(private api:Api){}

    /** Retorna atividades */
    load() {
        return this.getLastActivity().then((res) => {
            //Se não existir items a exibir
            if (res.length > 0) {
                this.list = res;
            }
        });
    }

    /** Faz requisição das ultimas atividades */
    private getLastActivity() {
        //Retorna a lista de esportes do banco e atribui ao seletor
        return this.api.get('timeline/activity').toPromise().then((resp: any) => {
            return resp;
        }, err => {
            return;
        }).catch((rej) => {});
    }


}