import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FireService } from 'src/app/services/fire.service';
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
    fechaNacimiento: new FormControl('', [Validators.required, this.fechaNacimientoValidator()]),
    genero : new FormControl('',[Validators.required]),
    email : new FormControl('',[Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@duocuc\.cl$/),Validators.required]),
    password :  new FormControl('',[Validators.required, Validators.pattern("^(?=.*[-!#$%&/()?¡_.])(?=.*[A-Za-z])(?=.*[a-z]).{8,}$")]),
    repeat_password :  new FormControl('',[Validators.required, Validators.pattern("^(?=.*[-!#$%&/()?¡_.])(?=.*[A-Za-z])(?=.*[a-z]).{8,}$")]),
    tiene_vehiculo: new FormControl('no',[Validators.required]),
    nombre_marca: new FormControl('',[this.MarcaAuto.bind(this)]),
    capacidad: new FormControl('', [this.capacidadValidator.bind(this)]),
    nombre_modelo: new FormControl('',[]),
    patente: new FormControl('', [this.validarPatente.bind(this)]),
    // Campo oculto que indica el tipo de usuario
    tipo_usuario: new FormControl('estudiante', []), // Valor por defecto 'normal'
  });


  // Método para validar la patente chilena
  validarPatente(control: AbstractControl): { [key: string]: boolean } | null {
    const patente = control.value;
    const regex = /^[A-Z]{2}-[A-Z]{2}-[0-9]{2}$/; // Formato BB-CC·12
    if (patente && !regex.test(patente.toUpperCase())) {
      return { formatoInvalido: true };
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
  
  /*Boton*/
  alertButtons = ['Aceptar'];

  constructor(private router : Router, 
    private usuarioService: UsuarioService,
    private alertController: AlertController,
    private fireService: FireService) { 
      this.usuario.get("rut")?.setValidators([Validators.required,Validators.pattern("[0-9]{7,8}-[0-9kK]{1}"),this.validarRut()]);  
  }

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
    // Observa el valor de 'tiene_vehiculo' para agregar validaciones dinámicas
    this.usuario.get('tiene_vehiculo')?.valueChanges.subscribe(value => {
    if (value === 'si') {
      // Agregar validadores cuando el usuario tiene un vehículo
      this.usuario.get('nombre_marca')?.setValidators([Validators.required, this.MarcaAuto.bind(this)]);
      this.usuario.get('capacidad')?.setValidators([Validators.required, this.capacidadValidator.bind(this)]);
      this.usuario.get('nombre_modelo')?.setValidators([Validators.required,Validators.minLength(3)]);
      this.usuario.get('patente')?.setValidators([Validators.required, this.validarPatente.bind(this)]);
    } else {
      // Eliminar validadores si el usuario no tiene vehículo
      this.usuario.get('nombre_marca')?.clearValidators();
      this.usuario.get('capacidad')?.clearValidators();
      this.usuario.get('nombre_modelo')?.clearValidators();
      this.usuario.get('patente')?.clearValidators();
    }
    // Refrescar las validaciones
    this.usuario.get('nombre_marca')?.updateValueAndValidity();
    this.usuario.get('capacidad')?.updateValueAndValidity();
    this.usuario.get('nombre_modelo')?.updateValueAndValidity();
    this.usuario.get('patente')?.updateValueAndValidity();
  });
  }

  //Validador de fecha
  fechaNacimientoValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const fechaNacimiento = control.value;
      if (!fechaNacimiento) {
        return null; // No validar si no hay fecha
      }
  
      const fecha = new Date(fechaNacimiento);
      let edad = new Date().getFullYear() - fecha.getFullYear();
      const mes = new Date().getMonth() - fecha.getMonth();
  
      if (mes < 0 || (mes === 0 && new Date().getDate() < fecha.getDate())) {
        edad--;
      }
  
      if (edad < 17) {
        return { menorDeEdad: true }; // Retorna error si es menor de 17 años
      }
      return null; // No hay error
    };
  }

  // Validador personalizado para la capacidad
capacidadValidator(control: AbstractControl) {
  const capacidad = control.value;

  if (capacidad === 0){
    return { capacidadInvalida: true };
  }
  // Si el campo está vacío, no considerarlo inválido
  if (!capacidad) {
    return null;
  }

  // Verificar si la capacidad es válida
  if (capacidad <= 0 || capacidad > 15) {
    return { capacidadInvalida: true };
  }
  return null;
}

  //Marca Auto
  MarcaAuto(control: AbstractControl) {
    const marca = control.value ? control.value.toLowerCase() : '';
    if (marca && !this.marcasAuto.includes(marca)) {
      return { marcaNoExiste: true };
    }
    return null;
  }

  //Validar rut
  validarRut():ValidatorFn{
    return () => {
      const rut = this.usuario.controls.rut.value;
      const dv_validar = rut?.replace("-","").split("").splice(-1).reverse()[0];
      let rut_limpio = [];
      if(rut?.length==10){
        rut_limpio = rut?.replace("-","").split("").splice(0,8).reverse();
      }else{
        rut_limpio = rut?.replace("-","").split("").splice(0,7).reverse() || [];
      }
      let factor = 2;
      let total = 0;
      for(let num of rut_limpio){
        total = total + ((+num)*factor);
        factor = factor + 1;
        if(factor==8){
          factor = 2;
        }
      }
      var dv = (11-(total%11)).toString();
      if(+dv>=10){
        dv = "k";
      }
      if(dv_validar!=dv.toString()) return {isValid: false};
      return null;
    };
  }


  public async registrar(){
    // Validar que las contraseñas coincidan
    if (this.isPasswordMismatch()) {
      // Mostrar un mensaje de error, por ejemplo, usando un alert o un toast
      console.error('Las contraseñas no coinciden.');
      return;
    }
  
    // Aquí puedes agregar lógica adicional, como llamar a un DAO o API para registrar al usuario
    //console.log(this.usuario.value);
    if(await this.usuarioService.createUsuario(this.usuario.value) && await this.fireService.crearUsuario(this.usuario.value)){
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
