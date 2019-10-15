import { SportList } from './../sport/sport';
import { Api } from './../api/api';
import { Injectable } from "@angular/core";

@Injectable()

export class StatsList {

	table:any = []
	list:any = []	
	private sportList:any

	constructor(private api: Api) {}
	
	/**
	 * Retorna campo de determinado esporte
	 * @param sport_name 
	 */
	getSportProperty(sport_name:string) { 
		return this.sportList[sport_name];
	}

    /**
   * Função faz requisição retornando lista de esportes disponiveis
   * @since 2.1
   */
    private getSportStats():Promise<ArrayBuffer> {
        //Retorna a lista de esportes do banco e atribui ao seletor
        return this.api.get('/user/sport-stats').toPromise();
	}

    /**
   * Função que faz requisição retornando Promise
   * @since 2.1
   */
    load():Promise<void> {
        return this.getSportStats().then((resp: any) => {

			this.sportList = resp;
            //Tabela de Esportes com ID e nome
            /*this.table = resp;

            //Lista de apenas nomes de esportes
            resp.forEach(element => {
                //[0] = id, [1] = sport_name
                this.list.push(element[1]);
            });*/

        }, err => {
            return;
        });
    }
		
}
