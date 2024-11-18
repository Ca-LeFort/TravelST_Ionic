import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FireService } from 'src/app/services/fire.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { getAuth, signInWithEmailAndPassword, user } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { auth, firestore } from 'src/app/firestore-config';
import { setDoc } from 'firebase/firestore';

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
  login() {
    // Autenticar al usuario con Firebase
    signInWithEmailAndPassword(auth, this.email, this.password)
      .then((userCredential) => {
        // Autenticación exitosa
        const user = userCredential.user;
        const uid = user.uid; // Obtener el UID del usuario
        console.log('Usuario autenticado con UID:', uid);
  
        // Usar el servicio FireService para obtener los datos del usuario
        this.fireService.getUsuarioByUID(uid)
          .then((userData) => {
            if (userData) {
              console.log('Datos del usuario:', userData);
    
              // Guardar el objeto del usuario en el localStorage
              localStorage.setItem('usuario', JSON.stringify(userData));
    
              // Redirigir al usuario a la página principal
              this.router.navigate(['/home']);
            } else {
              console.error('El documento del usuario no existe en la base de datos.');
              
            }
          })
          .catch((error) => {
            console.error('Error al obtener los datos del usuario:', error);
           
          });
      })
      .catch((error) => {
        console.error('Error durante el inicio de sesión:', error);
        console.error('Código de error:', error.code);
        console.error('Mensaje del error:', error.message);
        
      });
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
