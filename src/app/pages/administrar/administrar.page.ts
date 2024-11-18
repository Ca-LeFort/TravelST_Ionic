import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { FireService } from 'src/app/services/fire.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ViajeService } from 'src/app/services/viaje.service';

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
    tipo_usuario: new FormControl('estudiante', []), // Valor por defecto 
    uid: new FormControl(''),
  });

  
  viaje = new FormGroup({
    id: new FormControl(),
    conductor: new FormControl('', [Validators.required]),
    asientos_disponibles: new FormControl('', [Validators.required]),
    destino: new FormControl('', [Validators.required]),
    latitud: new FormControl('', [Validators.required]),
    longitud: new FormControl('', [Validators.required]),
    distancia_metros: new FormControl('', [Validators.required]),
    tiempo_minutos: new FormControl('', [Validators.required]),
    precio: new FormControl(),
    estado_viaje: new FormControl('pendiente'),
    pasajeros: new FormControl([])
  });

  usuarios:any[] = [];
  viajes: any[] = [];
  botonModificar: boolean = true;

  
  //el servicio nos permite trabajar la información:
  constructor(private fireService : FireService,private usuarioService: UsuarioService,private alertController: AlertController, private viajeService: ViajeService) {
    this.usuario.get("rut")?.setValidators([Validators.required,Validators.pattern("[0-9]{7,8}-[0-9kK]{1}"),this.validarRut()]);
  }

  // Método para validar la patente chilena
  validarPatente(control: AbstractControl): { [key: string]: boolean } | null {
    const patente = control.value;
    const regex = /^[A-Z]{2}-[A-Z]{2}-[0-9]{2}$/; // Formato BB-CC·12
    if (patente && !regex.test(patente.toUpperCase())) {
      return { formatoInvalido: true };
    }
    return null;
  }

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


  async ngOnInit() {
    this.cargarUsuario();
    this.usuarios = await  this.usuarioService.getUsuarios();
    this.viajes = await this.viajeService.getViajes();
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

  
  // Método para comprobar si las contraseñas coinciden
  isPasswordMismatch(): boolean {
    const password = this.usuario.get('password')?.value;
    const repeatPassword = this.usuario.get('repeat_password')?.value;
  
    // Asegúrate de que siempre devuelva un booleano
    return !!(password && repeatPassword && password !== repeatPassword);
  }

 

  //CRUD USUARIOS

  cargarUsuario(){
    this.fireService.getUsuarios().subscribe(data=>{
      this.usuarios=data;
    });
  }


  //Registrar firebase
  async registrar() {
    if (this.isPasswordMismatch()) {
      alert("ERROR! LAS CONTRASEÑAS NO COINCIDEN!");
      return;
    }
  
    if (await this.fireService.crearUsuario(this.usuario.value)) {
      await this.presentAlert(
        'Operacion exitosa', 
        'Registrado', 
        'Usuario registrado con exito'
      );
      this.usuario.reset();
      //this.usuarios = await this.usuarioService.getUsuarios();
    } else {
      await this.presentAlert(
        'Operacion fallida', 
        'No ha sido registrado', 
        'Ha ocurrido un problema, revisa los datos ingresados.'
      );
    }
  }

  /*Buscar con Storage
  async buscar(rut_buscar:string){
    this.usuario.setValue( await this.usuarioService.getUsuario(rut_buscar) );
    this.botonModificar = false;
  }
  */

  //Buscar firebase 
  async buscar(usuarios: any){
    this.usuario.setValue(usuarios);
    this.botonModificar = false;
  }


  //Modificar firebase 
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
              
              // Llamada a Firebase para actualizar el usuario
              this.fireService.updateUsuario(this.usuario.value).then(async () => {
                // Mensaje de éxito
                await this.presentAlert('Éxito', 'Usuario modificado', 'USUARIO MODIFICADO CON ÉXITO!');
                
                // Restablece el formulario
                this.usuario.reset();
                this.botonModificar = true;
  
                //this.usuarios = await this.usuarioService.getUsuarios();
  
                /* Código antiguo comentado:
                if (await this.usuarioService.updateUsuario(rut_buscar, this.usuario.value)) {
                  await this.presentAlert('Éxito', 'Usuario modificado', 'USUARIO MODIFICADO CON ÉXITO!');
                  this.botonModificar = true;
                  this.usuario.reset();
                  this.usuarios = await this.usuarioService.getUsuarios();
                } else {
                  await this.presentAlert('Error', 'No se pudo modificar', 'ERROR! USUARIO NO MODIFICADO!');
                }
                */
              }).catch(async (error) => {
                // Mensaje de error en caso de falla
                await this.presentAlert('Error', 'No se pudo modificar', 'ERROR! USUARIO NO MODIFICADO!');
                console.error("Error al modificar el usuario:", error);
              });
            } else {
              await this.presentAlert('Error', 'Contraseñas no coinciden', 'ERROR! LAS CONTRASEÑAS NO COINCIDEN!');
            }
          }
        }
      ]
    });
  
    await alert.present();
  }
  

  //Eliminar firebase 
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
            // Llamada a Firebase para eliminar el usuario
            this.fireService.deleteUsuario(rut_eliminar).then(async () => {
              // Mensaje de éxito
              await this.presentAlert('Éxito', 'Usuario eliminado', 'USUARIO ELIMINADO CON ÉXITO!');
              
              //this.usuarios = await this.usuarioService.getUsuarios();
  
              /* Código antiguo comentado:
              if (await this.usuarioService.deleteUsuario(rut_eliminar)) {
                await this.presentAlert('Éxito', 'Usuario eliminado', 'USUARIO ELIMINADO CON ÉXITO!');
                this.usuarios = await this.usuarioService.getUsuarios();
              } else {
                await this.presentAlert('Error', 'No se pudo eliminar', 'ERROR! USUARIO NO ELIMINADO!');
              }
              */
            }).catch(async (error) => {
              // Mensaje de error en caso de falla
              await this.presentAlert('Error', 'No se pudo eliminar', 'ERROR! USUARIO NO ELIMINADO!');
              console.error("Error al eliminar el usuario:", error);
            });
          }
        }
      ]
    });
  
    await alert.present();
  }
  




  

  /*VIAJES*/
  async registrarViaje() {
    if (this.viaje.valid) {
      const nextId = await this.viajeService.getNextId();
      this.viaje.controls.id.setValue(nextId);

      const viaje = this.viaje.value;
      const registroViaje = await this.viajeService.createViaje(viaje);

      if (registroViaje) {
        await this.presentAlert('Bien', 'El viaje ha sido registrado con éxito!','VIAJE REGISTRADO');
        this.viaje.reset();
        console.log('Viaje registrado');
      } else {
        console.log('Formulario invalido');
        await this.presentAlert('Error', 'El Formulario del registro es inválido, complete los campos','VIAJE NO REGISTRADO');
      }
    }
  }

  //Buscar - Viajes
  async buscarViaje(id:number){
    this.viaje.setValue( await this.viajeService.getViaje(id) );
    this.botonModificar = false;
  }

  async eliminarViaje(id: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar este viaje?',
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
            if (await  this.viajeService.deleteViaje(id)) {
              await this.presentAlert('Éxito', 'Viaje eliminado', 'VIAJE ELIMINADO CON ÉXITO!');
              this.viajes = await this.viajeService.getViajes();
            } else {
              await this.presentAlert('Error', 'No se pudo eliminar', 'ERROR! VIAJE NO ELIMINADO!');
            }
          }
        }
      ]
    });

    await alert.present();
  }


  async listarViajes() {
    this.viajes = await this.viajeService.getViajes();
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
}