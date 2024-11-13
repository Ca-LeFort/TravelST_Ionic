import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FireService {

  constructor(private fireStore: AngularFirestore, 
              private fireAuth: AngularFireAuth) { }

  async crearUsuario(usuario: any){
    const docRef = this.fireStore.collection('usuarios').doc(usuario.rut);
    const docActual = await docRef.get().toPromise();
    if(docActual?.exists){
      return false;
    }

    const credencialesUsuario = await this.fireAuth.createUserWithEmailAndPassword(usuario.email, usuario.password);
    const uid = credencialesUsuario.user?.uid;

    await docRef.set( {...usuario, uid} );
    return true;
    //return this.fireStore.collection('usuarios').doc(usuario.rut).set(usuario);
  }

  async crearViaje(viaje: any){
    const docRef = this.fireStore.collection('viajes').doc(viaje.id);
    const docActual = await docRef.get().toPromise();
    if(docActual?.exists){
      return false;
    }

    await docRef.set( {...viaje} );
    return true;
  }

  getUsuarios(){
    return this.fireStore.collection('usuarios').valueChanges();
  }

  getViajes(){
    return this.fireStore.collection('viajes').valueChanges();
  }

  getUsuario(rut: string){
    return this.fireStore.collection('usuarios').doc(rut).valueChanges();
  }

  getViaje(id: string){
    return this.fireStore.collection('viajes').doc(id).valueChanges();
  }

  updateUsuario(usuario: any){
    return this.fireStore.collection('usuarios').doc(usuario.rut).update(usuario);
  }

  updateViaje(viaje: any){
    return this.fireStore.collection('viaje').doc(viaje.id).update(viaje);
  }

  deleteUsuario(rut: string){
    return this.fireStore.collection('usuarios').doc(rut).delete();
  }

  deleteViaje(id: string){
    return this.fireStore.collection('viajes').doc(id).delete();
  }
}
