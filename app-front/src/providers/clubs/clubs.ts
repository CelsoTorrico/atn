import { Injectable } from "@angular/core";
import { Api } from "../api/api";

@Injectable()
export class ClubList {

    table: any = []
    list: any = []

    constructor(private api: Api) { }

    /**
   * Função faz requisição retornando lista de clubes disponiveis
   * @since 2.1
   */
    private getClub():Promise<ArrayBuffer> {
        //Retorna a lista de clubes para seletor
        return this.api.get('/user/clubs').toPromise();
    }

    /**
   * Função que faz requisição retornando Promise
   * @since 2.1
   */
    load():Promise<void> {
        return this.getClub().then((resp: any) => {

            //Tabela de Esportes com ID e nome
            this.table = resp;

            //Lista de apenas nomes de esportes
            resp.forEach(element => {
                //[0] = id, [1] = sport_name
                this.list.push(element.display_name);
            });

        }, err => {
            return;
        });
    }

}