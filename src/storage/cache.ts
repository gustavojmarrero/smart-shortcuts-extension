import type { ShortcutConfig } from './types';

/**
 * Cache inteligente usando chrome.storage.local
 * - Más rápido que Firestore para lecturas frecuentes
 * - Reduce el uso de quota de Firestore (50K lecturas/día gratis)
 * - Funciona como fallback cuando está offline
 */

const CACHE_KEY = 'shortcutsConfig';
const CACHE_TIMESTAMP_KEY = 'shortcutsConfigTimestamp';

/**
 * Guarda la config en cache local
 */
export async function saveCacheConfig(config: ShortcutConfig): Promise<void> {
  try {
    await chrome.storage.local.set({
      [CACHE_KEY]: config,
      [CACHE_TIMESTAMP_KEY]: config.lastModified,
    });
    console.log('💾 [CACHE] Config guardada en cache local');
  } catch (error) {
    console.error('❌ [CACHE] Error guardando en cache:', error);
    // No lanzar error - el cache es opcional
  }
}

/**
 * Carga la config desde cache local
 */
export async function loadCacheConfig(): Promise<ShortcutConfig | null> {
  try {
    const result = await chrome.storage.local.get([CACHE_KEY, CACHE_TIMESTAMP_KEY]);

    if (result[CACHE_KEY]) {
      console.log('✅ [CACHE] Config cargada desde cache local');
      return result[CACHE_KEY] as ShortcutConfig;
    }

    console.log('⚠️ [CACHE] No hay config en cache');
    return null;
  } catch (error) {
    console.error('❌ [CACHE] Error cargando desde cache:', error);
    return null;
  }
}

/**
 * Verifica si el cache está actualizado comparando timestamps
 * @param firestoreTimestamp - lastModified de Firestore
 * @returns true si el cache está actualizado, false si necesita refresh
 */
export async function isCacheValid(firestoreTimestamp: number): Promise<boolean> {
  try {
    const result = await chrome.storage.local.get([CACHE_TIMESTAMP_KEY]);
    const cacheTimestamp = result[CACHE_TIMESTAMP_KEY] as number | undefined;

    if (!cacheTimestamp) {
      console.log('⚠️ [CACHE] No hay timestamp en cache');
      return false;
    }

    const isValid = cacheTimestamp >= firestoreTimestamp;

    if (isValid) {
      console.log('✅ [CACHE] Cache válido, usando cache local');
    } else {
      console.log('🔄 [CACHE] Cache desactualizado, refrescando desde Firestore');
    }

    return isValid;
  } catch (error) {
    console.error('❌ [CACHE] Error verificando cache:', error);
    return false;
  }
}

/**
 * Limpia el cache (útil al hacer logout)
 */
export async function clearCache(): Promise<void> {
  try {
    await chrome.storage.local.remove([CACHE_KEY, CACHE_TIMESTAMP_KEY]);
    console.log('🗑️ [CACHE] Cache limpiado');
  } catch (error) {
    console.error('❌ [CACHE] Error limpiando cache:', error);
  }
}

/**
 * Obtiene el timestamp del cache
 */
export async function getCacheTimestamp(): Promise<number | null> {
  try {
    const result = await chrome.storage.local.get([CACHE_TIMESTAMP_KEY]);
    return result[CACHE_TIMESTAMP_KEY] as number | null;
  } catch (error) {
    console.error('❌ [CACHE] Error obteniendo timestamp:', error);
    return null;
  }
}
