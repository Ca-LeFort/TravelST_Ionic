import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdministrarPage } from './administrar.page';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';

describe('Página de Administrador', () => {
  let component: AdministrarPage;
  let fixture: ComponentFixture<AdministrarPage>;
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
      declarations: [AdministrarPage],
      imports: [IonicModule.forRoot(), IonicStorageModule.forRoot(), 
                AngularFireModule.initializeApp(environment.firebaseConfig)]
    }).compileComponents();

    fixture = TestBed.createComponent(AdministrarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('1. Verificar si la página de administrador se abre', () => {
    expect(component).toBeTruthy();
  });

  it('2.1 Validar RUT en Administrador de Usuarios', ()=> {
    const formatoRUT = component.usuario.get('rut');
    formatoRUT?.setValue('21638902-6');
    expect(formatoRUT?.valid).toBeTrue();
  });

  it('2.2 RUT ingresado NO sigue formato en Administrador de Usuarios', ()=> {
    const formatoRUT = component.usuario.get('rut');
    formatoRUT?.setValue('216389026');
    expect(formatoRUT?.valid).toBeFalse();
    expect(formatoRUT?.hasError('pattern')).toBeTrue();
  });

  it('3. Botón registrar DESHABILITADO en Administrador de Perfil', ()=> {
    component.usuario.setValue({
      "rut": "",
      "nombre": "",
      "fechaNacimiento": "",
      "apellidos": "",
      "genero": "",
      "email": "",
      "password": "",
      "repeat_password": "",
      "tiene_vehiculo": "no",
      "nombre_marca": "",
      "capacidad": "",
      "nombre_modelo": "",
      "patente": "",
      "tipo_usuario": "estudiante",
      "uid" : ""
    });
    const botonModificar = fixture.nativeElement.querySelector('ion-button[type="submit"]')
    expect(botonModificar.disabled).toBeTrue();
  });
});