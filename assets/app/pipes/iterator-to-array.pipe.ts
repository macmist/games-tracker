import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'iteratorToArray'})
export  class IteratorToArrayPipe implements PipeTransform {
  transform(value: IterableIterator<any>) {
    return Array.from(value);
  }
}
