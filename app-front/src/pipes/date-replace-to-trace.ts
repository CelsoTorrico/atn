import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateReplaceToTrace'
})
export class dateReplaceToTrace implements PipeTransform {
  transform(string) {
    //Key para atribuir propriedades
    let traceReplace = string.replace(/\//g, '-');
    return traceReplace;
  }
}