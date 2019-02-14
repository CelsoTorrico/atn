import { NgModule } from '@angular/core';
import { MultipleFields } from './multiple-fields';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
      MultipleFields
  ],
  imports: [
    TranslateModule.forChild(),
    FormsModule,
    CommonModule
  ],
  exports: [
    MultipleFields
  ], 
  entryComponents: [MultipleFields],
  bootstrap:[MultipleFields]
})
export class ProfilePageUtilsModule { }
