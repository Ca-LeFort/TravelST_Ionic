import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class ViajeService {
  viajes: any[] = [];

  constructor(private storage: Storage) { 
    this.init();
  }

  init() {
    this.storage.create();
  }

  //Historial
  async guardarHistorial(usuarioId: string, historial: any[]) {
    const datos = await this.cargarDatosUsuarios();
    datos[usuarioId] = { historial }; // Almacena el historial bajo la clave del ID del usuario
    await this.storage.set('datosUsuarios', datos);
    }

    async cargarHistorial(usuarioId: string) {
        const datos = await this.cargarDatosUsuarios();
        return datos[usuarioId]?.historial || []; // Retorna el historial del usuario
    }

    private async cargarDatosUsuarios() {
        return (await this.storage.get('datosUsuarios')) || {};
    }



  //Viaje
  public async createViaje(viaje: any): Promise<boolean>{
    let viajes: any[] = await this.storage.get("viajes") || [];
    if(viajes.find(v => v.id == viaje.id) != undefined){
      return false;
    }
    viajes.push(viaje);
    await this.storage.set("viajes", viajes);
    return true;
  }

  public async getViaje(id: number): Promise<any>{
    let viajes: any[] = await this.storage.get("viajes") || [];
    return viajes.find(v => v.id === id);
  }

  public async getViajes(): Promise<any[]>{
    let viajes: any[] = await this.storage.get("viajes") || [];
    return viajes;
  }

  public async updateViaje(id: string, nuevoViaje: any): Promise<boolean>{
    let viajes: any[] = await this.storage.get("viajes") || [];
    let indice: number = viajes.findIndex(v => v.id === id);
    if(indice === -1){
      return false;
    }
    viajes[indice] = nuevoViaje;
    await this.storage.set("viajes", viajes);
    return true;
  }

  public async deleteViaje(id: number): Promise<boolean> {
    let viajes: any[] = await this.storage.get("viajes") || [];
    let indice: number = viajes.findIndex(v => v.id === id);
    if(indice === -1){
      return false;
    }
    viajes.splice(indice, 1);
    await this.storage.set("viajes", viajes);
    return true;
  }

  public async getNextId(): Promise<number> {
    let viajes: any[] = await this.storage.get("viajes") || [];
    if(viajes.length === 0){
      return 1; // Si no hay viajes, comienza desde 1
    }
    let maxId = Math.max(...viajes.map(v => v.id));
    return maxId + 1;
  }

}
