import { Injectable } from "@angular/core";

@Injectable()
export class GenderList{

    list:any = [];

    constructor() {
        //Lista de tipos de usuário
        this.list = [
            {valor: 'male',       texto: 'Masculino'}, 
            {valor: 'female',     texto: 'Feminino'},
            {valor: 'not_gender', texto: 'Prefiro não informar'}
        ];
    }

}