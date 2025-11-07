import { Cloud, Smartphone, Lock, Zap } from 'lucide-react';
import LoginButton from './LoginButton';

/**
 * Pantalla de bienvenida para usuarios no autenticados
 * Explica los beneficios de iniciar sesión
 */
export default function Welcome() {
  return (
    <div className="w-[380px] h-[600px] flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="w-full bg-white rounded-xl shadow-lg p-6">
        {/* Logo/Título */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-full mb-3">
            <Zap className="w-7 h-7 text-blue-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">
            Smart Shortcuts
          </h1>
          <p className="text-sm text-gray-600">
            Sincroniza tus atajos en todos tus dispositivos
          </p>
        </div>

        {/* Beneficios */}
        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Cloud className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                Sincronización en la nube
              </h3>
              <p className="text-sm text-gray-600">
                Tus atajos siempre disponibles, sin importar dónde estés
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                Multi-dispositivo
              </h3>
              <p className="text-sm text-gray-600">
                Accede desde cualquier navegador con tu cuenta de Google
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Lock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                Seguro y privado
              </h3>
              <p className="text-sm text-gray-600">
                Tus datos están protegidos con autenticación de Google
              </p>
            </div>
          </div>
        </div>

        {/* Botón de login */}
        <div className="mb-3">
          <LoginButton />
        </div>

        {/* Nota adicional */}
        <p className="text-[10px] text-gray-500 text-center">
          Al continuar, aceptas que tus atajos se sincronicen en la nube
        </p>
      </div>
    </div>
  );
}
