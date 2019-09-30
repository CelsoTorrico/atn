import { Injectable } from "@angular/core";

@Injectable()
export class CareerList {

    list:any    = []

    constructor() {
        this.list = [
            "Coach", 
            "Fisioterapeuta", 
            "Psicólogo", 
            "Agente", 
            "Nutricionista", 
            "Advogado", 
            "Técnico", 
            "Jornalista", 
            "Árbitro", 
            "Coordenador Técnico", 
            "Assistente Técnico",
            "Médico", 
            "Podológo", 
            "Estatístico / Desempenho", 
            "Prepador Físico", 
            "Preparador de Goleiros", 
            "Roupeiro", 
            "Massagista", 
            "Mesário", 
            "Professor", 
            "Gestor",
            "Fisiologista",
            "Fotógrafo"
        ];
    }

}