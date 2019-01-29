import { Injectable } from '@angular/core';

@Injectable()
export class BrazilStates {
  
  statesList: any[];

  constructor() {
    
    this.statesList = [
        'AC',        'AL',      'AP',       'AM',       'BA',       'CE',   'DF',   'ES',
        'GO',        'MA',      'MT',       'MS',       'MG',       'PA',
        'PB',        'PR',      'PE',       'PI',       'RJ',       'RN',
        'RS',        'RO',      'RR',       'SC',       'SP',       'SE',
        'TO'
    ];

  }
}
