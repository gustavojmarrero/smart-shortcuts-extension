import { Cloud, Download, X, AlertCircle, Check } from 'lucide-react';
import type { ShortcutConfig } from '../../storage/types';

interface MigrationPromptProps {
  localConfig: ShortcutConfig;
  progress: number; // 0-100
  isMigrating: boolean;
  error: string | null;
  onMigrate: () => void;
  onSkip: () => void;
  onNever: () => void;
}

export default function MigrationPrompt({
  localConfig,
  progress,
  isMigrating,
  error,
  onMigrate,
  onSkip,
  onNever,
}: MigrationPromptProps) {
  const totalSections = localConfig.sections.length;
  const totalShortcuts = localConfig.sections.reduce(
    (sum, section) => sum + section.items.length,
    0
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Cloud className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold">Sincroniza tus Shortcuts</h2>
            </div>
            {!isMigrating && (
              <button
                onClick={onNever}
                className="text-white/80 hover:text-white transition-colors"
                title="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <p className="text-blue-100 text-sm">
            Guarda tus accesos directos en la nube
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Stats */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700 mb-2">
              Hemos encontrado datos en tu dispositivo:
            </p>
            <div className="flex items-center justify-around">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{totalSections}</div>
                <div className="text-xs text-gray-600">
                  {totalSections === 1 ? 'Sección' : 'Secciones'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{totalShortcuts}</div>
                <div className="text-xs text-gray-600">
                  {totalShortcuts === 1 ? 'Shortcut' : 'Shortcuts'}
                </div>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-3 mb-6">
            <h3 className="font-semibold text-gray-900 text-sm">
              Beneficios de sincronizar:
            </h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">
                  Accede a tus shortcuts desde cualquier dispositivo
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">
                  Sincronización automática en tiempo real
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">
                  Backup seguro en la nube
                </p>
              </div>
            </div>
          </div>

          {/* Progress Bar (solo visible durante migración) */}
          {isMigrating && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Migrando datos...
                </span>
                <span className="text-sm font-medium text-blue-600">
                  {progress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Por favor espera, no cierres esta ventana...
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">
                    Error al migrar
                  </p>
                  <p className="text-xs text-red-600 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          {!isMigrating && (
            <div className="space-y-2">
              <button
                onClick={onMigrate}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <Download className="w-4 h-4" />
                Migrar Ahora
              </button>

              <button
                onClick={onSkip}
                className="w-full bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Recordarme Después
              </button>

              <button
                onClick={onNever}
                className="w-full text-gray-500 text-sm py-2 hover:text-gray-700 transition-colors"
              >
                No migrar (mantener solo local)
              </button>
            </div>
          )}

          {/* Success message */}
          {progress === 100 && isMigrating && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-lg font-semibold text-gray-900 mb-1">
                ¡Migración Completada!
              </p>
              <p className="text-sm text-gray-600">
                Tus shortcuts ahora están sincronizados en la nube
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
