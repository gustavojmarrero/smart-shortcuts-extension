import { WifiOff, RefreshCw } from 'lucide-react';

interface OfflineBannerProps {
  isOnline: boolean;
  isReconnecting?: boolean;
}

export default function OfflineBanner({ isOnline, isReconnecting = false }: OfflineBannerProps) {
  if (isOnline) return null;

  return (
    <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2">
      <div className="flex items-center justify-center gap-2 text-sm text-yellow-800">
        {isReconnecting ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Reconectando...</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4" />
            <span>Sin conexión - Mostrando datos en caché</span>
          </>
        )}
      </div>
    </div>
  );
}
