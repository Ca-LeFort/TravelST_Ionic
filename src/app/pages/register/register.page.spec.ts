import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterPage } from './register.page';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';

describe('Página Registro', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;

  beforeEach(async () => {
    // Aquí dentro le entrego todo lo que necesite como módulos:
    await TestBed.configureTestingModule({
      declarations: [RegisterPage],
      imports: [IonicModule.forRoot(), IonicStorageModule.forRoot(), AngularFireModule.initializeApp(environment.firebaseConfig)]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('1. Verificar si la página registro se abre', () => {
    expect(component).toBeTruthy();
  });

  it('2.1 Validar el nombre incorrecto al estar vacío', ()=> {
    const nombreControl = component.usuario.get('nombre');
    nombreControl?.setValue("");
    expect(nombreControl?.valid).toBeFalse();
    expect(nombreControl?.hasError('required')).toBeTrue();
  });

  it('2.2 Validar el formato del nombre', ()=> {
    const formatoNombre = component.usuario.get('nombre');
    formatoNombre?.setValue("c");
    expect(formatoNombre?.valid).toBeFalse();
    expect(formatoNombre?.hasError('pattern')).toBeTrue();
  });

  it('2.3 Validar un nombre correcto', ()=> {
    const nombreControl = component.usuario.get('nombre');
    nombreControl?.setValue('Benjamin');
    expect(nombreControl?.hasError('required')).toBeFalse();
    expect(nombreControl?.hasError('pattern')).toBeFalse();
    expect(nombreControl?.valid).toBeTrue();
  });

  it('3.1 Botón registrar deshabilitado', ()=> {
    component.usuario.setValue({
      "rut": "",
      "nombre": "",
      "fechaNacimiento": "",
      "apellidos": "",
      "genero": "",
      "email": "",
      "password": "",
      "repeat_password": "",
      "tiene_vehiculo": "",
      "nombre_marca": "",
      "capacidad": "",
      "nombre_modelo": "",
      "patente": "",
      "tipo_usuario": ""
    });
    const botonRegistrar = fixture.nativeElement.querySelector('ion-button[type="submit"]');
    expect(botonRegistrar.disabled).toBeTrue();
  });

  it('3.1 Botón registrar habilitado', ()=> {
    component.usuario.setValue({
      "rut": "21638902-6",
      "nombre": "javier",
      "apellidos": "soto jaque",
      "fechaNacimiento": "2004-08-01",
      "genero": "Masculino",
      "email": "javier@duocuc.cl",
      "password": "administrador",
      "repeat_password": "administrador",
      "tiene_vehiculo": "no",
      "nombre_marca": "",
      "capacidad": "",
      "nombre_modelo": "",
      "patente": "",
      "tipo_usuario": "administrador"
    });
    const botonRegistrar = fixture.nativeElement.querySelector('ion-button[type="submit"]');
    expect(botonRegistrar.disabled).toBeFalse();
  });

  it('4. Formulario válido', ()=> {
    component.usuario.setValue({
      "rut": "21638902-6",
      "nombre": "javier",
      "apellidos": "soto jaque",
      "fechaNacimiento": "2004-08-01",
      "genero": "Masculino",
      "email": "javier@duocuc.cl",
      "password": "administrador",
      "repeat_password": "administrador",
      "tiene_vehiculo": "si",
      "nombre_marca": "ferrari",
      "capacidad": "2",
      "nombre_modelo": "Mauil",
      "patente": "CC-BB-12",
      "tipo_usuario": "administrador"
    });
    expect(component.usuario.valid).toBeTrue();
  });
});
