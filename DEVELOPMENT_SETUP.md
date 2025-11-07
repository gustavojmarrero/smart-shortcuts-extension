# 🛠️ Guía de Setup para Desarrolladores

## Extension ID Consistente

Esta extensión usa un **Extension ID fijo** mediante el campo `"key"` en `manifest.json`. Esto garantiza que todos los desarrolladores y testers tengan el mismo ID, permitiendo que la autenticación OAuth funcione en todas las máquinas.

### 📋 Información Clave

- **Extension ID (permanente):** `gacibpmoecbcbhkeidgdhaoijmgablle`
- **OAuth Client ID:** `390737548991-9mqe47luc5jukhi9sg89cnagraua2qoq.apps.googleusercontent.com`
- **Redirect URI:** `https://gacibpmoecbcbhkeidgdhaoijmgablle.chromiumapp.org/`

---

## 🚀 Setup Rápido (Para Desarrolladores/Testers)

### Requisitos Previos
- Node.js 18+
- Chrome Browser
- Git

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/gustavojmarrero/smart-shortcuts-extension.git
cd smart-shortcuts-extension

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Firebase (solicítalas al equipo)

# 4. Compilar la extensión
npm run build

# 5. Cargar en Chrome
# - Abre chrome://extensions/
# - Activa "Modo de desarrollador"
# - Click "Cargar extensión sin empaquetar"
# - Selecciona la carpeta "dist/"
```

### ✅ Verificación

Después de cargar la extensión:
- Extension ID debe ser: **`gacibpmoecbcbhkeidgdhaoijmgablle`**
- La autenticación OAuth debe funcionar sin configuración adicional

---

## 🔑 Sobre el Campo "key" en manifest.json

### ¿Qué es?

El campo `"key"` en `manifest.json` contiene una **clave pública RSA** que Chrome usa para generar un Extension ID consistente.

```json
{
  "key": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAw8kIB6/Fr3J4rhm...",
  ...
}
```

### ¿Por qué es necesario?

Sin el campo `"key"`:
- Chrome genera un Extension ID aleatorio basado en la ruta del directorio
- Cada máquina/usuario tendría un ID diferente
- OAuth fallaría porque Google requiere registrar la URI específica: `https://<extension-id>.chromiumapp.org/`

Con el campo `"key"`:
- Extension ID es siempre `gacibpmoecbcbhkeidgdhaoijmgablle`
- Funciona en todas las máquinas
- OAuth funciona sin configuración adicional

### ¿Es seguro compartir la clave pública?

**SÍ.** La clave en `manifest.json` es una clave **pública** (como las SSH public keys):
- Solo permite **derivar** el Extension ID
- NO permite empaquetar la extensión
- NO permite publicar actualizaciones en Chrome Web Store
- Es seguro incluirla en Git y compartirla con el equipo

---

## 🔐 Sobre la Clave Privada (.pem)

### ¿Dónde está?

La clave privada **NO está en el repositorio** por seguridad.

**Ubicación (solo propietario):**
- Local: `~/.chrome-extension-keys/smart-shortcuts.pem`
- Backup: 1Password → Smart Shortcuts Extension → `smart-shortcuts.pem`

### ¿Quién la necesita?

**Solo el propietario/publisher** necesita la clave privada (`.pem`) para:
- Publicar la extensión en Chrome Web Store
- Actualizar versiones publicadas

**Desarrolladores/Testers NO necesitan** la clave privada:
- La clave pública en `manifest.json` es suficiente
- Pueden desarrollar, probar y debuggear normalmente

### ⚠️ IMPORTANTE: No Perder la Clave Privada

Si se pierde el archivo `.pem`:
- NO podrás publicar actualizaciones de la extensión
- Tendrías que publicar como NUEVA extensión (nuevo ID)
- Se perderían todos los usuarios, reviews, estadísticas

**Asegúrate de tener backups:**
- ✅ 1Password
- ✅ Almacenamiento cifrado
- ✅ Compartir con co-propietario de confianza (opcional)

---

## 🌍 Configuración de Firebase

### Variables de Entorno

Copia `.env.example` a `.env` y configura:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=smart-shortcuts-359e0.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=smart-shortcuts-359e0
VITE_FIREBASE_STORAGE_BUCKET=smart-shortcuts-359e0.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=390737548991
VITE_FIREBASE_APP_ID=1:390737548991:web:...
VITE_FIREBASE_MEASUREMENT_ID=G-...
```

**¿Dónde obtener estos valores?**
- Firebase Console: https://console.firebase.google.com/project/smart-shortcuts-359e0/settings/general
- O solicítalos al equipo/propietario del proyecto

### Firestore Database

Si trabajas con Firestore, necesitas:
1. Acceso al proyecto Firebase (solicitar al propietario)
2. Firestore Database habilitado
3. Reglas de seguridad configuradas (ver `firestore.rules`)

---

## 🧪 Testing Local

### Compilar y Recargar

```bash
# Recompilar después de cambios
npm run build

