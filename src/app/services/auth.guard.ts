import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const navController = inject(NavController);
  
  
  const auth = getAuth();
  return new Observable<boolean>((observer) =>{
    // Escucha el cambio de estado de autenticación
    onAuthStateChanged(auth, (user) => {
      if (!user){
         // Si no está autenticado, redirige al login
         if (state.url !== '/login'){
          navController.navigateRoot('/login');
         }
         observer.next(false);  // Bloquea el acceso
         observer.complete();
      }else{
        observer.next(true);  // Permite el acceso si está autenticado
        observer.complete();
      }
    })
  })
  
  /*
  const isAuthenticated = localStorage.getItem("usuario") ? true : false;
  
  // Vamos a validar si el usuario NO está logueado y accede a una página distinta a HOME:
  if(!isAuthenticated && state.url !== '/login'){
    navController.navigateRoot('/login');
    return false;
  }

  return true;
  */ 
};

