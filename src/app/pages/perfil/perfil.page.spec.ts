import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilPage } from './perfil.page';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';

describe('Página Perfil', () => {
  let component: PerfilPage;
  let fixture: ComponentFixture<PerfilPage>;
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
      declarations: [PerfilPage],
      imports: [IonicModule.forRoot(), IonicStorageModule.forRoot(), AngularFireModule.initializeApp(environment.firebaseConfig)]
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Verificar si la página Perfil se abre', () => {
    expect(component).toBeTruthy();
  });
});