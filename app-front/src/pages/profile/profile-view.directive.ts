import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[profile-view]',
})
export class ProfileViewDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}