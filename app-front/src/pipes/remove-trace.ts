import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeTrace'
})
export class removeTrace implements PipeTransform {
  transform(string) {
    //Key para atribuir propriedades
    let traceRemoved = string.replace(/-/g, ' ');
    return traceRemoved;
  }
}