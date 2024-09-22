import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-recover',
  templateUrl: './recover.page.html',
  styleUrls: ['./recover.page.scss'],
})
export class RecoverPage implements OnInit {

  //NgModel:
  usuario: string = "";

  /*Boton*/
  alertButtons = ['Aceptar'];

  constructor(private alertController: AlertController) { }

  ngOnInit() {
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Recuperar Contraseña',
      subHeader: 'Proceso de recuperación',
      message: `Se ha enviado un correo a ${this.usuario} para recuperar su contraseña.`,
      buttons: this.alertButtons,
    });

    await alert.present();
  }
  
}
