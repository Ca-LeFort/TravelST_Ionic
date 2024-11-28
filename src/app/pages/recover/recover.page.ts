import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';
import {getAuth, sendPasswordResetEmail} from 'firebase/auth';
import { FireService } from 'src/app/services/fire.service';
import { firstValueFrom } from 'rxjs';


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

  constructor(private router: Router,
    private alertController: AlertController, 
    private usuarioService: UsuarioService,
    private fireService: FireService) { }

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
    // Convertimos el Observable en una Promesa
    const usuarios = await firstValueFrom(this.fireService.getUsuarios());
    
    // Indicar explícitamente que se trata de un arreglo con objetos que tienen 'email', 'nombre' y 'rut'
    const user = (usuarios as any[]).find((u) => u.rut === this.rut);
  
    if (user) {
      try {
        // Usamos Firebase para enviar el correo de restablecimiento de contraseña
        const auth = getAuth();
        await sendPasswordResetEmail(auth, user.email);
  
        // Si se envió correctamente, mostramos el mensaje
        await this.presentAlert(
          'Recuperar Contraseña', 
          'Proceso de recuperación', 
          `Se ha enviado un correo para recuperar la contraseña del usuario ${user.nombre}.`
        );
  
        // Después de mostrar la alerta, redirigimos al usuario
        this.router.navigate(['/login']);
      } catch (error: any) {
        // Manejamos errores al intentar enviar el correo
        console.error('Error al enviar el correo de recuperación:', error.message);
        await this.presentAlert(
          'Error', 
          'No se pudo enviar el correo', 
          'Ocurrió un error al intentar enviar el correo de recuperación. Intente más tarde.'
        );
      }
    } else {
      // Si el usuario no existe, mostramos el mensaje de error
      await this.presentAlert(
        'Error', 
        'Usuario no encontrado', 
        'No existe un usuario con ese RUT registrado.'
      );
    }
  }
  

  
}
