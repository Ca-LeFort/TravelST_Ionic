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

}
