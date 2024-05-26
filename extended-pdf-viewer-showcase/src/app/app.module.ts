import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { ExportAnnotationsComponent } from './extended-pdf-viewer/export-annotations/export-annotations.component';

import { AppCommonModule } from './app.common.module';
import { ExtendedPdfViewerMenuComponent } from './nav/extended-pdf-viewer-menu/extended-pdf-viewer-menu.component';
import { OctocatComponent } from './nav/octocat/octocat.component';


@NgModule({
  declarations: [
    NavComponent,
    AppComponent,
    OctocatComponent,
    ExtendedPdfViewerMenuComponent,
    ExportAnnotationsComponent
  ],
  imports: [
    AppCommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
