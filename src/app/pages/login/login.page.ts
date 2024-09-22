import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';

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

  constructor(private router: Router, private usuarioService: UsuarioService,
    private alertController: AlertController // Controlador de alerta
  ) { }

  ngOnInit() {
  }

  //Alerta del boton de login
  alertButtons = ['Aceptar'];


  //método asociado al boton para hacer un login:
  async login(){
    const user = this.usuarioService.getUsuarios().find((u: any) => u.email === this.email && u.password === this.password);
    if(user){
      this.router.navigate(['/home']);
    }else{
      await this.presentAlert(); // Llama al método de alerta aquí
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
