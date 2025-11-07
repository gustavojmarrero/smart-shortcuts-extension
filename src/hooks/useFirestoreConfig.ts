import { useEffect, useState, useCallback } from 'react';
import { User } from 'firebase/auth';
import {
  loadUserConfig,
  saveUserConfig,
  subscribeToConfigChanges,
  hasUserConfig,
  saveUserProfile,
} from '../firebase/firestore';
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
   * Cargar config inicial
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
      console.log('[useFirestoreConfig] Cargando config para:', user.uid);

      // Verificar si existe config
      const exists = await hasUserConfig(user.uid);
      setHasConfig(exists);

      if (exists) {
        // Cargar config
        const loadedConfig = await loadUserConfig(user.uid);
        setConfig(loadedConfig);
      } else {
        console.log('[useFirestoreConfig] Usuario nuevo, no tiene config en Firestore');
        setConfig(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar configuración';
      setError(errorMessage);
      console.error('[useFirestoreConfig] Error:', err);
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

    const unsubscribe = subscribeToConfigChanges(user.uid, (updatedConfig) => {
      if (updatedConfig) {
        console.log('[useFirestoreConfig] Config actualizada desde servidor');
        setConfig(updatedConfig);
        setHasConfig(true);
      } else {
        console.log('[useFirestoreConfig] Config eliminada desde servidor');
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
   * Guardar configuración en Firestore
   */
  const saveConfig = useCallback(
    async (newConfig: ShortcutConfig) => {
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      setLoading(true);
      setError(null);

      try {
        await saveUserConfig(user.uid, newConfig);
        setConfig(newConfig);
        setHasConfig(true);
        console.log('[useFirestoreConfig] Config guardada exitosamente');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al guardar configuración';
        setError(errorMessage);
        console.error('[useFirestoreConfig] Error guardando:', err);
        throw err;
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
