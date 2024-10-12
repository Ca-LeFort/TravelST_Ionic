import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import * as G from 'leaflet-control-geocoder';
import 'leaflet-routing-machine';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.page.html',
  styleUrls: ['./reservas.page.scss'],
})
export class ReservasPage implements OnInit {

  // Variables
  private map: L.Map | undefined;
  private geocoder: G.Geocoder | undefined;

  latitud: number = 0;
  longitud: number = 0;
  direccion: string = "";
  distancia_metros: number = 0;
  tiempo_segundos: number = 0;

  constructor() { }

  ngOnInit() {
    this.initMap();
  }

  initMap(){
    // ACÁ CARGAMOS E INICIALIZAMOS EL MAPA
    this.map = L.map("map").setView([-33.59836727695556, -70.578819737547], 15);
    let marker = L.marker([-33.59836727695556, -70.578819737547]).addTo(this.map);

    marker.bindPopup("<b>Duoc UC: Sede Puente Alto</b>");

    // ES LA PLANTILLA PARA QUE SE VEA EL MAPA
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    this.map.whenReady(() => {
      setTimeout(() => {
        this.map?.invalidateSize();
      }, 500);
    });

    // VAMOS A AGREGAR UN BUSCADOR DE DIRECCIONES
    this.geocoder = G.geocoder({
      placeholder: "Ingrese la dirección a buscar",
      errorMessage: "Dirección NO encontrada",
    }).addTo(this.map);

    this.map.on('locationfound', (e)=>{
      console.log(e.latlng.lat);
      console.log(e.latlng.lng);
    });

    // Vamos a realizar una acción con el buscador, cuando ocurra algo con 
    this.geocoder.on('markgeocode', (e)=>{
      this.latitud = e.geocode.properties['lat'];
      this.longitud = e.geocode.properties['lon'];
      this.direccion = e.geocode.properties['display_name'];

      if(this.map){
        L.Routing.control({
          waypoints: [L.latLng(-33.59836727695556, -70.578819737547), 
                      L.latLng(this.latitud, this.longitud)],
          fitSelectedRoutes: true
        }).on('routesfound', (e)=>{
          this.distancia_metros = e.routes[0].summary.totalDistance;
          this.tiempo_segundos = e.routes[0].summary.totalTime;
        }).addTo(this.map);
      }
    });
  }
}
