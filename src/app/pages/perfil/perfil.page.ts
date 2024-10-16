import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  usuario: any;
  selectedImage: string | ArrayBuffer | null = null;

  constructor(public usuarioService: UsuarioService, private navController: NavController) { }

  ngOnInit() {
    this.usuario = JSON.parse(localStorage.getItem("usuario") || '');
    this.selectedImage = this.usuario?.image || null; // Cargar la imagen guardada si existe
  }

  onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;

  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      this.selectedImage = reader.result; // Guardar la imagen para mostrarla
      this.usuario.image = this.selectedImage; // Guardar la imagen en el objeto usuario
      localStorage.setItem("usuario", JSON.stringify(this.usuario)); // Guardar en localStorage
    };

    reader.readAsDataURL(file);
  }
}

  
  logout() {
    localStorage.removeItem('usuario');
    this.navController.navigateRoot('/login');
  }

}
