import { useCallback, useRef, useEffect } from 'react';
import { debounce } from '../utils/debounce';
import type { ShortcutConfig } from '../storage/types';

/**
 * Hook para guardar config en Firestore con debouncing
 * Reduce el número de escrituras cuando hay múltiples cambios rápidos
 *
 * @param saveToFirestore - Función de guardado original
 * @param delay - Tiempo de debounce en milisegundos (default: 1000ms)
 * @returns Función de guardado con debounce aplicado
 */
export function useDebouncedSave(
  saveToFirestore: ((config: ShortcutConfig) => Promise<void>) | null,
  delay: number = 1000
) {
  const saveRef = useRef(saveToFirestore);
  const pendingSaveRef = useRef<ShortcutConfig | null>(null);
  const isSavingRef = useRef(false);

  // Actualizar ref cuando cambia la función
  useEffect(() => {
    saveRef.current = saveToFirestore;
  }, [saveToFirestore]);

  // Función de guardado real
  const performSave = useCallback(async (config: ShortcutConfig) => {
    if (!saveRef.current) {
      console.warn('⚠️ [DEBOUNCED_SAVE] No hay función de guardado disponible');
      return;
    }

    // Marcar que estamos guardando
    isSavingRef.current = true;
    pendingSaveRef.current = null;

    try {
      console.log('💾 [DEBOUNCED_SAVE] Guardando config (debounced)...');
      await saveRef.current(config);
      console.log('✅ [DEBOUNCED_SAVE] Config guardada exitosamente');
    } catch (error) {
      console.error('❌ [DEBOUNCED_SAVE] Error guardando:', error);
      throw error;
    } finally {
      isSavingRef.current = false;

      // Si hay un guardado pendiente, ejecutarlo
      if (pendingSaveRef.current) {
        const pending = pendingSaveRef.current;
        pendingSaveRef.current = null;
        console.log('🔄 [DEBOUNCED_SAVE] Ejecutando guardado pendiente');
        performSave(pending);
      }
    }
  }, []);

  // Crear función debounced
  const debouncedSaveRef = useRef(
    debounce((config: ShortcutConfig) => {
      performSave(config);
    }, delay)
  );

  // Función pública que usa debouncing
  const debouncedSave = useCallback(
    (config: ShortcutConfig) => {
      if (isSavingRef.current) {
        // Si ya estamos guardando, guardar este como pendiente
        console.log('⏳ [DEBOUNCED_SAVE] Guardado en progreso, marcando como pendiente');
        pendingSaveRef.current = config;
        return;
      }

      console.log('⏱️ [DEBOUNCED_SAVE] Programando guardado...');
      debouncedSaveRef.current(config);
    },
    []
  );

  // Función para forzar guardado inmediato (útil antes de cerrar, cambiar de página, etc.)
  const saveImmediately = useCallback(
    async (config: ShortcutConfig) => {
      console.log('🚀 [DEBOUNCED_SAVE] Guardado inmediato solicitado');
      await performSave(config);
    },
    [performSave]
  );

  return {
    debouncedSave,
    saveImmediately,
    hasPendingSave: () => pendingSaveRef.current !== null,
  };
}
