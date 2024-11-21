import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HomePage } from './home.page';
import { RouterTestingModule } from '@angular/router/testing';

describe('Página Home', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
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

  // Aquí dentro del beforeEach deben prepara todo lo necesario de la página para hacer pruebas
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
      declarations: [HomePage],
      imports: [IonicModule.forRoot(), RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // "it" es una Prueba unitaria:
  it('1. Verificar si la página se abre', () => {
    // Aquí dentro va lo que deseo probar:
    expect(component).toBeTruthy();
  });

  it('2. Verificar el nombre del usuario', () => {
    expect(component.usuario.nombre).toEqual('javier');
  });

  it('3. Validar el usuario COMPLETO', () => {
    expect(localStorage.getItem).toHaveBeenCalledWith('usuario');
    expect(component.usuario).toEqual(usuarioPrueba);
  });

  
});
