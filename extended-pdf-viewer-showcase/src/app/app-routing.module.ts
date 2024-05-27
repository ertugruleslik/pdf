import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultRoutesComponent } from './shared/default-routes/default-routes.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: 'viewer',
    component:AppComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
