import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './config';
import type { ShortcutConfig } from '../storage/types';

// Interfaces para los datos en Firestore
interface FirestoreConfig extends Omit<ShortcutConfig, 'lastModified'> {
  lastModified: Timestamp;
}

/**
 * Carga la configuración del usuario desde Firestore
 * @param userId - ID del usuario autenticado
 * @returns La configuración del usuario o null si no existe
 */
export async function loadUserConfig(userId: string): Promise<ShortcutConfig | null> {
  try {
    console.log(`📥 [FIRESTORE] Cargando config para usuario: ${userId}`);

    const docRef = doc(db, 'users', userId, 'data', 'config');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as FirestoreConfig;

      // Verificar que lastModified existe y es un Timestamp válido
      if (!data.lastModified) {
        console.log('⚠️ [FIRESTORE] lastModified pendiente, esperando servidor');
        return null;
      }

      // Convertir Timestamp a number para compatibilidad
      const config: ShortcutConfig = {
        ...data,
        lastModified: data.lastModified.toMillis(),
      };

      console.log(`✅ [FIRESTORE] Config cargada: ${config.sections.length} secciones`);
      return config;
    } else {
      console.log('⚠️ [FIRESTORE] No existe config para este usuario');
      return null;
    }
  } catch (error) {
    console.error('❌ [FIRESTORE] Error cargando config:', error);
    throw error;
  }
}

/**
 * Guarda la configuración del usuario en Firestore
 * @param userId - ID del usuario autenticado
 * @param config - Configuración a guardar
 */
export async function saveUserConfig(userId: string, config: ShortcutConfig): Promise<void> {
  try {
    console.log(`💾 [FIRESTORE] Guardando config para usuario: ${userId}`);
    console.log(`📊 [FIRESTORE] Secciones: ${config.sections.length}`);

    const docRef = doc(db, 'users', userId, 'data', 'config');

    // Preparar datos para Firestore (usar serverTimestamp)
    const firestoreData: Omit<FirestoreConfig, 'lastModified'> & { lastModified: any } = {
      sections: config.sections,
      version: config.version,
      lastModified: serverTimestamp(),
    };

    await setDoc(docRef, firestoreData);

    console.log('✅ [FIRESTORE] Config guardada exitosamente');
  } catch (error) {
    console.error('❌ [FIRESTORE] Error guardando config:', error);
    throw error;
  }
}

/**
 * Suscribirse a cambios en tiempo real de la configuración
 * Útil para sincronizar entre múltiples tabs/dispositivos
 *
 * @param userId - ID del usuario autenticado
 * @param callback - Función que se llama cuando hay cambios
 * @returns Función para cancelar la suscripción
 */
export function subscribeToConfigChanges(
  userId: string,
  callback: (config: ShortcutConfig | null) => void
): Unsubscribe {
  console.log(`👂 [FIRESTORE] Suscribiéndose a cambios para usuario: ${userId}`);

  const docRef = doc(db, 'users', userId, 'data', 'config');

  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as FirestoreConfig;

        // Verificar que lastModified existe y es un Timestamp válido
        if (!data.lastModified) {
          console.log('⚠️ [FIRESTORE] lastModified pendiente en snapshot, ignorando');
          return; // No llamar callback aún, esperar siguiente update
        }

        // Convertir Timestamp a number
        const config: ShortcutConfig = {
          ...data,
          lastModified: data.lastModified.toMillis(),
        };

        console.log('🔄 [FIRESTORE] Config actualizada desde el servidor');
        callback(config);
      } else {
        console.log('⚠️ [FIRESTORE] Documento eliminado');
        callback(null);
      }
    },
    (error) => {
      console.error('❌ [FIRESTORE] Error en suscripción:', error);
      // En caso de error, notificar con null
      callback(null);
    }
  );
}

/**
 * Guarda el perfil del usuario (email, nombre, etc.)
 * @param userId - ID del usuario autenticado
 * @param profile - Datos del perfil
 */
export async function saveUserProfile(
  userId: string,
  profile: {
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
  }
): Promise<void> {
  try {
    console.log(`💾 [FIRESTORE] Guardando perfil para: ${userId}`);

    const docRef = doc(db, 'users', userId, 'data', 'profile');

    await setDoc(docRef, {
      ...profile,
      lastLogin: serverTimestamp(),
    });

    console.log('✅ [FIRESTORE] Perfil guardado');
  } catch (error) {
    console.error('❌ [FIRESTORE] Error guardando perfil:', error);
    // No lanzar error, el perfil no es crítico
  }
}

/**
 * Verifica si existe una configuración VÁLIDA en Firestore para el usuario
 * @param userId - ID del usuario autenticado
 * @returns true si existe config válida, false si no
 */
export async function hasUserConfig(userId: string): Promise<boolean> {
  try {
    const docRef = doc(db, 'users', userId, 'data', 'config');
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return false;
    }

    // Verificar que tenga lastModified válido (no null por serverTimestamp pendiente)
    const data = docSnap.data() as FirestoreConfig;
    if (!data.lastModified) {
      console.log('⏳ [FIRESTORE] Config existe pero lastModified pendiente');
      return false;
    }

    return true;
  } catch (error) {
    console.error('❌ [FIRESTORE] Error verificando config:', error);
    return false;
  }
}
