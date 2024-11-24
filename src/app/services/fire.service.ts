import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FireService {

  constructor(private fireStore: AngularFirestore, 
              private fireAuth: AngularFireAuth,) {this.init();}


  async init(){
    const admin = {
      rut: "21638902-6",
      nombre: "javier",
      fechaNacimiento: "2004-08-01",
      apellidos: "soto jaque",
      genero: "Masculino",
      email: "javier@duocuc.cl",
      password: "2468Pr..",
      repeat_password: "2468Pr..",
      tiene_vehiculo: "si",
      nombre_marca: "ferrari",
      capacidad: 2,
      nombre_modelo: "Mauil",
      patente: "CC-BB-12",
      tipo_usuario: "administrador"};
      await this.crearUsuario(admin);
  }

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

  async crearViaje(viaje: any) {
    if (!viaje.id) {
      console.error("El ID del viaje es requerido.");
      return false;
    }
  
    const docRef = this.fireStore.collection('viajes').doc(viaje.id.toString()); // Asegurarse de convertir a string
    const docActual = await docRef.get().toPromise();
  
    if(docActual && docActual.exists) {
      console.log('El viaje ya existe');
      return false;
    }
  
    // Si no existe el viaje, lo creamos
    await docRef.set({ ...viaje });
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

  getViaje(id: number){
    return this.fireStore.collection('viajes').doc(id.toString()).valueChanges();
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

  getUsuarioByUID(uid: string): Promise<any> {
    return this.fireStore.collection('usuarios', ref => ref.where('uid', '==', uid))
      .get()
      .toPromise()
      .then((snapshot) => {
        // Verifica si snapshot es válido y no está vacío
        if (snapshot && !snapshot.empty) {
          return snapshot.docs[0].data(); // Devuelve el primer documento encontrado
        }
        return null; // Si no encuentra documentos o snapshot es inválido
      })
      .catch((error) => {
        console.error('Error al obtener el usuario:', error);
        return null; // Maneja errores retornando null
      });
  }
  

  // Guardar el historial del usuario en Firestore
async guardarHistorial(usuarioId: string, historial: any[]) {
  const docRef = this.fireStore.collection('historiales').doc(usuarioId);
  
  // Obtener el documento y verificar si existe
  const docActual = await docRef.get().toPromise();
  if (docActual && docActual.exists) {
    // Si el historial ya existe, actualiza solo el campo historial
    await docRef.update({ historial });
  } else {
    // Si no existe, crea un nuevo documento con el historial
    await docRef.set({ historial });
  }
}

  // Cargar el historial del usuario desde Firestore
async cargarHistorial(usuarioId: string) {
  const docRef = this.fireStore.collection('historiales').doc(usuarioId);
  const doc = await docRef.get().toPromise();

  // Verificamos si el documento existe
  if (doc && doc.exists) {
    const data = doc.data() as { [key: string]: any };

    // Verificamos que 'historial' sea un array antes de devolverlo
    if (data && Array.isArray(data['historial'])) {
      return data['historial']; // Si 'historial' es un array, lo retornamos
    } else {
      return []; // Si 'historial' no es un array o no existe, retornamos un array vacío
    }
  } else {
    return []; // Si no existe el documento, retornamos un array vacío
  }
}

  // Método privado para cargar los datos de los usuarios desde Firestore
private async cargarDatosUsuarios() {
  const usuariosRef = this.fireStore.collection('usuarios');
  const snapshot = await usuariosRef.get().toPromise();

  // Verificar si snapshot es válido y no vacío
  if (!snapshot || snapshot.empty) {
    return {}; // Si la colección está vacía o snapshot es undefined, retorna un objeto vacío
  }

  let datosUsuarios: any = {};

  snapshot.forEach(doc => {
    datosUsuarios[doc.id] = doc.data(); // Guardamos los datos del usuario bajo su 'id' o 'rut'
  });

  return datosUsuarios; // Devuelve los datos de todos los usuarios
}
   

// Método para obtener el siguiente ID
public async getNextId(): Promise<number> {
  // Obtener todos los documentos de la colección 'viajes'
  const viajesRef = this.fireStore.collection('viajes');
  const snapshot = await viajesRef.get().toPromise();

  // Verificar si el snapshot es válido y no está vacío
  if (!snapshot || snapshot.empty) {
    return 1; // Si no hay viajes, comienza desde 1
  }

  let maxId = 0;

  snapshot.forEach(doc => {
    const viajeData = doc.data() as { id?: number }; // Aseguramos que 'viajeData' tiene la propiedad 'id' como número opcional

    // Verificar si 'id' es un número
    const id = viajeData?.id;

    if (typeof id === 'number') {
      maxId = Math.max(maxId, id); // Encontrar el ID más alto
    }
  });

  // Retornar el siguiente ID incrementado
  return maxId + 1;
}

}




