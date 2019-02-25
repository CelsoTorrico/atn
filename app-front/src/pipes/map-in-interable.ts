import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mapInIterable'
})
export class MapInIterable implements PipeTransform {
  transform(obj) {
    var a = [];
    for (const iterator of obj) {
      if (obj.hasOwnProperty(iterator)) {
        a.push({key: iterator, val: obj[iterator]});
      }
    }
    return a;
  }
}