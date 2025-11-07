# Política de Privacidad - Smart Shortcuts

**Última actualización:** 6 de Noviembre, 2025

## Información que Recopilamos

Smart Shortcuts recopila y almacena la siguiente información:

### 1. Información de Autenticación
- Email de tu cuenta de Google
- Nombre de usuario
- Foto de perfil (URL)
- ID de usuario de Google

Esta información se obtiene a través de OAuth2 y se utiliza únicamente para:
- Autenticarte en la extensión
- Identificar tus datos en Firebase Firestore
- Mostrar tu perfil en la interfaz

### 2. Datos de la Extensión
- Configuración de shortcuts (URLs, nombres, iconos)
- Estructura de carpetas y secciones
- Timestamps de última modificación

Estos datos se almacenan en:
- **Firebase Firestore** - Base de datos en la nube (sincronización)
- **chrome.storage.local** - Cache local (rendimiento)
- **chrome.storage.sync** - Respaldo local (migración de v2.x)

## Cómo Usamos tu Información

### Autenticación
- Validamos tu identidad con Google OAuth2
- No almacenamos contraseñas (OAuth2 es el método seguro de Google)

### Sincronización
- Guardamos tus shortcuts en Firestore asociados a tu ID de usuario
- Solo tú puedes acceder a tus datos (reglas de seguridad Firestore)
- Sincronizamos cambios en tiempo real entre tus dispositivos

### Cache Local
- Guardamos una copia local para carga instantánea (1-2ms)
- El cache se limpia al cerrar sesión

## Compartir Información

**NO compartimos tu información con terceros.**

Los únicos servicios que tienen acceso a tus datos son:
- **Google Firebase** - Para almacenar tus shortcuts (proveedor de infraestructura)
- **Google OAuth** - Para autenticación (servicio de Google)

Ambos servicios están sujetos a las políticas de privacidad de Google.

## Seguridad

### Medidas de Protección
- **Encriptación en tránsito:** HTTPS para todas las comunicaciones
- **Encriptación en reposo:** Firestore encripta datos automáticamente
- **Reglas de seguridad Firestore:**
  ```javascript
  // Solo el usuario autenticado puede leer/escribir sus propios datos
  allow read, write: if request.auth != null && request.auth.uid == userId;
  ```
- **OAuth2 seguro:** Usamos chrome.identity (estándar de Chrome)
- **Extension ID permanente:** Previene suplantación de identidad

### Acceso a Datos
- Solo tú tienes acceso a tus shortcuts
- Ni siquiera el desarrollador puede ver tus datos
- Firestore requiere autenticación para cualquier operación

## Tus Derechos

### Acceso a tus Datos
Puedes ver todos tus datos en:
- La extensión (interfaz de usuario)
- Firebase Console (si tienes acceso como desarrollador)
- Exportar desde Opciones > Exportar/Importar

### Eliminar tus Datos
Puedes eliminar tus datos en cualquier momento:

**1. Dentro de la extensión:**
- Elimina shortcuts/carpetas manualmente
- O cierra sesión (limpia cache local)

**2. Eliminar cuenta completa:**
- Contacta: gustavojmarrero@gmail.com
- Eliminaremos todos tus datos de Firestore en 30 días

### Portabilidad
- Exporta tus datos en formato JSON
- Importa en otra instancia o dispositivo
- Sin lock-in: tus datos son tuyos

## Cookies y Tracking

**NO usamos:**
- ❌ Cookies de tracking
- ❌ Google Analytics
- ❌ Anuncios
- ❌ Ningún tipo de rastreo

**Solo usamos:**
- ✅ Tokens de OAuth2 (autenticación)
- ✅ Cache local (rendimiento)

## Datos que Recopilamos (Chrome Web Store Disclosure)

### Authentication Information
- **Email address** - Obtenido de Google OAuth2
- **Display name** - Obtenido de Google OAuth2
- **Profile picture URL** - Obtenido de Google OAuth2

