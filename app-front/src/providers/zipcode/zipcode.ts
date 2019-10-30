import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";

@Injectable()

export class ZipcodeService {

    private service:string  = 'https://viacep.com.br/ws';
    private cep:string      = '00000000';
    private format:string   = 'json';

    constructor(private http: HttpClient) {}
    

    /**
     * Função para definir o parametro CEP
     * @param $cep
     */
    public setCEP($cep:string) {
        this.cep = $cep;
    }

    /**
     * Função que define o formato de retorno da requisição
     * @param $format 
     */
    public setFormat($format:string) {
        this.format = $format;
    }
	
	/**
   * Função faz requisição retornando endereço completo em formato especificado
   * @since 2.1
   */
    public getAdressData(): Observable <Object> {
        //Retorna a lista de esportes do banco e atribui ao seletor
        return this.http.get(this.service + '/'+ this.cep + '/' + this.format, {
            responseType: 'json'
        });
	}
		
}