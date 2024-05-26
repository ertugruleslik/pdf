import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultRoutesComponent } from './shared/default-routes/default-routes.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./extended-pdf-viewer/extended-pdf-viewer.module').then(m => m.ExtendedPdfViewerModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
