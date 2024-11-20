import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  url: string = 'https://mindicador.cl/api';
  url_digimon : string = 'https://digi-api.com/api/v1/digimon';

  constructor(private http: HttpClient) { }

  // Métodos
  getDolar(){
    return this.http.get(this.url);
  }

  getDigimons(){
    return this.http.get(this.url_digimon);
  }
  
  getDigimon(id:number){
    return this.http.get(this.url_digimon+"/"+id)
    
  }

}
