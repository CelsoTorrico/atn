import { NgModule } from "@angular/core";
import { MapToIterable } from './map-to-interable';
import { MapInIterable } from "./map-in-interable";
import { removeTrace } from "./remove-trace";
import { dateReplaceToTrace } from "./date-replace-to-trace";
import { stringTitlecaseSpecialChars } from "./string-replace-special-chars";

@NgModule({
    declarations: [
        MapToIterable,
        MapInIterable,
        removeTrace,
        dateReplaceToTrace,
        stringTitlecaseSpecialChars
      ],
      imports: [
        
      ],
      exports: [MapToIterable, MapInIterable, removeTrace, dateReplaceToTrace, stringTitlecaseSpecialChars],
      bootstrap: [],
      entryComponents:[], 
      schemas: [],
      providers: []
})
export class PipesModule{}