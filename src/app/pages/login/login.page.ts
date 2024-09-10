import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  
    //aquí podemos crear variables, constrantes, listas, arreglos, json, etc:
  //NOMBRE_VARIABLE: TIPO_DATO = VALOR;
  titulo: string = "PÁGINA DE LOGIN";
  numero: number = 5;
  decimal: number = 5.2;
  existe: boolean = true;
  fecha_hoy: Date = new Date();
  nombres: string[] = ["Pedro","Juan","Diego"];
  persona: any = {"nombre":"Jeison", "edad": 5};

  //NgModel:
  email: string = "";
  password: string = "";

  constructor(private router: Router) { }

  ngOnInit() {
  }

  //método asociado al boton para hacer un login:
  login(){
    if(this.email=="pavel@gmail.com" && this.password=="Jiulliet"){
      this.router.navigate(['/home']);
    }else{
      alert("CORREO O CONTRASEÑA INCORRECTOS!");
    }
  }
}
