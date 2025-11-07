import { useEffect, useState, useCallback } from 'react';
import { User } from 'firebase/auth';
import {
  loadUserConfig,
  saveUserConfig,
  subscribeToConfigChanges,
  hasUserConfig,
  saveUserProfile,
} from '../firebase/firestore';
import {
  loadCacheConfig,
  saveCacheConfig,
} from '../storage/cache';
import type { ShortcutConfig } from '../storage/types';

interface UseFirestoreConfigReturn {
  config: ShortcutConfig | null;
  loading: boolean;
  error: string | null;
  hasConfig: boolean;
  saveConfig: (config: ShortcutConfig) => Promise<void>;
  refreshConfig: () => Promise<void>;
}

/**
 * Hook personalizado para manejar la configuración de Firestore
 * - Carga automáticamente la config cuando el usuario se autentica
 * - Se suscribe a cambios en tiempo real
 * - Guarda el perfil del usuario
 *
 * @param user - Usuario autenticado de Firebase (null si no está autenticado)
 * @returns Estado y funciones para manejar la config
 */
export function useFirestoreConfig(user: User | null): UseFirestoreConfigReturn {
  const [config, setConfig] = useState<ShortcutConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasConfig, setHasConfig] = useState(false);

  /**
   * Cargar config inicial con estrategia de cache
   */
  const loadConfig = useCallback(async () => {
    if (!user) {
      setConfig(null);
      setHasConfig(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('📥 [useFirestoreConfig] Cargando config para:', user.uid);

      // PASO 1: Intentar cargar desde cache local (rápido)
      const cachedConfig = await loadCacheConfig();

      if (cachedConfig) {
        // Cargar cache inmediatamente (optimistic)
        setConfig(cachedConfig);
        setHasConfig(true);
        console.log('⚡ [useFirestoreConfig] Config cargada desde cache (optimistic)');
      }

      // PASO 2: Verificar si existe config en Firestore
      const exists = await hasUserConfig(user.uid);
      setHasConfig(exists);

      if (!exists) {
        console.log('⚠️ [useFirestoreConfig] Usuario nuevo, no tiene config en Firestore');
        setConfig(null);
        return;
      }

      // PASO 3: Cargar de Firestore solo si es necesario
      const firestoreConfig = await loadUserConfig(user.uid);

      if (firestoreConfig) {
        // Verificar si cache está actualizado
        if (cachedConfig && cachedConfig.lastModified >= firestoreConfig.lastModified) {
          console.log('✅ [useFirestoreConfig] Cache válido, usando cache');
          // Ya tenemos el cache cargado, no hacer nada
        } else {
          console.log('🔄 [useFirestoreConfig] Cache desactualizado, usando Firestore');
          setConfig(firestoreConfig);
          // Actualizar cache
          await saveCacheConfig(firestoreConfig);
        }
      }
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar configuración';
      setError(errorMessage);
      console.error('❌ [useFirestoreConfig] Error:', err);

      // Si es error de red y tenemos cache, usar cache
      if (err.isNetworkError) {
        const cachedConfig = await loadCacheConfig();
        if (cachedConfig) {
          console.log('🔴 [useFirestoreConfig] Error de red, usando cache como fallback');
          setConfig(cachedConfig);
          setHasConfig(true);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Guardar perfil del usuario
   */
  useEffect(() => {
    if (user) {
      saveUserProfile(user.uid, {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      }).catch((err) => {
        console.warn('[useFirestoreConfig] Error guardando perfil:', err);
      });
    }
  }, [user]);

  /**
   * Cargar config inicial cuando el usuario cambia
   */
  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  /**
   * Suscribirse a cambios en tiempo real
   */
  useEffect(() => {
    if (!user) {
      return;
    }

    console.log('[useFirestoreConfig] Suscribiéndose a cambios en tiempo real');

    const unsubscribe = subscribeToConfigChanges(user.uid, async (updatedConfig) => {
      if (updatedConfig) {
        console.log('🔄 [useFirestoreConfig] Config actualizada desde servidor');
        setConfig(updatedConfig);
        setHasConfig(true);
        // Actualizar cache con los cambios del servidor
        await saveCacheConfig(updatedConfig);
      } else {
        console.log('⚠️ [useFirestoreConfig] Config eliminada desde servidor');
        setConfig(null);
        setHasConfig(false);
      }
    });

    // Cleanup: cancelar suscripción al desmontar
    return () => {
      console.log('[useFirestoreConfig] Cancelando suscripción');
      unsubscribe();
    };
  }, [user]);

  /**
   * Guardar configuración en Firestore y actualizar cache
   */
  const saveConfig = useCallback(
    async (newConfig: ShortcutConfig) => {
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      setLoading(true);
      setError(null);

      try {
        // Guardar en Firestore
        await saveUserConfig(user.uid, newConfig);
        setConfig(newConfig);
        setHasConfig(true);
        console.log('✅ [useFirestoreConfig] Config guardada en Firestore');

        // Actualizar cache local inmediatamente
        await saveCacheConfig(newConfig);
        console.log('💾 [useFirestoreConfig] Cache actualizado');
      } catch (err: any) {
        const errorMessage = err instanceof Error ? err.message : 'Error al guardar configuración';
        setError(errorMessage);
        console.error('❌ [useFirestoreConfig] Error guardando:', err);

        // Si es error de red, guardar solo en cache
        if (err.isNetworkError) {
          console.log('🔴 [useFirestoreConfig] Error de red, guardando solo en cache');
          await saveCacheConfig(newConfig);
          setConfig(newConfig);
          // No lanzar error - el usuario puede seguir trabajando
        } else {
          throw err;
        }
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  /**
   * Refrescar config manualmente
   */
  const refreshConfig = useCallback(async () => {
    await loadConfig();
  }, [loadConfig]);

  return {
    config,
    loading,
    error,
    hasConfig,
    saveConfig,
    refreshConfig,
  };
}
