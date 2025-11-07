import { useState, useEffect } from 'react';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isReconnecting, setIsReconnecting] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      console.log('🌐 [NETWORK] Conexión restaurada');
      setIsReconnecting(true);

      // Dar un momento para que las conexiones se establezcan
      setTimeout(() => {
        setIsOnline(true);
        setIsReconnecting(false);
      }, 1000);
    };

    const handleOffline = () => {
      console.log('🔴 [NETWORK] Conexión perdida');
      setIsOnline(false);
      setIsReconnecting(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Verificar estado inicial
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, isReconnecting };
}
