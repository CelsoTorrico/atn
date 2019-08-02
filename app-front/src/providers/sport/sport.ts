import { Injectable } from "@angular/core";
import { Api } from "../api/api";

@Injectable()
export class SportList {

    table:any = []
    list:any = []

    constructor(private api: Api) {}

    /**
   * Função faz requisição retornando lista de esportes disponiveis
   * @since 2.1
   */
    private getSport():Promise<ArrayBuffer> {
        //Retorna a lista de esportes do banco e atribui ao seletor
        return this.api.get('/user/sports').toPromise();
    }

    /**
   * Função que faz requisição retornando Promise
   * @since 2.1
   */
    load():Promise<void> {
        return this.getSport().then((resp: any) => {

            //Tabela de Esportes com ID e nome
            this.table = resp;

            //Lista de apenas nomes de esportes
            resp.forEach(element => {
                //[0] = id, [1] = sport_name
                this.list.push(element[1]);
            });

        }, err => {
            return;
        });
    }

}