import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  //acá podemos crear variables:
    usuarios: any[] = [
      {
        "rut": "21638902-6",
        "nombre": "javier",
        "fechaNacimiento": "2004-08-01",
        "apellidos": "soto jaque",
        "genero": "Masculino",
        "email": "javier@duocuc.cl",
        "password": "administrador",
        "repeat_password": "12345678",
        "tiene_vehiculo" : "si",
        "nombre_modelo" : "nissan",
        "tipo_usuario" : "administrador"
      }
  ];





  constructor() { }

  //logica
  //DAO:
  public createUsuario(usuario:any):boolean{
    if (this.getUsuario(usuario.rut) == undefined){
      this.usuarios.push(usuario);
      return true;
    }
    return false;
  }

  public getUsuario(rut:string){
    return this.usuarios.find(elemento=> elemento.rut == rut);
  }

  public getUsuarios(){
    return this.usuarios
  }

  public updateUsuario(rut:string, nuevoUsuario:any){
    const indice = this.usuarios.findIndex(elemento => elemento.rut==rut);
    if(indice==-1){
      return false;
    }
    this.usuarios[indice] = nuevoUsuario;
    return true;
  }


  
  public deleteUsuario(rut:string):boolean{
    const indice = this.usuarios.findIndex(elemento => elemento.rut == rut);
    if (indice ==-1){
      return false;
    }
    this.usuarios.splice(indice,1);
    return true;
  }


}
