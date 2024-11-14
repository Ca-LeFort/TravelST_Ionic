import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsumoApiPage } from './consumo-api.page';

const routes: Routes = [
  {
    path: '',
    component: ConsumoApiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsumoApiPageRoutingModule {}
