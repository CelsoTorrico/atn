import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class Api { 

  //Definição de origen de api e frontend
  static readonly origin = environment.apiOrigin;
  static readonly url = environment.apiUrl;  
  
  protected $headerObject:any;

  private $httpParams;

  constructor(
    public http: HttpClient) {
      this.$headerObject = {
        /*headers: new HttpHeaders({ 
          'Content-Type'  : 'application/json'
        }),*/
        withCredentials : true
      }
    }

  /** Todas as requisições após login deve usar parametro Options = {withCredentials: true} 
   * para enviar cookie setado na seção */
  get(endpoint: string, params?: any, reqOpts?: any) {
    
    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams()
      };
    }

    // Support easy query params for GET requests
    if (params) {
      reqOpts.params = new HttpParams();
      for (let k in params) {
        reqOpts.params = reqOpts.params.set(k, params[k]);
      }
    }
    reqOpts = this.$headerObject;
    return this.http.get(Api.url + '/' + endpoint, reqOpts);
  }

  post(endpoint: string, body: any, reqOpts?: any) {
    reqOpts = this.$headerObject;
    return this.http.post(Api.url + '/' + endpoint, body, reqOpts);
  }

  put(endpoint: string, body: any, reqOpts?: any) {
    reqOpts = this.$headerObject;
    return this.http.put(Api.url + '/' + endpoint, body, reqOpts);
  }

  delete(endpoint: string, reqOpts?: any) {
    reqOpts = this.$headerObject;
    return this.http.delete(Api.url + '/' + endpoint, reqOpts);
  }

  patch(endpoint: string, body: any, reqOpts?: any) {
    reqOpts = this.$headerObject;
    return this.http.patch(Api.url + '/' + endpoint, body, reqOpts);
  }

  //Setando campos enviados para requisição
  private validParamsToSerialize($object: any):string{           
    this.$httpParams = new HttpParams({fromObject:$object});     
    return this.$httpParams;
  }

  //Login Social - Abre uma nova página no app
  getSocial(endpoint: string) {    
    //Nativamente redirecionar para página de login social
    window.location.assign(Api.url + '/login/' + endpoint);
  }

  getDomain(){
    return Api.origin;
  }

  getUrl(){
    return Api.url;
  }

}
