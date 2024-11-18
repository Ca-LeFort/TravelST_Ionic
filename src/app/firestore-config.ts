import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { environment } from '../environments/environment'; // Ajusta esta ruta según tu estructura

// Inicializar la app de Firebase usando la configuración en environment.ts
const firebaseApp = initializeApp(environment.firebaseConfig);

// Exportar instancias reutilizables de Firebase
export const auth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);
