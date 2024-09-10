import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
    genero : new FormControl('',[Validators.required]),
    usuario : new FormControl('',[Validators.minLength(3),Validators.required]),
    email : new FormControl('',[Validators.email,Validators.required]),
    password : new FormControl('',[Validators.minLength(8),Validators.required]),
    tiene_vehiculo: new FormControl('no',[Validators.required]),
    nombre_modelo: new FormControl('',[])
  });
  usuarios:any[] = [];

  //el servicio nos permite trabajar la información:
  constructor(private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.usuarios = this.usuarioService.getUsuarios();
  }

  registrar(){
    if( this.usuarioService.createUsuario(this.usuario.value) ){
      alert("USUARIO CREADO CON ÉXITO!");
      this.usuario.reset();
    }else{
      alert("ERROR! NO SE PUDO CREAR EL USUARIO!");
    }
  }

  buscar(rut_buscar:string){
    this.usuario.setValue( this.usuarioService.getUsuario(rut_buscar) );
  }

  modificar(){
    var rut_buscar: string = this.usuario.controls.rut.value || "";
    if(this.usuarioService.updateUsuario( rut_buscar , this.usuario.value)){
      alert("USUARIO MODIFICADO CON ÉXITO!");
    }else{
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

}