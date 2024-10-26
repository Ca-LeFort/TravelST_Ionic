import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import * as L from 'leaflet';
import * as G from 'leaflet-control-geocoder';
import 'leaflet-routing-machine';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ViajeService } from 'src/app/services/viaje.service';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.page.html',
  styleUrls: ['./reservas.page.scss'],
})
export class ReservasPage implements OnInit, AfterViewInit {

  // Variables
  private map: L.Map | undefined;
  private geocoder: G.Geocoder | undefined;
  usuario: any;

  latitud: number = 0;
  longitud: number = 0;
  direccion: string = "";
  distancia_metros: number = 0;
  tiempo_minutos: number = 0;
  precio: number = 0;

  viaje = new FormGroup({
    id: new FormControl(),
    conductor: new FormControl('', [Validators.required]),
    asientos_disponibles: new FormControl('', [Validators.required]),
    destino: new FormControl('', [Validators.required]),
    latitud: new FormControl('', [Validators.required]),
    longitud: new FormControl('', [Validators.required]),
    distancia_metros: new FormControl('', [Validators.required]),
    tiempo_minutos: new FormControl('', [Validators.required]),
    precio: new FormControl(),
    estado_viaje: new FormControl('pendiente'),
    pasajeros: new FormControl([])
  });

  viajes: any[] = [];

  constructor(private viajeService: ViajeService, private usuarioService: UsuarioService, private alertController: AlertController) { }

  async ngOnInit() {
    this.usuario = JSON.parse(localStorage.getItem("usuario") || "");
    this.viaje.controls.conductor.setValue(this.usuario.nombre);
    await this.listarViajes();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initMap();
    }, 2000);
  }

  initMap() {
    try {
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

      this.map.on('locationfound', (e) => {
        console.log(e.latlng.lat);
        console.log(e.latlng.lng);
      });

      // Vamos a realizar una acción con el buscador, cuando ocurra algo con 
      this.geocoder.on('markgeocode', (e) => {
        this.latitud = e.geocode.properties['lat'];
        this.longitud = e.geocode.properties['lon'];
        this.direccion = e.geocode.properties['display_name'];

        if (this.map) {
          L.Routing.control({
            waypoints: [L.latLng(-33.59836727695556, -70.578819737547),
            L.latLng(this.latitud, this.longitud)],
            fitSelectedRoutes: true
          }).on('routesfound', (e) => {
            this.distancia_metros = e.routes[0].summary.totalDistance;
            this.tiempo_minutos = Math.round(e.routes[0].summary.totalTime / 60);
            this.precio = Math.round(this.distancia_metros/400 * 100);

          }).addTo(this.map);
        }
      });
    } catch (error) {
    }
  }

  async registrarViaje() {
    if (this.viaje.valid) {
      const nextId = await this.viajeService.getNextId();
      this.viaje.controls.id.setValue(nextId);

      const viaje = this.viaje.value;
      const registroViaje = await this.viajeService.createViaje(viaje);

      if (registroViaje) {
        await this.presentAlert('Bien', 'El viaje ha sido registrado con éxito!');
        this.viaje.reset();
        console.log('Viaje registrado');
      } else {
        console.log('Formulario invalido');
        await this.presentAlert('Error', 'El Formulario del registro es inválido, complete los campos');
      }
    }
  }

  async reservarViaje(viaje: any) {
    const alert = await this.alertController.create({
      header: 'Confirmar reserva',
      message: '¿Estás seguro de que deseas reservar este viaje?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Reserva cancelada');
          }
        },
        {
          text: 'Sí',
          role: 'confirm',
          handler: async() => {
            const usuario = JSON.parse(localStorage.getItem("usuario") || '{}');
            const viajes = await this.viajeService.getViajes();
            const viajeReservado = viajes.some((v: any) => 
              v.pasajeros.some((pasajero: any) => pasajero.rut === usuario.rut)
            );
            
            if(viajeReservado) {
              await this.presentAlert('Error!', 'Ya has tomado un viaje, no puedes reservar otro');
              return;
            }
        
            if(viaje.asientos_disponibles > 0) {
              viaje.asientos_disponibles -= 1;
        
              if(viaje.asientos_disponibles === 0){
                viaje.estado_viaje = 'Agotado';
              }
        
              viaje.pasajeros.push(usuario);
        
              const actualizado = await this.viajeService.updateViaje(viaje.id, viaje);
              if(actualizado) {
                await this.presentAlert('Reservado', 'El viaje ha sido reservado con éxito!');
              } else {
                console.log('No se pudo actualizar el viaje')
              }
            } else {
              console.log('No hay asientos disponibles');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async listarViajes() {
    this.viajes = await this.viajeService.getViajes();
  }
}
