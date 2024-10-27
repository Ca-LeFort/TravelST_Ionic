import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViajeService } from 'src/app/services/viaje.service';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-detalle-reserva',
  templateUrl: './detalle-reserva.page.html',
  styleUrls: ['./detalle-reserva.page.scss'],
})
export class DetalleReservaPage implements OnInit {
  isDarkMode: boolean = false; // Estado del modo oscuro
  
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

  constructor(private viajeService: ViajeService, private activatedRoute: ActivatedRoute, private alertController: AlertController) {}

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

    // Definir las capas de mapa
    const streetsLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    const googleSat = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });

    const googleTerrain = L.tileLayer('https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });

    const googleHybrid = L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });

    // Añadir la capa de calles por defecto
    streetsLayer.addTo(this.map);

    // Crear el control de capas
    const baseLayers = {
        "Calle": streetsLayer,
        "Satélite": googleSat,
        "Terreno": googleTerrain,
        "Híbrido": googleHybrid
    };

    // Añadir el control de capas al mapa
    L.control.layers(baseLayers).addTo(this.map);

  
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

  async presentAlert(header: string, subHeader: string) {
    const alert = await this.alertController.create({
      header: header,       // Título de la alerta
      subHeader: subHeader, // Subtítulo de la alerta
    });

    await alert.present();
  }


  //METODO DEL MODO OSCURO
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;

    const mapElement = document.getElementById('map');
    if (mapElement) {
      if (this.isDarkMode) {
        mapElement.style.filter = 'invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%)';
      } else {
        mapElement.style.filter = 'none';
      }
    }
  }
}
