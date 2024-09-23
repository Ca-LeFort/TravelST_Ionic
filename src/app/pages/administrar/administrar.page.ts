import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
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
    apellidos : new FormControl('', [Validators.minLength(3), Validators.required, Validators.pattern("[a-zA-Z ]{3,25}")]),
    fechaNacimiento : new FormControl('',[Validators.required]),
    genero : new FormControl('',[Validators.required]),
    email : new FormControl('',[Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@duocuc\.cl$/),Validators.required]),
    password : new FormControl('',[Validators.minLength(8),Validators.required]),
    repeat_password : new FormControl('',[Validators.minLength(8),Validators.required]),
    tiene_vehiculo: new FormControl('si',[Validators.required]),
    nombre_modelo: new FormControl('',[this.MarcaAuto.bind(this)]),
    capacidad: new FormControl('',[]),
    tipo_usuario: new FormControl('estudiante', []), // Valor por defecto 
  });

  

  usuarios:any[] = [];
  botonModificar: boolean = true;

  
  //el servicio nos permite trabajar la información:
  constructor(private usuarioService: UsuarioService,private alertController: AlertController) { }

  //Lista de marcas
  marcasAuto: string[] = [
    'abarth', 'acura', 'alfa romeo', 'audi', 'bmw', 'bentley', 'buick', 'cadillac', 
    'chevrolet', 'citroën', 'dodge', 'fiat', 'ford', 'genesis', 'honda', 'hyundai', 
    'infiniti', 'jaguar', 'jeep', 'kia', 'lamborghini', 'land rover', 'lexus', 
    'lincoln', 'maserati', 'mazda', 'mclaren', 'mercedes benz', 'mini', 'mitsubishi', 
    'nissan', 'pagani', 'peugeot', 'porsche', 'ram', 'renault', 'rolls royce', 
    'saab', 'seat', 'skoda', 'smart', 'subaru', 'suzuki', 'tesla', 'toyota', 
    'volkswagen', 'volvo', 'byd', 'jac', 'changan', 'great wall', 'geely', 
    'haval', 'mg', 'brilliance', 'foton', 'lynk & co', 'dongfeng', 'xpeng', 
    'nio', 'ora', 'rivian', 'polestar', 'karma', 'landwind', 'zotye', 
    'wuling', 'baojun', 'gac', 'hummer', 'chrysler', 'daihatsu', 
    'ferrari', 'gmc', 'isuzu', 'lotus', 'morris', 'noble', 
    'pininfarina', 'ram', 'shelby', 'ssangyong', 'zenvo', 'chana', 
    'daewoo', 'perodua', 'suzuki', 'mahindra', 'maruti suzuki', 
    'rally', 'morgan', 'tvr', 'viper', 'wiesmann', 'mercury', 
    'oldsmobile', 'packard', 'tucker', 'scion', 'saturn', 
    'lancia', 'alpine', 'ferrari', 'koenigsegg'
];


  ngOnInit() {
    this.usuarios = this.usuarioService.getUsuarios();
  }


  //Marca Auto
  MarcaAuto(control: AbstractControl) {
    const marca = control.value ? control.value.toLowerCase() : '';
    if (marca && !this.marcasAuto.includes(marca)) {
      return { marcaNoExiste: true };
    }
    return null;
  }

  
  // Método para comprobar si las contraseñas coinciden
  isPasswordMismatch(): boolean {
    const password = this.usuario.get('password')?.value;
    const repeatPassword = this.usuario.get('repeat_password')?.value;
  
    // Asegúrate de que siempre devuelva un booleano
    return !!(password && repeatPassword && password !== repeatPassword);
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
    const alert = await this.alertController.create({
      header: 'Confirmar modificación',
      message: '¿Estás seguro de que deseas modificar este usuario?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Modificación cancelada');
          }
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: async () => {
            if (!this.isPasswordMismatch()) {
              const rut_buscar: string = this.usuario.controls.rut.value || "";
              if (this.usuarioService.updateUsuario(rut_buscar, this.usuario.value)) {
                await this.presentAlert('Éxito', 'Usuario modificado', 'USUARIO MODIFICADO CON ÉXITO!');
                this.botonModificar = true;
                this.usuario.reset();
              } else {
                await this.presentAlert('Error', 'No se pudo modificar', 'ERROR! USUARIO NO MODIFICADO!');
              }
            } else {
              await this.presentAlert('Error', 'Contraseñas no coinciden', 'ERROR! LAS CONTRASEÑAS NO COINCIDEN!');
            }
          }
        }
      ]
    });

    await alert.present();
  }



  async eliminar(rut_eliminar: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar este usuario?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Eliminación cancelada');
          }
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: async () => {
            if (this.usuarioService.deleteUsuario(rut_eliminar)) {
              await this.presentAlert('Éxito', 'Usuario eliminado', 'USUARIO ELIMINADO CON ÉXITO!');
            } else {
              await this.presentAlert('Error', 'No se pudo eliminar', 'ERROR! USUARIO NO ELIMINADO!');
            }
          }
        }
      ]
    });

    await alert.present();
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