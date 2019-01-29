import { HttpParams } from '@angular/common/http';
import { Api } from './../../providers/api/api';
import { Injectable } from "@angular/core";

//TODO: Definir uma constante global com URL da api REST
const $url = 'user/register';

@Injectable()
export class SignupStepsService{

    protected $headerObject = {
        'Accept': 'application/json', 
        'Content-Type':'application/x-www-form-urlencoded'
    };
    
    private $httpParams;
    
    constructor(private api: Api){}

    public checkIfExistUser($data:any ):boolean{ 

        let $response;

        //Executa requisição
        let print = this.api.post(
            $url, //url
            this.validParamsToSerialize($data), //data serializada,
            {
                headers : this.$headerObject
            } //options           
        );

        //Verifica retorno e retorna boolean
        //TODO: Melhorar essa função
        $response = print.subscribe({
            next(data){
                return data;
            },
            complete(){ 
                
            }
        });

        //Verifica se resultado é string
        if( typeof($response) == "string" && $response == "true"){
            return true;
        }
        else{
            return false;
        }

    }

    /* Função de serializar dados em formato x-form-urlencoded*/
    //TODO: Colocar em uma classe externa para ser reutilizado
    private validParamsToSerialize($object: any):string{           
        this.$httpParams = new HttpParams({fromObject:$object});     
        return this.$httpParams.toString();
    }
}