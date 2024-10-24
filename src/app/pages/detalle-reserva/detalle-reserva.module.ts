import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleReservaPageRoutingModule } from './detalle-reserva-routing.module';

import { DetalleReservaPage } from './detalle-reserva.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleReservaPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [DetalleReservaPage]
})
export class DetalleReservaPageModule {}
