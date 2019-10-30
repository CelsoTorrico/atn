import { Directive, ViewContainerRef, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[profile-view]',
})
export class ProfileViewDirective {
  
  @Output() updateProfileInComponent = new EventEmitter();
  
  constructor(public viewContainerRef: ViewContainerRef) { }

  componentChildUpdate($event) {
    this.updateProfileInComponent.emit($event);
  }

}