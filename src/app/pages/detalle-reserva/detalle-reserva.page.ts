import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViajeService } from 'src/app/services/viaje.service';

@Component({
  selector: 'app-detalle-reserva',
  templateUrl: './detalle-reserva.page.html',
  styleUrls: ['./detalle-reserva.page.scss'],
})
export class DetalleReservaPage implements OnInit {

  viaje: any;
  id: number = 0;

  constructor(private viajeService: ViajeService, private activaedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.id = +(this.activaedRoute.snapshot.paramMap.get("id") || 0);
    this.viaje = this.viajeService.getViaje(this.id);
  }

}
