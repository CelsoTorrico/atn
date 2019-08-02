import { Injectable } from "@angular/core";

@Injectable()
export class profileTypeList{

    list:any = [];

    constructor() {
        //Lista de tipos de usuário
        this.list = [
            {valor: 1,  texto: 'Atleta'}, 
            {valor: 2,  texto: 'Profissional do Esporte'},
            {valor: 3,  texto: 'Faculdade'},
            {valor: 4,  texto: 'Clube Esportivo'},
            {valor: 5,  texto: 'Confederação'} 
        ];
    }

    


}