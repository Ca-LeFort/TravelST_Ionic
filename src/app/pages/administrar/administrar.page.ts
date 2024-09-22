import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-administrar',
  templateUrl: './administrar.page.html',
  styleUrls: ['./administrar.page.scss'],
})
export class AdministrarPage implements OnInit {
  usuario = new FormGroup({
    rut : new FormControl('',[Validators.minLength(9),Validators.maxLength(10),Validators.required,Validators.pattern("[0-9]{7,8}-[0-9kK]{1}")]),
    nombre: new FormControl('',[Validators.minLength(3),Validators.required,Validators.pattern("[a-zA-Z ]{3,15}")]),
    fechaNacimiento : new FormControl('',[Validators.required]),
    apellidos : new FormControl('', [Validators.minLength(3), Validators.required, Validators.pattern("[a-zA-Z ]{3,25}")]),
    genero : new FormControl('',[Validators.required]),
    email : new FormControl('',[Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@duocuc\.cl$/),Validators.required]),
    password : new FormControl('',[Validators.minLength(8),Validators.required]),
    repeat_password : new FormControl('',[Validators.minLength(8),Validators.required]),
    tiene_vehiculo: new FormControl('si',[Validators.required]),
    nombre_modelo: new FormControl('',[]),
    tipo_usuario: new FormControl('estudiante', []), // Valor por defecto 
  });

  // Método para comprobar si las contraseñas coinciden
  isPasswordMismatch(): boolean {
    const password = this.usuario.get('password')?.value;
    const repeatPassword = this.usuario.get('repeat_password')?.value;
  
    // Asegúrate de que siempre devuelva un booleano
    return !!(password && repeatPassword && password !== repeatPassword);
  }

  usuarios:any[] = [];
  botonModificar: boolean = true;

  //el servicio nos permite trabajar la información:
  constructor(private usuarioService: UsuarioService,private alertController: AlertController) { }

  ngOnInit() {
    this.usuarios = this.usuarioService.getUsuarios();
  }

  async registrar() {
    // Validar que las contraseñas coincidan
    if (this.isPasswordMismatch()) {
      alert("ERROR! LAS CONTRASEÑAS NO COINCIDEN!");
      return;
    }
  
    // Intentar crear el usuario
    if (this.usuarioService.createUsuario(this.usuario.value)) {
      await this.presentAlert(
        'Operacion exitosa', 
        'Registrado', 
        'Usuario registrado con exito'
      );
      this.usuario.reset();
    } else {
      await this.presentAlert(
        'Operacion fallida', 
        'No ha sido registrado', 
        'Ha ocurrido un problema, revisa los datos ingresados.'
      );
    }
  }

  buscar(rut_buscar:string){
    this.usuario.setValue( this.usuarioService.getUsuario(rut_buscar) );
    this.botonModificar = false;
  }

  async modificar() {
    // Validar que las contraseñas coincidan
    if (this.isPasswordMismatch()) {
      await this.presentAlert(
        'Operacion exitosa', 
        'Modificado', 
        'El usuario ha sido modificado con exito'
      );
      return;
    }
  
    var rut_buscar: string = this.usuario.controls.rut.value || "";
    if (this.usuarioService.updateUsuario(rut_buscar, this.usuario.value)) {
      alert("USUARIO MODIFICADO CON ÉXITO!");
      this.botonModificar = true;
      this.usuario.reset();
    } else {
      alert("ERROR! USUARIO NO MODIFICADO!");
    }
  }

  eliminar(rut_eliminar:string){
    //console.log(rut_eliminar);
    if( this.usuarioService.deleteUsuario(rut_eliminar) ){
      alert("USUARIO ELIMINADO CON ÉXITO!")
    }else{
      alert("ERROR! USUARIO NO ELIMINADO!")
    }
  }


  /*Alerta*/
  async presentAlert(header: string, subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header: header,       // Título de la alerta
      subHeader: subHeader, // Subtítulo de la alerta
      message: message,     // Mensaje de la alerta
      buttons: ['OK']       // Botones de la alerta (puedes reemplazar 'OK' por this.alertButtons si lo prefieres)
    });
  
    await alert.present();
  }

  /*Alerta de modificar*/
  
}