**Propósito:** Autenticación y personalización de la interfaz

**Almacenamiento:** Firebase Firestore

**Compartido con terceros:** No

### Personally Identifiable Information
- **User ID** - ID de usuario de Google (hash)

**Propósito:** Identificar tus datos en la base de datos

**Almacenamiento:** Firebase Firestore

**Compartido con terceros:** No

### Website Content
- **Shortcuts configuration** - URLs, nombres, iconos, carpetas

**Propósito:** Sincronizar tus shortcuts entre dispositivos

**Almacenamiento:** Firebase Firestore + chrome.storage.local (cache)

**Compartido con terceros:** No

## Permisos de la Extensión

### storage
- **Propósito:** Guardar configuración local como cache y respaldo offline
- **Datos almacenados:** Copia local de tus shortcuts (chrome.storage.local)
- **Acceso:** Solo la extensión

### tabs
- **Propósito:** Abrir nuevas pestañas cuando haces click en un shortcut
- **Datos almacenados:** Ninguno
- **Acceso:** Solo para crear pestañas, no para leer contenido

### identity
- **Propósito:** Autenticación OAuth2 con Google
- **Datos almacenados:** Token de acceso (temporal)
- **Acceso:** Solo para autenticación, se renueva cada 50 minutos

### Host Permissions

**https://*.googleapis.com/***
- **Propósito:** Comunicación con Firebase Auth
- **Uso:** Autenticación con Google OAuth2

**https://*.firebaseio.com/***
- **Propósito:** Sincronización en tiempo real
- **Uso:** Firebase Realtime Database (si se usa)

**https://*.firestore.googleapis.com/***
- **Propósito:** Operaciones CRUD con Firestore
- **Uso:** Guardar, leer, actualizar y eliminar tus shortcuts

## Cambios en esta Política

Notificaremos cambios significativos mediante:
- Actualización del campo "Última actualización"
- Notas en el CHANGELOG
- Notificación en la extensión (si es cambio mayor)

## Cumplimiento Legal

### GDPR (Unión Europea)
Si resides en la UE, tienes derecho a:
- Acceso a tus datos
- Rectificación de datos incorrectos
- Eliminación de tus datos ("derecho al olvido")
- Portabilidad de datos
- Oposición al procesamiento

Para ejercer estos derechos, contacta: gustavojmarrero@gmail.com

### CCPA (California, USA)
Si resides en California, tienes derecho a:
- Conocer qué datos recopilamos
- Solicitar eliminación de datos
- Optar por no vender datos (no vendemos datos)

Para ejercer estos derechos, contacta: gustavojmarrero@gmail.com

### Children's Privacy (COPPA)
Smart Shortcuts no está dirigido a menores de 13 años. No recopilamos intencionalmente información de niños menores de 13 años.

## Transparencia

Smart Shortcuts es **código abierto**:
- **Código fuente:** https://github.com/gustavojmarrero/smart-shortcuts-extension
- Puedes auditar el código en cualquier momento
- Aceptamos contribuciones y reportes de seguridad
- Sin código ofuscado o malicioso

## Contacto

Para preguntas sobre privacidad o ejercer tus derechos:

- **Email:** gustavojmarrero@gmail.com
- **GitHub Issues:** https://github.com/gustavojmarrero/smart-shortcuts-extension/issues
- **Reportes de seguridad:** gustavojmarrero@gmail.com (pon "SECURITY" en el asunto)

## Resumen Ejecutivo

**En pocas palabras:**
1. Solo guardamos lo necesario para que la extensión funcione
2. Tus datos son SOLO tuyos (nadie más puede verlos)
3. No vendemos ni compartimos información
4. Puedes eliminar todo en cualquier momento
5. Código abierto = transparencia total

---

**Smart Shortcuts v3.0.0**
**Desarrollador:** Gustavo Marrero
**Extension ID:** gacibpmoecbcbhkeidgdhaoijmgablle
