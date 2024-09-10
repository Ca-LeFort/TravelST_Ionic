import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  // Variables:
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

  /*Boton*/
  alertButtons = ['Aceptar'];


  constructor(private router : Router) { }

  ngOnInit() {
  }


   //podemos crear métodos:
   public registrar():void{
    //validaciones? llamar un DAO? conversión?
    console.log(this.usuario.value);
    //alert("registrado!");
    this.router.navigate(['/login']);
  }

 /* 
  public habilitar_boton():boolean{
    if (this.usuario.valid){
      return false;
    }
    return true;
  }
  */


  
}
