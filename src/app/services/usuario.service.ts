import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  usuarios: any[] = [];
  private usuariosAutenticados: any = null;  

  //y en el constructor se crea una variable del módulo:
  constructor(private storage: Storage) { 
    //this.init();
  }
  /*
  async init() {
    await this.storage.create();
    let admin = {
      "rut": "21638902-6",
      "nombre": "javier",
      "fechaNacimiento": "2004-08-01",
      "apellidos": "soto jaque",
      "genero": "Masculino",
      "email": "javier@duocuc.cl",
      "password": "administrador",
      "repeat_password": "administrador",
      "tiene_vehiculo": "si",
      "nombre_marca": "ferrari",
      "capacidad": 2,
      "nombre_modelo": "Mauil",
      "patente": "CC-BB-12",
      "tipo_usuario": "administrador"
    };
    await this.createUsuario(admin);
  }
  */

  // DAO methods using local storage

  public async createUsuario(usuario: any): Promise<boolean> {
    let usuarios: any[] = await this.storage.get("usuarios") || [];
    if (usuarios.find(usu => usu.rut === usuario.rut) !== undefined) {
      return false;
    }
    usuarios.push(usuario);
    await this.storage.set("usuarios", usuarios);
    return true;
  }

  public async getUsuario(rut: string): Promise<any> {
    let usuarios: any[] = await this.storage.get("usuarios") || [];
    return usuarios.find(usu => usu.rut === rut);
  }

  public async getUsuarios(): Promise<any[]> {
    let usuarios: any[] = await this.storage.get("usuarios") || [];
    return usuarios;
  }

  public async updateUsuario(rut: string, nuevoUsuario: any): Promise<boolean> {
    let usuarios: any[] = await this.storage.get("usuarios") || [];
    let indice: number = usuarios.findIndex(usu => usu.rut === rut);
    if (indice === -1) {
      return false;
    }
    usuarios[indice] = nuevoUsuario;
    await this.storage.set("usuarios", usuarios);
    return true;
  }

  public async deleteUsuario(rut: string): Promise<boolean> {
    let usuarios: any[] = await this.storage.get("usuarios") || [];
    let indice: number = usuarios.findIndex(usu => usu.rut === rut);
    if (indice === -1) {
      return false;
    }
    usuarios.splice(indice, 1);
    await this.storage.set("usuarios", usuarios);
    return true;
  }

  

  public async authenticate(email: string, password: string): Promise<boolean> {
    let usuarios: any[] = await this.storage.get("usuarios") || [];
    const usuario = usuarios.find(user => user.email === email && user.password === password);
    if (usuario) {
      localStorage.setItem("usuario", JSON.stringify(usuario) );
      this.usuariosAutenticados = usuario;
      return true;
    }
    return false;
  }

  public getUsuarioAutenticado() {
    return this.usuariosAutenticados;
  }

}
