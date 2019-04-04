import { HttpParams } from '@angular/common/http';
import { Api } from './../../providers/api/api';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SignupStepsService{

    //Constante global com URL da api REST
    static readonly $url = 'register/exist';

    constructor(private api: Api){}

    public checkIfExistUser($data:any ):Observable<ArrayBuffer>{ 

        //Executa requisição
        let print = this.api.post(
            SignupStepsService.$url, //url
            $data //data serializada,       
        );

        return print;

    }

    /* Função de serializar dados em formato x-form-urlencoded*/
    private validParamsToSerialize($object: any):string{           
        let $httpParams = new HttpParams({fromObject:$object});     
        return $httpParams.toString();
    }
}