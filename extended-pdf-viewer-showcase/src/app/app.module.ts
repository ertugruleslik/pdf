import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';

import { AppCommonModule } from './app.common.module';
import { ExtendedPdfViewerMenuComponent } from './nav/extended-pdf-viewer-menu/extended-pdf-viewer-menu.component';
import { OctocatComponent } from './nav/octocat/octocat.component';
import { ExtendedPdfViewerModule } from './extended-pdf-viewer/extended-pdf-viewer.module';


@NgModule({
  declarations: [
    NavComponent,
    AppComponent,
    OctocatComponent,
    ExtendedPdfViewerMenuComponent,
  ],
  imports: [
    AppCommonModule,
    ExtendedPdfViewerModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
