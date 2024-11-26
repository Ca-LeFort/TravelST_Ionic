import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReservasPage } from './reservas.page';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { HttpClientModule } from '@angular/common/http';

describe('Página Reservas', () => {
  let component: ReservasPage;
  let fixture: ComponentFixture<ReservasPage>;
  let usuarioPrueba = {
    "rut": "21638902-6",
    "nombre": "javier",
    "fechaNacimiento": "2004-08-01",
    "apellidos": "soto jaque",
    "genero": "Masculino",
    "email": "javier@duocuc.cl",
    "password": "administrador",
    "repeat_password": "administrador",
    "tiene_vehiculo": "si",
    "nombre_marca": "ferrari",
    "capacidad": 2,
    "nombre_modelo": "Mauil",
    "patente": "CC-BB-12",
    "tipo_usuario": "administrador"
  };

  beforeEach(async () => {
    const localStoragePrueba = {
      getItem: jasmine.createSpy('getItem').and.callFake((key: string) => {
        if(key === 'usuario'){
          return JSON.stringify(usuarioPrueba);
        }
        return null;
      }),
      setItem: jasmine.createSpy('setItem'),
      removeItem: jasmine.createSpy('removeItem')
    }
    Object.defineProperty(window, 'localStorage', {value: localStoragePrueba});

    await TestBed.configureTestingModule({
      declarations: [ReservasPage],
      imports: [IonicModule.forRoot(), IonicStorageModule.forRoot(), 
                AngularFireModule.initializeApp(environment.firebaseConfig), HttpClientModule,]
    }).compileComponents();

    fixture = TestBed.createComponent(ReservasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('1. Verificar si la página Reservas se abre', () => {
    expect(component).toBeTruthy();
  });

  it('2. Formulario válido', ()=> {
    component.viaje.setValue({
      'id' : 1,
      'conductor' : 'Benjamin',
      'asientos_disponibles' : '2',
      'destino' : 'Duoc UC Puente Alto',
      'latitud' : '-33.59836727695556',
      'longitud' : '-70.578819737547',
      'distancia_metros' : '1340',
      'tiempo_minutos' : '8',
      'precio' : 267,
      'estado_viaje' : 'pendiente',
      'pasajeros' : []
    });
    expect(component.viaje.valid).toBeTrue();
  });

  it('3.1 Botón Crear viaje DESHABILITADO', ()=> {
    component.viaje.setValue({
      'id' : 1,
      'conductor' : '',
      'asientos_disponibles' : '',
      'destino' : '',
      'latitud' : '',
      'longitud' : '',
      'distancia_metros' : '',
      'tiempo_minutos' : '',
      'precio' : '',
      'estado_viaje' : 'pendiente',
      'pasajeros' : []
    });
    const botonRegistrar = fixture.nativeElement.querySelector('ion-button[type="submit"]');
    expect(botonRegistrar.disabled).toBeTrue();
  });

  it('3.2 Botón Crear viaje HABILITADO', ()=> {
    component.viaje.setValue({
      'id' : 1,
      'conductor' : 'Benjamin',
      'asientos_disponibles' : '2',
      'destino' : 'Duoc UC Puente Alto',
      'latitud' : '-33.59836727695556',
      'longitud' : '-70.578819737547',
      'distancia_metros' : '1340',
      'tiempo_minutos' : '8',
      'precio' : 267,
      'estado_viaje' : 'pendiente',
      'pasajeros' : []
    });
    const botonRegistrar = fixture.nativeElement.querySelector('ion-button[type="submit"]');
    expect(botonRegistrar.disabled).toBeFalse();
  });
});