# En Chrome (chrome://extensions/)
# - Click en el ícono de recarga (🔄) de Smart Shortcuts
```

### Probar Autenticación

1. Abre la extensión
2. Click en "Continuar con Google"
3. Selecciona tu cuenta de Google
4. Deberías ver la pantalla principal con tus shortcuts

**Si la autenticación falla:**
- Verifica que el Extension ID sea correcto: `gacibpmoecbcbhkeidgdhaoijmgablle`
- Revisa DevTools Console por errores
- Verifica que `.env` tenga las credenciales correctas

### DevTools

Para debuggear:
```
1. chrome://extensions/
2. Smart Shortcuts → "Inspeccionar vista: popup"
3. Se abrirán las DevTools con console, network, etc.
```

---

## 📦 Empaquetar para Distribución

### Crear ZIP

```bash
npm run build
cd dist
zip -r smart-shortcuts-v3.0.0.zip .
```

### Compartir con Testers

Opciones:
1. **Compartir repositorio** (recomendado)
   - Los testers clonan y compilan
   - Siempre tienen la última versión

2. **Compartir ZIP**
   - Envías el archivo .zip
   - Testers lo descomprimen y cargan en Chrome

3. **Subir a Chrome Web Store (draft)**
   - No publicar, solo subir
   - Compartir link de tester con emails específicos

---

## 🚀 Publicar en Chrome Web Store

**⚠️ Solo para el propietario con acceso a la clave privada.**

### Requisitos
- Clave privada: `~/.chrome-extension-keys/smart-shortcuts.pem`
- Cuenta de Chrome Web Store Developer
- $5 USD fee (pago único)

### Proceso

1. **Empaquetar con clave privada:**
   ```bash
   npm run build
   # En chrome://extensions/
   # - Click "Empaquetar extensión"
   # - Extension root: carpeta "dist"
   # - Private key: ~/.chrome-extension-keys/smart-shortcuts.pem
   # - Se genera dist.crx
   ```

2. **Subir a Chrome Web Store:**
   - https://chrome.google.com/webstore/devconsole
   - Upload nuevo ZIP/CRX
   - Completar información de la listing
   - Publicar

3. **Extension ID en producción:**
   - Será el MISMO: `gacibpmoecbcbhkeidgdhaoijmgablle`
   - Gracias al campo `"key"` en manifest.json

---

## 🔧 Troubleshooting

### "Extension ID es diferente"

**Causa:** El campo `"key"` no está en manifest.json o no se compiló correctamente.

**Solución:**
```bash
# Verificar que manifest.json tenga el campo "key"
cat public/manifest.json | grep key

# Recompilar
npm run build

# Recargar extensión en Chrome
```

### "OAuth falla con error de redirect_uri"

**Causa:** El Extension ID en Chrome no coincide con el registrado en Google Cloud Console.

**Solución:**
1. Verifica Extension ID en chrome://extensions/
2. Debe ser: `gacibpmoecbcbhkeidgdhaoijmgablle`
3. Si es diferente, hay un problema con el campo `"key"`

### "No puedo autenticarme"

**Checklist:**
- [ ] Extension ID correcto: `gacibpmoecbcbhkeidgdhaoijmgablle`
- [ ] `.env` tiene las credenciales de Firebase
- [ ] Estás usando una cuenta de Google válida
- [ ] Firebase Authentication está habilitado en Firebase Console
- [ ] OAuth Client ID está configurado correctamente

---

## 📚 Documentación Adicional

- [README.md](README.md) - Descripción general del proyecto
- [ROADMAP_FIREBASE.md](ROADMAP_FIREBASE.md) - Plan de integración Firebase
- [FIRESTORE_SETUP.md](FIRESTORE_SETUP.md) - Configuración de Firestore
- [firestore.rules](firestore.rules) - Reglas de seguridad de Firestore

---

## 🆘 Soporte

Si tienes problemas:
1. Revisa esta documentación
2. Busca en los issues de GitHub
3. Contacta al equipo en [tu canal de comunicación]

---

**Última actualización:** 6 de Noviembre, 2025
**Versión:** 3.0.0
**Extension ID:** `gacibpmoecbcbhkeidgdhaoijmgablle`
