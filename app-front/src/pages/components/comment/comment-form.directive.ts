import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[commentform-directive]',
})
export class CommentFormDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}