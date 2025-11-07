import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';
import {
  signInWithGoogle as firebaseSignIn,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  refreshAuthToken,
} from '../firebase/auth';
import { clearCache } from '../storage/cache';

// Definir el tipo del contexto
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
  isTokenExpired: boolean;
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props del Provider
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Provider de autenticación que envuelve la aplicación
 * Maneja el estado global de autenticación
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTokenExpired, setIsTokenExpired] = useState(false);

  // Escuchar cambios en el estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged((authUser) => {
      setUser(authUser);
      setLoading(false);

      // Log para debug
      if (authUser) {
        console.log('✅ [AUTH] Usuario autenticado:', authUser.displayName || authUser.email);
      } else {
        console.log('🔓 [AUTH] Usuario no autenticado');
      }
    });

    // Cleanup: cancelar suscripción al desmontar
    return () => unsubscribe();
  }, []);

  // Auto-refresh de tokens cada 50 minutos (los tokens de Google expiran en 1 hora)
  useEffect(() => {
    if (!user) return;

    console.log('🔄 [AUTH] Iniciando auto-refresh de tokens');

    const refreshInterval = setInterval(async () => {
      console.log('🔄 [AUTH] Refrescando token...');

      try {
        const newToken = await refreshAuthToken();

        if (newToken) {
          console.log('✅ [AUTH] Token refrescado exitosamente');
          setIsTokenExpired(false);
        } else {
          console.warn('⚠️ [AUTH] No se pudo refrescar el token');
          setIsTokenExpired(true);
        }
      } catch (err) {
        console.error('❌ [AUTH] Error refrescando token:', err);
        setIsTokenExpired(true);
      }
    }, 50 * 60 * 1000); // 50 minutos

    // Cleanup: cancelar interval al desmontar o cambiar de usuario
    return () => {
      console.log('🛑 [AUTH] Deteniendo auto-refresh de tokens');
      clearInterval(refreshInterval);
    };
  }, [user]);

  /**
   * Función para iniciar sesión con Google
   */
  const signIn = async () => {
    setLoading(true);
    setError(null);

    try {
      await firebaseSignIn();
      // El estado se actualizará automáticamente vía onAuthStateChanged
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(errorMessage);
      console.error('Error en signIn:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Función para cerrar sesión
   */
  const signOut = async () => {
    setLoading(true);
    setError(null);

    try {
      // Limpiar cache local antes de cerrar sesión
      await clearCache();
      console.log('🗑️ [AUTH] Cache limpiado antes de signOut');

      await firebaseSignOut();
      setUser(null);
      console.log('✅ [AUTH] Sesión cerrada exitosamente');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cerrar sesión';
      setError(errorMessage);
      console.error('❌ [AUTH] Error en signOut:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Limpiar mensaje de error
   */
  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    signIn,
    signOut,
    clearError,
    isTokenExpired,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook personalizado para usar el contexto de autenticación
 * @throws Error si se usa fuera del AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }

  return context;
}
