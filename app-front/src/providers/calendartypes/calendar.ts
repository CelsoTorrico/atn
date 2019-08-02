import { Injectable } from '@angular/core';
import { Api } from '../api/api';

/**
 * User Context
 */
@Injectable()
export class CalendarList {

  list:any = []
  table: any = []

  constructor(private api: Api) {}

    /**
   * Função faz requisição retornando lista de esportes disponiveis
   * @since 2.1
   */
    private getCalendarTypes():Promise<ArrayBuffer> {
        //Retorna a lista de esportes do banco e atribui ao seletor
        return this.api.get('calendar/types').toPromise();
    }

    /**
   * Função que faz requisição retornando Promise
   * @since 2.1
   */
    load():Promise<void> {
        return this.getCalendarTypes().then((resp: any) => {

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
