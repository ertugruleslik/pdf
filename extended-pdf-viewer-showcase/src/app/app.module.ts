import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { AppCommonModule } from './app.common.module';
import { ExtendedPdfViewerMenuComponent } from './nav/extended-pdf-viewer-menu/extended-pdf-viewer-menu.component';
import { OctocatComponent } from './nav/octocat/octocat.component';


@NgModule({
  declarations: [
    AppComponent,
    OctocatComponent,
    ExtendedPdfViewerMenuComponent
  ],
  imports: [
    AppCommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
