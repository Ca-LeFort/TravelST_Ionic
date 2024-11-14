import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConsumoApiPageRoutingModule } from './consumo-api-routing.module';

import { ConsumoApiPage } from './consumo-api.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConsumoApiPageRoutingModule
  ],
  declarations: [ConsumoApiPage]
})
export class ConsumoApiPageModule {}
