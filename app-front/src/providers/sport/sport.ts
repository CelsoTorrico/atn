import { Injectable } from "@angular/core";
import { Api } from "../api/api";
import { TranslateChar } from "../useful/translateChar";

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

    /** 
     * Implementa a seleção de esportes. Inserir valores sem acentuação correta é considerado 
     * @since  2.1
     * */
    tagInputChange(value, target) {

        //Para esportes cadastrados
        if(value == target.display) {
            return true;
        }
  
        let sport = target.display;
        for (const i in target.display) {
  
            //Caracteres
            let currentChar = target.display.charAt(i);
            let changed = TranslateChar.change(currentChar);
  
            //Se não foi encotrado caracter para para substituição
            if (!changed) continue;
  
            //Substitui ocorrências do caracter na string
            sport = target.display.replace(currentChar, changed);
        }
  
        //Procura pelo valor na string de esporte
        let regex = new RegExp(value, 'igm');
        let found = sport.match(regex);
    
        if(found) {
            return target.display; 
        }
  
        return false;
        
    }

    /** Compara esportes selecionados: array $sportTable */
    setChooseSports($sportChoose:any) {

        let $varToAdd:any;

        //Intera sobre items
        for (const element of this.table) {
            //Compara valores selecionados com tabela de esportes
            if (element[1] == $sportChoose.display) {
                //Atribui valor a array
                $varToAdd = element[0];
                break;
            }
        }

        return $varToAdd;
    }

}