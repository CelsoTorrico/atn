import { NgModule } from "@angular/core";
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from 'ionic-angular';
import { CommonModule } from '@angular/common';
import { searchField } from "./search";

@NgModule({
    declarations: [
        searchField
      ],
      imports: [
        TranslateModule.forChild(),
        IonicModule,
        CommonModule
      ],
      exports: [searchField],
      bootstrap: [searchField],
      entryComponents:[searchField], 
      schemas: [],
      providers: []
})
export class SearchFieldsModule{}