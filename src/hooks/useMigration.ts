import { useState, useEffect, useCallback } from 'react';
import { loadConfig } from '../storage/config';
import type { ShortcutConfig } from '../storage/types';

type MigrationStatus = 'checking' | 'pending' | 'migrating' | 'completed' | 'skipped' | 'never';

interface MigrationState {
  status: MigrationStatus;
  hasLocalData: boolean;
  localConfig: ShortcutConfig | null;
  progress: number; // 0-100
  error: string | null;
}

interface UseMigrationResult extends MigrationState {
  startMigration: () => Promise<void>;
  skipMigration: () => void;
  neverMigrate: () => void;
  needsPrompt: boolean;
}

const MIGRATION_DECISION_KEY = 'migration_decision';

/**
 * Hook para manejar la migración de datos de chrome.storage.sync a Firestore
 *
 * @param userId - ID del usuario autenticado
 * @param hasFirestoreConfig - Si ya existe config en Firestore
 * @param saveToFirestore - Función para guardar en Firestore
 * @returns Estado de migración y funciones de control
 */
export function useMigration(
  userId: string | null,
  hasFirestoreConfig: boolean,
  saveToFirestore: ((config: ShortcutConfig) => Promise<void>) | null
): UseMigrationResult {
  const [state, setState] = useState<MigrationState>({
    status: 'checking',
    hasLocalData: false,
    localConfig: null,
    progress: 0,
    error: null,
  });

  // Verificar si hay datos locales para migrar
  useEffect(() => {
    async function checkLocalData() {
      if (!userId) {
        setState(prev => ({ ...prev, status: 'completed' }));
        return;
      }

      // Si ya existe config en Firestore, no necesitamos migrar
      if (hasFirestoreConfig) {
        setState(prev => ({ ...prev, status: 'completed', hasLocalData: false }));
        return;
      }

      // Verificar decisión previa del usuario
      const decision = localStorage.getItem(MIGRATION_DECISION_KEY);
      if (decision === 'never') {
        setState(prev => ({ ...prev, status: 'never', hasLocalData: false }));
        return;
      }
      if (decision === 'skipped') {
        setState(prev => ({ ...prev, status: 'skipped', hasLocalData: false }));
        return;
      }

      try {
        // Cargar config de chrome.storage.sync
        const localConfig = await loadConfig();
        const hasData = localConfig.sections.length > 0;

        console.log(`🔍 [MIGRATION] Datos locales encontrados: ${hasData}`);
        console.log(`📊 [MIGRATION] Secciones: ${localConfig.sections.length}`);

        setState({
          status: hasData ? 'pending' : 'completed',
          hasLocalData: hasData,
          localConfig: hasData ? localConfig : null,
          progress: 0,
          error: null,
        });
      } catch (error) {
        console.error('❌ [MIGRATION] Error checking local data:', error);
        setState(prev => ({
          ...prev,
          status: 'completed',
          error: 'Error al verificar datos locales',
        }));
      }
    }

    checkLocalData();
  }, [userId, hasFirestoreConfig]);

  // Iniciar migración
  const startMigration = useCallback(async () => {
    if (!state.localConfig || !saveToFirestore) {
      console.error('❌ [MIGRATION] No local config or save function');
      return;
    }

    setState(prev => ({ ...prev, status: 'migrating', progress: 0 }));

    try {
      console.log('🚀 [MIGRATION] Iniciando migración a Firestore');

      // Simular progreso para mejor UX
      setState(prev => ({ ...prev, progress: 30 }));

      await saveToFirestore(state.localConfig);

      setState(prev => ({ ...prev, progress: 80 }));

      // Pequeño delay para que se vea el progreso completo
      await new Promise(resolve => setTimeout(resolve, 300));

      setState(prev => ({ ...prev, progress: 100, status: 'completed' }));

      // Guardar decisión
      localStorage.setItem(MIGRATION_DECISION_KEY, 'completed');

      console.log('✅ [MIGRATION] Migración completada exitosamente');

      // Limpiar flag de sessionStorage si existe
      sessionStorage.removeItem('migration_attempted');
    } catch (error) {
      console.error('❌ [MIGRATION] Error durante migración:', error);
      setState(prev => ({
        ...prev,
        status: 'pending',
        progress: 0,
        error: error instanceof Error ? error.message : 'Error desconocido',
      }));
    }
  }, [state.localConfig, saveToFirestore]);

  // Usuario decide migrar después
  const skipMigration = useCallback(() => {
    console.log('⏭️ [MIGRATION] Usuario postpone migración');
    localStorage.setItem(MIGRATION_DECISION_KEY, 'skipped');
    setState(prev => ({ ...prev, status: 'skipped' }));
  }, []);

  // Usuario decide nunca migrar
  const neverMigrate = useCallback(() => {
    console.log('🚫 [MIGRATION] Usuario rechaza migración permanentemente');
    localStorage.setItem(MIGRATION_DECISION_KEY, 'never');
    setState(prev => ({ ...prev, status: 'never' }));
  }, []);

  // Determinar si necesitamos mostrar el prompt
  const needsPrompt = state.status === 'pending' && state.hasLocalData;

  return {
    ...state,
    startMigration,
    skipMigration,
    neverMigrate,
    needsPrompt,
  };
}
