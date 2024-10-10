import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  // Vamos a crear una variable que almacenara la informacion del localstorage
  usuario: any;

  constructor(public usuarioService: UsuarioService, private navController: NavController) {}

  ngOnInit() {
    this.usuario = JSON.parse(localStorage.getItem("usuario") || '');
  }

  logout() {
    localStorage.removeItem('usuario');
    this.navController.navigateRoot('/login');
  }

}