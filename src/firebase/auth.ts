import {
  GoogleAuthProvider,
  signInWithCredential,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth } from './config';

/**
 * Inicia sesión con Google usando chrome.identity API
 * Esta función usa chrome.identity.getAuthToken() que funciona específicamente en extensiones
 */
export async function signInWithGoogle(): Promise<User> {
  return new Promise((resolve, reject) => {
    // Obtener token de Google usando chrome.identity (específico para extensiones)
    chrome.identity.getAuthToken({ interactive: true }, async (token) => {
      if (chrome.runtime.lastError || !token) {
        console.error('Error obteniendo token:', chrome.runtime.lastError);
        reject(chrome.runtime.lastError || new Error('No se pudo obtener el token'));
        return;
      }

      try {
        // Crear credencial de Google con el access token
        const credential = GoogleAuthProvider.credential(null, token);

        // Iniciar sesión en Firebase con la credencial
        const result = await signInWithCredential(auth, credential);

        console.log('Usuario autenticado:', result.user.displayName);
        resolve(result.user);
      } catch (error) {
        console.error('Error en signInWithCredential:', error);

        // Si falla, remover el token en caché e intentar de nuevo
        chrome.identity.removeCachedAuthToken({ token }, () => {
          console.log('Token removido del caché');
        });

        reject(error);
      }
    });
  });
}

/**
 * Cierra sesión del usuario
 * Limpia tanto la sesión de Firebase como el token de chrome.identity
 */
export async function signOut(): Promise<void> {
  try {
    // Primero cerrar sesión en Firebase
    await firebaseSignOut(auth);

    // Luego limpiar el token de chrome.identity
    chrome.identity.getAuthToken({ interactive: false }, (token) => {
      if (token) {
        chrome.identity.removeCachedAuthToken({ token }, () => {
          console.log('Token de Google removido');
        });
      }
    });

    console.log('Sesión cerrada correctamente');
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    throw error;
  }
}

/**
 * Escucha cambios en el estado de autenticación
 * @param callback Función que se llama cuando cambia el estado del usuario
 * @returns Función para cancelar la suscripción
 */
export function onAuthStateChanged(callback: (user: User | null) => void): () => void {
  return firebaseOnAuthStateChanged(auth, callback);
}

/**
 * Obtiene el usuario actual
 * @returns El usuario actual o null si no está autenticado
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

/**
 * Refresca el token de autenticación
 * Útil cuando el token expira
 */
export async function refreshAuthToken(): Promise<string | null> {
  return new Promise((resolve) => {
    chrome.identity.getAuthToken({ interactive: false }, (token) => {
      if (chrome.runtime.lastError || !token) {
        console.warn('No se pudo refrescar el token:', chrome.runtime.lastError);
        resolve(null);
        return;
      }

      // Remover token viejo y obtener uno nuevo
      chrome.identity.removeCachedAuthToken({ token }, () => {
        chrome.identity.getAuthToken({ interactive: false }, (newToken) => {
          resolve(newToken || null);
        });
      });
    });
  });
}
