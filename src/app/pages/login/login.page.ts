import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FireService } from 'src/app/services/fire.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { getAuth, signInWithEmailAndPassword, user } from '@angular/fire/auth';
import { initializeApp } from '@angular/fire/app'
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  
  //aquí podemos crear variables, constrantes, listas, arreglos, json, etc:
  //NOMBRE_VARIABLE: TIPO_DATO = VALOR;
  titulo: string = "PÁGINA DE LOGIN";
  numero: number = 5;
  decimal: number = 5.2;
  existe: boolean = true;
  fecha_hoy: Date = new Date();
  nombres: string[] = ["Pedro","Juan","Diego"];
  persona: any = {"nombre":"Jeison", "edad": 5};

  //NgModel:
  email: string = "";
  password: string = "";
  tipo_user:string="";

  constructor(private router: Router, private usuarioService: UsuarioService,
    private alertController: AlertController, // Controlador de alerta
    private fireService: FireService,
    private fireAuth: AngularFireAuth
  ) { }

  ngOnInit() {
  }

  //Alerta del boton de login
  alertButtons = ['Aceptar'];

  //método asociado al boton para hacer un login:
  async login() {

    const auth = getAuth();
    var isAuthenticated: boolean = false;
    const isAuthenticatedLocalStorage = this.usuarioService.authenticate(this.email, this.password);
    //Llamar a firebase para autenticar al usuario
    signInWithEmailAndPassword(auth,this.email,this.password)
      .then((userCredential) => {
        //Autenticacion exitosa
        const user = userCredential.user;
        console.log('usuario autenticado',user)
        isAuthenticated = true;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      })

    
    if (isAuthenticated) {
      if(await isAuthenticatedLocalStorage){
        this.router.navigate(['/home']); // Navegar a la página principal
      } else {
        await this.presentAlert(); // Llama al método de alerta aquí
      }
    } 
  }
  

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Usuario o contraseña incorrectos',
      buttons: ['Aceptar'],
    });

    await alert.present();
  }
}
