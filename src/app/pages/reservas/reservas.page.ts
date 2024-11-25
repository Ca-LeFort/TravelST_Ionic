import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import * as L from 'leaflet';
import * as G from 'leaflet-control-geocoder';
import 'leaflet-routing-machine';
import { ApiService } from 'src/app/services/api.service';
import { FireService } from 'src/app/services/fire.service';
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
  isDarkMode: boolean = false; // Estado del modo oscuro

  latitud: number = 0;
  longitud: number = 0;
  direccion: string = "";
  distancia_metros: number = 0;
  tiempo_minutos: number = 0;
  precio: number = 0;
  pesoCLP: number = 0;

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
    estado_viaje: new FormControl('disponible'),
    pasajeros: new FormControl([])
  });

  viajes: any[] = [];
  historial : any[] =[];
  misViajes : any[] = [];

  constructor(private viajeService: ViajeService, private usuarioService: UsuarioService, private alertController: AlertController,
              private apiService: ApiService, private fireService: FireService
  ) { }

  async ngOnInit() {
    this.usuario = JSON.parse(localStorage.getItem("usuario") || "");
    this.viaje.controls.conductor.setValue(this.usuario.nombre);
    this.consumoApiPeso();
    this.listarViajes();
  }

  consumoApiPeso(){
    this.apiService.getDolar().subscribe((data:any)=>{
      this.pesoCLP = Math.round(data.dolar.valor * 0.15);
    });
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

        this.map.whenReady(() => {
            setTimeout(() => {
                this.map?.invalidateSize();
            }, 500);
        });

        // VAMOS A AGREGAR UN BUSCADOR DE DIRECCIONES
        this.geocoder = G.geocoder({
            placeholder: "Ingrese la dirección a buscar",
            errorMessage: "Dirección NO encontrada",
            position: 'topleft'
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
                    waypoints: [
                        L.latLng(-33.59836727695556, -70.578819737547),
                        L.latLng(this.latitud, this.longitud)
                    ],
                    fitSelectedRoutes: true,
                    lineOptions: {
                        styles: [
                            { color: 'blue', opacity: 0.6, weight: 5 } // Personaliza el color, opacidad y grosor de la línea aquí
                        ],
                        extendToWaypoints: true,
                        missingRouteTolerance: 1
                    }
                }).on('routesfound', (e) => {
                    this.distancia_metros = e.routes[0].summary.totalDistance;
                    this.tiempo_minutos = Math.round(e.routes[0].summary.totalTime / 60);
                    this.precio = Math.round(this.distancia_metros / 400 * this.pesoCLP);
                }).addTo(this.map);
            }
        });
    } catch (error) {
        console.error("Error al inicializar el mapa:", error);
    }
}

async registrarViaje() {
  if (this.viaje.valid) {
    const nextId = await this.fireService.getNextId();
    this.viaje.controls.id.setValue(nextId);

    const viaje = this.viaje.value;
    const id = this.usuario.rut; // Asignar el ID del usuario al viaje

    // Registro del viaje en la base de datos
    const registroViaje = await this.fireService.crearViaje(viaje);
    if (registroViaje) {
      await this.presentAlert('Bien', 'El viaje ha sido registrado con éxito!');

      // Cargar el historial existente del usuario desde Firestore
      this.historial = await this.fireService.cargarHistorial(this.usuario.rut);

      // Agregar el nuevo viaje al historial
      this.historial.push(viaje);

      // Guardar el historial actualizado en Firestore
      await this.fireService.guardarHistorial(this.usuario.rut, this.historial);

      // Resetear el formulario después de guardar
      this.viaje.reset();
      console.log('Viaje registrado');
    } else {
      console.log('Formulario inválido');
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
        handler: async () => {
          const usuario = JSON.parse(localStorage.getItem("usuario") || '{}');
          const viajes = await this.viajeService.getViajes();
          
          // Verificar si el usuario ya tiene una reserva activa
          const viajeReservado = viajes.some((v: any) => 
            v.pasajeros.some((pasajero: any) => pasajero.rut === usuario.rut) 
          );

          if (viajeReservado) {
            await this.presentAlert('Error!', 'Ya has tomado un viaje, no puedes reservar otro');
            return;
          }

          if (viaje.asientos_disponibles > 0) {
            viaje.asientos_disponibles -= 1;

            if (viaje.asientos_disponibles === 0) {
              viaje.estado_viaje = 'en preparación';
            }

            viaje.pasajeros.push(usuario);

            try {
              // Aquí se intenta actualizar el viaje, si no hay errores se asume que se actualizó correctamente
              await this.fireService.updateViaje(viaje);  // No esperamos un valor, solo esperamos que se complete correctamente
              await this.presentAlert('Reservado', 'El viaje ha sido reservado con éxito!');

              // Registrar el viaje en el historial
              const historial = await this.fireService.cargarHistorial(usuario.rut);
              historial.push(viaje); // Agregar el viaje al historial
              await this.fireService.guardarHistorial(usuario.rut, historial); // Guardar el historial actualizado

            } catch (error) {
              console.log('Error al actualizar el viaje:', error);
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
    //this.viajes = await this.viajeService.getViajes();
    this.fireService.getViajes().subscribe(data=>{
      this.viajes=data;
    })
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
  

