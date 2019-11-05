import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';

//TODO: Definir uma constante global com ULR da api REST
const $url = 'http://localhost/desenvolvimento/app-atletasnow-2.0/app/public';

@Injectable()
export class LoginService{

    protected $headerObject = {
        'Content-Type':'application/x-www-form-urlencoded'
    };
    private $httpParams;
    
    constructor(protected $httpClient: HttpClient){}

    public getUserLogin($data){

        let print = this.$httpClient.post(
            $url + '/login', //url
            this.validParamsToSerialize($data),
            {
                headers : this.$headerObject
            } //options           
        );

    }

    private validParamsToSerialize($object: any):string{   
        
        this.$httpParams = new HttpParams({fromObject:$object});     
        return this.$httpParams.toString();
    }

    

}