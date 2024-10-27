import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ViajeService } from 'src/app/services/viaje.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  usuario: any;
  selectedImage: string | ArrayBuffer | null = null;
  isEditing = false;
  fechaInvalida: boolean = false;
  capacidadInvalida: boolean = false; // Añadir esto si no lo has hecho
  patenteInvalida: boolean = false; // Añadir esto si no lo has hecho
  marcaInvalida: boolean = false; // Declarar esta propiedad
  historial: any[] = [];

  constructor(public usuarioService: UsuarioService, private navController: NavController,
    public viajeService: ViajeService,private alertController: AlertController) { }

  ngOnInit() {
    this.usuario = JSON.parse(localStorage.getItem("usuario") || '');
    this.selectedImage = this.usuario?.image || null;
    this.mostrarHistorial(); // Carga el historial al iniciar
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        this.selectedImage = reader.result;
        this.usuario.image = this.selectedImage;
        localStorage.setItem("usuario", JSON.stringify(this.usuario));
      };

      reader.readAsDataURL(file);
    }
  }

  editProfile() {
    this.isEditing = true;
  }

  async saveProfile() {
    const rut = this.usuario.rut;
    const resultado = await this.usuarioService.updateUsuario(rut, this.usuario);

    if (resultado) {
      this.isEditing = false;
    } else {
      console.error('No se pudo actualizar el usuario.');
    }
  }

  logout() {
    localStorage.removeItem('usuario');
    this.navController.navigateRoot('/login');
  }

  fechaNacimientoValidator() {
    const fechaNacimiento = new Date(this.usuario.fechaNacimiento);
    if (!this.usuario.fechaNacimiento) {
      this.fechaInvalida = false;
      return;
    }

    let edad = new Date().getFullYear() - fechaNacimiento.getFullYear();
    const mes = new Date().getMonth() - fechaNacimiento.getMonth();

    if (mes < 0 || (mes === 0 && new Date().getDate() < fechaNacimiento.getDate())) {
      edad--;
    }

    this.fechaInvalida = edad < 17;
  }

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

  validarPatente(patente: string): boolean {
    const regex = /^[A-Z]{2}-[A-Z]{2}-[0-9]{2}$/;
    return !regex.test(patente.toUpperCase()); // true si es inválido
  }

  // Validación de capacidad
  capacidadValidator(capacidad: number): boolean {
    if (capacidad === 0 || capacidad < 1 || capacidad > 15) {
      return false; 
    }
    return true; 
  }

  MarcaAuto(marca: string): boolean {
    const marcaLower = marca ? marca.toLowerCase() : '';
    return !marcaLower || !this.marcasAuto.includes(marcaLower); // true si la marca no existe o es vacía
  }
  

  async mostrarHistorial() {
    this.historial = await this.viajeService.cargarHistorial(this.usuario.rut);
    if (this.historial.length === 0) {
      await this.presentAlert('Sin historial', 'No tienes viajes registrados.');
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['Cerrar'],
    });
    await alert.present();
  }
  
}
