import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(public usuarioService: UsuarioService) {}

  ngOnInit() {
    const usuarioAutenticado = this.usuarioService.getUsuarioAutenticado();
    console.log('Usuario autenticado:', usuarioAutenticado);
  }

}