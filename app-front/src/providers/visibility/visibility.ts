import { Injectable } from '@angular/core';
import { Api } from '../api/api';

/**
 * User Context
 */
@Injectable()
export class VisibilityList {

  table: any  = []
  list: any   = []

  constructor(
    private api: Api) {}

  /**
   * Função faz requisição retornando lista de visibilidades disponiveis
   * @since 2.1
   */
  private getVisibility():Promise<any> {

    //Verifica a existencia do cookie
    return this.api.get('timeline/visibility').toPromise();

  }

  /**
   * Função que faz requisição retornando Promise
   * @since 2.1
   */
  load():Promise<void> {
    return this.getVisibility().then((resp:any) => {
      
      this.table = resp;

      //Lista de apenas nomes de esportes
      for (const element of resp) {
          //option | value
          this.list.push(element.option);  
      }

    });
  }

}
