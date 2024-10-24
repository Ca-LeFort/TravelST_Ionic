import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViajeService } from 'src/app/services/viaje.service';
import * as L from 'leaflet';
import 'leaflet-routing-machine';


@Component({
  selector: 'app-detalle-reserva',
  templateUrl: './detalle-reserva.page.html',
  styleUrls: ['./detalle-reserva.page.scss'],
})
export class DetalleReservaPage implements OnInit {

  private map: L.Map | undefined;
  id: number = 0;
  conductor: string = '';
  asientos_disponibles = 0;
  destino: string = '';
  latitud_destino: number = 0;
  longitud_destino: number = 0;
  distancia_metros = 0;
  tiempo_minutos = 0;
  precio = 0;

  constructor(private viajeService: ViajeService, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    setTimeout(() => {
      this.initMap();
    }, 2000);
    this.id = +(this.activatedRoute.snapshot.paramMap.get("id") || 0);
    this.viajeService.getViaje(this.id).then((viaje: any) => {
      if(viaje){
        this.conductor = viaje.conductor || '';
        this.asientos_disponibles = viaje.asientos_disponibles || 0;
        this.destino = viaje.destino;
        this.latitud_destino = viaje.latitud || 0;
        this.longitud_destino = viaje.longitud || 0;
        this.distancia_metros = viaje.distancia_metros;
        this.tiempo_minutos = viaje.tiempo_minutos;
        this.precio = viaje.precio
      }
    });
  }

  initMap(){
    this.map = L.map('map').setView([-33.59836727695556, -70.578819737547], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © OpenStreetMap contributors',
    }).addTo(this.map);

    const plan = L.Routing.plan(
      [
        L.latLng(-33.59836727695556, -70.578819737547),  // Punto de inicio
        L.latLng(this.latitud_destino, this.longitud_destino)         // Punto final
      ],
      {
        addWaypoints: false,  // Desactiva los waypoints intermedios
        createMarker: function(i, waypoint, n) {
          return L.marker(waypoint.latLng, {
            draggable: false,  // Desactiva el arrastre del marcador
          });
        }
      }
    );

    L.Routing.control({
      plan: plan,
      routeWhileDragging: true,
      show: false,
    }).addTo(this.map);
  }

}
