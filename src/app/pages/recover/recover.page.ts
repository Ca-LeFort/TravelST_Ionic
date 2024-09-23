import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-recover',
  templateUrl: './recover.page.html',
  styleUrls: ['./recover.page.scss'],
})
export class RecoverPage implements OnInit {

  //NgModel:
  rut: string = "";

  /*Boton*/
  alertButtons = ['Aceptar'];

  constructor(private router: Router,private alertController: AlertController, private usuarioService: UsuarioService) { }

  ngOnInit() {
  }

  
  async presentAlert(header: string, subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header: header,       // Título de la alerta
      subHeader: subHeader, // Subtítulo de la alerta
      message: message,     // Mensaje de la alerta
      buttons: ['OK']       // Botones de la alerta (puedes reemplazar 'OK' por this.alertButtons si lo prefieres)
    });
  
    await alert.present();
  }
  
  /* Método para verificar la existencia de un usuario */
  async comprobarUsuario() {
    const user = this.usuarioService.getUsuarios().find((u: any) => u.rut === this.rut);
    
    if (user) {
      // Si el usuario existe, muestra el mensaje de que se envió un correo
      await this.presentAlert(
        'Recuperar Contraseña', 
        'Proceso de recuperación', 
        `Se ha enviado un correo para recuperar la contraseña del usuario ${user.nombre}.`
      );
      this.router.navigate(['/login'])
    } else {
      // Si el usuario no existe, muestra un mensaje de error
      await this.presentAlert(
        'Error', 
        'Usuario no encontrado', 
        'No existe un usuario con ese RUT registrado.'
      );
    }
  }
}
