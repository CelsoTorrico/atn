import { InAppBrowser } from '@ionic-native/in-app-browser';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavController } from 'ionic-angular';

/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class Api {
  
  //Development
  //static readonly url = 'http://localhost/desenvolvimento/app-atletasnow-2.0/app/public';
  
  //Ambiente de testes | Godzilla
  //static readonly url = 'https://testes.makingpie.com.br/atletasNOW/app/public';

  //Ambiente Produção
  static readonly url = 'http://54.207.47.200/atletasNOW/app/public';
  
  protected $headerObject:any;

  private $httpParams;
  private $optionsParams = { withCredentials: true };

  constructor(
    public http: HttpClient, 
    public appBrowser: InAppBrowser) {
      this.$headerObject = {
        'Content-Type'    : 'application/x-www-form-urlencoded',
        'withCredentials' : true,
        'Origin'          : 'http://app.atletasnow.s3-website-sa-east-1.amazonaws.com' 
        //'Origin'        : 'http://localhost' 
      }
    }

  /** TODO: Todas as requisições após login deve usar parametro Options = {withCredentials: true} para enviar cookie setado na seção */
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

    return this.http.get(Api.url + '/' + endpoint, reqOpts);
  }

  post(endpoint: string, body: any, reqOpts?: any) {
    reqOpts = this.$headerObject;
    return this.http.post(Api.url + '/' + endpoint, body, reqOpts);
  }

  put(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(Api.url + '/' + endpoint, body, reqOpts);
  }

  delete(endpoint: string, reqOpts?: any) {
    return this.http.delete(Api.url + '/' + endpoint, reqOpts);
  }

  patch(endpoint: string, body: any, reqOpts?: any) {
    return this.http.patch(Api.url + '/' + endpoint, body, reqOpts);
  }

  //Setando campos enviados para requisição
  private validParamsToSerialize($object: any):string{           
    this.$httpParams = new HttpParams({fromObject:$object});     
    return this.$httpParams;
  }

  //Login Social - Abre uma nova página no app
  getSocial(endpoint: string) {
    //Versão para app nativo
    //let ob = this.appBrowser.create(Api.url + '/login/' + endpoint);
    
    //Nativamente redirecionar para página de login social
    window.location.assign(Api.url + '/login/' + endpoint)

  }

  getUrl(){
    return Api.url;
  }

}
