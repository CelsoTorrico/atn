import { NgModule } from "@angular/core";
import { MapToIterable } from './map-to-interable';
import { MapInIterable } from "./map-in-interable";
import { removeTrace } from "./remove-trace";
import { dateReplaceToTrace } from "./date-replace-to-trace";

@NgModule({
    declarations: [
        MapToIterable,
        MapInIterable,
        removeTrace,
        dateReplaceToTrace
      ],
      imports: [
        
      ],
      exports: [MapToIterable, MapInIterable, removeTrace, dateReplaceToTrace],
      bootstrap: [],
      entryComponents:[], 
      schemas: [],
      providers: []
})
export class PipesModule{}