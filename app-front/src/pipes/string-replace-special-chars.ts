import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringTitlecaseSpecialChars'
})
export class stringTitlecaseSpecialChars implements PipeTransform {
  
  transform(string) {

    if (string == null) {
      return string;
    }

    //Key para atribuir propriedades
    let stringReplace = string.replace(/\w\S*/g, (word => this.subsChar(word)));

    return stringReplace; 

  }

  private subsChar(c) {

      //Transforma texto em caixa baixa
      c = c.toLowerCase(); 
      
      let firstChar = c.charAt(0);
      let subsChar = firstChar.toUpperCase();

      return c.replace(firstChar, subsChar);  
  }

}