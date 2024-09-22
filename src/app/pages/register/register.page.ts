import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  // Variables:
  usuario = new FormGroup({
    rut : new FormControl('',[Validators.minLength(9),Validators.maxLength(10),Validators.required,Validators.pattern("[0-9]{7,8}-[0-9kK]{1}")]),
    nombre: new FormControl('',[Validators.minLength(3),Validators.required,Validators.pattern("[a-zA-Z ]{3,15}")]),
    apellidos : new FormControl('', [Validators.minLength(3), Validators.required, Validators.pattern("[a-zA-Z ]{3,25}")]),
    fechaNacimiento : new FormControl('',[Validators.required]),
    genero : new FormControl('',[Validators.required]),
    email : new FormControl('',[Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@duocuc\.cl$/),Validators.required]),
    password : new FormControl('',[Validators.minLength(8),Validators.required]),
    repeat_password : new FormControl('',[Validators.minLength(8),Validators.required]),
    tiene_vehiculo: new FormControl('no',[Validators.required]),
    nombre_modelo: new FormControl('',[]),
    // Campo oculto que indica el tipo de usuario
    tipo_usuario: new FormControl('estudiante', []), // Valor por defecto 'normal'
  });

  // Método para comprobar si las contraseñas coinciden
  isPasswordMismatch(): boolean {
    const password = this.usuario.get('password')?.value;
    const repeatPassword = this.usuario.get('repeat_password')?.value;
  
    // Asegúrate de que siempre devuelva un booleano
    return !!(password && repeatPassword && password !== repeatPassword);
  }
  
  /*Boton*/
  alertButtons = ['Aceptar'];

  constructor(private router : Router, 
    private usuarioService: UsuarioService,
    private alertController: AlertController) { }

  ngOnInit() {
  }

  public registrar(): void {
    // Validar que las contraseñas coincidan
    if (this.isPasswordMismatch()) {
      // Mostrar un mensaje de error, por ejemplo, usando un alert o un toast
      console.error('Las contraseñas no coinciden.');
      return;
    }
  
    // Aquí puedes agregar lógica adicional, como llamar a un DAO o API para registrar al usuario
    //console.log(this.usuario.value);
    if(this.usuarioService.createUsuario(this.usuario.value)){
      this.presentAlert('¡Bienvenido a TravelSt!', 'Comienza tu aventura con nosotros', 'Tu cuenta ha sido creada exitosamente. Ya puedes empezar a explorar y planificar tu próximo viaje.');
      this.router.navigate(['/login']);
    }else{
      this.presentAlert('Error', '', 'No se pudo crear el usuario.');
    }
  }

  async presentAlert(header: string, subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: ['Aceptar'],
    });

    await alert.present();
  }

  
  

 /* 
  public habilitar_boton():boolean{
    if (this.usuario.valid){
      return false;
    }
    return true;
  }
  */


  
}
