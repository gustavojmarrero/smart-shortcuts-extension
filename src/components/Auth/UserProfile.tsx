import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Cloud } from 'lucide-react';

/**
 * Componente que muestra el perfil del usuario autenticado
 * Incluye avatar, nombre y botón de logout
 */
export default function UserProfile() {
  const { user, signOut, loading } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  if (!user) return null;

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowMenu(false);
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        title={user.displayName || user.email || 'Usuario'}
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || 'Usuario'}
            className="w-8 h-8 rounded-full border-2 border-gray-200"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
            {(user.displayName || user.email || 'U')[0].toUpperCase()}
          </div>
        )}

        <div className="flex flex-col items-start">
          <span className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
            {user.displayName || 'Usuario'}
          </span>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Cloud className="w-3 h-3" />
            <span>Sincronizado</span>
          </div>
        </div>
      </button>

      {showMenu && (
        <>
          {/* Overlay para cerrar el menú al hacer click fuera */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />

          {/* Menú desplegable */}
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Usuario'}
                    className="w-12 h-12 rounded-full border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium text-lg">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.displayName || 'Usuario'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-2">
              <button
                onClick={handleSignOut}
                disabled={loading}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogOut className="w-4 h-4" />
                <span>{loading ? 'Cerrando sesión...' : 'Cerrar sesión'}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
