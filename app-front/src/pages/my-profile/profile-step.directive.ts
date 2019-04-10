import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[profile-step]',
})
export class ProfileStepDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}