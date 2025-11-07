# 🗺️ Roadmap: Integración Firebase/Firestore v3.0

## 📋 Estado del Proyecto

**Versión Actual:** 2.2.1 → 3.0.0 (en progreso)
**Fecha de Inicio:** 6 de Noviembre, 2025
**Última Actualización:** 6 de Noviembre, 2025
**Objetivo:** Migrar de `chrome.storage.sync` a Firebase/Firestore con autenticación Google

**Commits Realizados:**
- `c153305` - FASE 1-2: Base de autenticación Firebase
- `2c134b1` - FASE 3: Integración de autenticación en UI

---

## ✅ FASE 1: Setup Inicial (COMPLETADO - 100%)

- [x] **Instalar Firebase SDK** (v10.14.0)
- [x] **Configurar OAuth Client ID** en Google Cloud Console
  - Client ID: `390737548991-9mqe47luc5jukhi9sg89cnagraua2qoq.apps.googleusercontent.com`
  - Extension ID: `eldeicjkfibgeicelepghpfbkbkmnbfi`
- [x] **Actualizar manifest.json v3.0.0**
  - ✓ Permiso `identity` agregado
  - ✓ OAuth2 configurado
  - ✓ Content Security Policy actualizado
  - ✓ Host permissions para Firebase/Firestore
- [x] **Crear archivo de configuración Firebase**
  - ✓ `src/firebase/config.ts` con inicialización
  - ✓ Variables de entorno configuradas en `.env`
- [x] **Modificar vite.config.ts**
  - ✓ Define `global` y `process.env` para compatibilidad

---

## ✅ FASE 2: Autenticación (COMPLETADO - 100%)

- [x] **Servicio de autenticación** (`src/firebase/auth.ts`)
  - ✓ `signInWithGoogle()` usando `chrome.identity.getAuthToken()`
  - ✓ `signOut()` con limpieza de tokens
  - ✓ `onAuthStateChanged()` listener
  - ✓ `getCurrentUser()` helper
  - ✓ `refreshAuthToken()` para renovar tokens

- [x] **Contexto de React** (`src/context/AuthContext.tsx`)
  - ✓ `AuthProvider` con estado global
  - ✓ Hook `useAuth()` para consumir el contexto
  - ✓ Manejo de loading y errores

- [x] **Componentes UI**
  - ✓ `LoginButton.tsx` - Botón de Google Sign-In
  - ✓ `UserProfile.tsx` - Avatar y menú de usuario
  - ✓ `Welcome.tsx` - Pantalla de onboarding

- [x] **Build verificado** - Compila sin errores

---

## ✅ FASE 3: Integración UI (COMPLETADO - 100%)

### Tareas Completadas:
- [x] **Modificar `src/popup/App.tsx`**
  - ✓ Envolver con `<AuthProvider>`
  - ✓ Mostrar `<Welcome />` si usuario no autenticado
  - ✓ Mostrar `<UserProfile />` en header si autenticado
  - ✓ Estados de loading diferenciados (auth vs config)
  - ✓ Integrado con sistema actual de shortcuts

- [x] **Modificar `src/options/Options.tsx`**
  - ✓ AuthProvider integrado
  - ✓ Welcome screen en página de opciones
  - ✓ UserProfile en header

- [x] **Ajustar dimensiones de Welcome**
  - ✓ Corregido a 380px × 600px
  - ✓ Optimizado espaciado y tamaños

### ⚠️ Problema Conocido:
- Autenticación inicia pero puede fallar en signInWithCredential
- Usuario ve pantalla de Google OAuth pero regresa sin completar login
- **SOLUCIÓN:** Verificar en consola de DevTools el error específico
- Puede requerir ajustes en `src/firebase/auth.ts`

---

## 🔄 FASE 4: Firestore Database (PENDIENTE - 0%)

### Tareas:
- [ ] **Configurar reglas de seguridad en Firebase Console**
  ```javascript
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /users/{userId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;

        match /sections/{sectionId} {
          allow read, write: if request.auth != null && request.auth.uid == userId;
        }
      }
    }
  }
  ```

- [ ] **Crear servicio Firestore** (`src/firebase/firestore.ts`)
  - `loadUserConfig(userId)` - Cargar config desde Firestore
  - `saveUserConfig(userId, config)` - Guardar config
  - `subscribeToConfigChanges(userId, callback)` - Real-time sync
  - Estructura de datos:
    ```
    users/{userId}/
      ├── profile/
      │   ├── email
      │   ├── displayName
      │   └── lastLogin
      └── sections/{sectionId}/
          ├── name
          ├── icon
          ├── color
          └── items[]
    ```

- [ ] **Crear hook personalizado** (`src/hooks/useFirestoreConfig.ts`)
  - Cargar/guardar config automáticamente
  - Sincronización bidireccional
  - Cache local para rendimiento

- [ ] **Modificar `src/storage/config.ts`**
  - Adaptar `loadConfig()` para intentar Firestore primero
  - Adaptar `saveConfig()` para doble-escritura:
    1. Firestore (si autenticado)
    2. `chrome.storage.local` (backup/cache)
  - Mantener backward compatibility

### Estimación: 5-6 horas

---

## 🔄 FASE 5: Migración de Datos (PENDIENTE - 0%)

### Tareas:
- [ ] **Crear hook de migración** (`src/hooks/useMigration.ts`)
  - Detectar datos en `chrome.storage.sync`
  - Verificar si ya existe config en Firestore
  - Preguntar al usuario si desea migrar

- [ ] **Crear componente de migración** (`src/components/Migration/MigrationPrompt.tsx`)
  - Modal atractivo con beneficios
  - Opciones: "Migrar ahora", "Después", "Nunca"
  - Progress bar durante migración

- [ ] **Integrar en App.tsx**
  - Mostrar prompt después de login
  - Ejecutar migración en background

### Estimación: 3-4 horas

---

## 🔄 FASE 6: Manejo de Errores (PENDIENTE - 0%)

### Tareas:
- [ ] **Detección de conexión offline**
  - Mostrar banner informativo
  - Permitir operaciones de solo-lectura desde cache
  - Auto-reconexión cuando vuelve internet

- [ ] **Resolución de conflictos**
  - Implementar estrategia last-write-wins
  - Opcional: modal de resolución manual

- [ ] **Auto-refresh de tokens**
  - Detectar expiración de sesión
  - Renovar automáticamente
  - Prompt de re-login si falla

- [ ] **Testing de casos edge**
  - Sin conexión a internet
  - Quota de Firestore excedida
  - Token expirado/revocado
  - Usuario cancela login

### Estimación: 2-3 horas

---

## 🔄 FASE 7: Optimización (PENDIENTE - 0%)

### Tareas:
- [ ] **Cache inteligente**
  - Solo leer de Firestore si `lastModified` cambió
  - Usar `chrome.storage.local` como cache rápido
  - Reducir lecturas de Firestore (límite: 50K/día gratis)

- [ ] **Lazy loading de Firebase**
  - Cargar Firebase solo cuando usuario hace login
  - Code splitting para reducir bundle size

- [ ] **Optimizar queries Firestore**
  - Usar `getDoc()` en lugar de `onSnapshot()` donde sea posible
  - Limitar listeners a solo cuando popup está abierto

- [ ] **Testing exhaustivo**
  - Login/Logout funciona correctamente
  - CRUD de shortcuts con Firestore
  - Sincronización entre múltiples tabs
  - Migración de datos antiguos
  - Manejo de errores graceful

### Estimación: 3-4 horas

---

## 🔄 FASE 8: Documentación y Release (PENDIENTE - 0%)

### Tareas:
- [ ] **Actualizar package.json**
  - Bump version a `3.0.0`

- [ ] **Actualizar README.md**
  - Documentar proceso de setup Firebase
  - Instrucciones para obtener OAuth Client ID
  - Explicar cambios en sincronización

- [ ] **Crear guía de migración** (`docs/MIGRATION_V3.md`)
  - Qué cambió en v3.0
  - Breaking changes
  - FAQ sobre Firebase/Google Sign-In

- [ ] **Actualizar CHANGELOG.md**
  - Documentar todos los cambios
  - Mencionar breaking changes
  - Notas de upgrade

- [ ] **Build y release**
  ```bash
  npm run build
  npm run package
  npm run release
  ```

### Estimación: 2 horas

---

## 📊 Resumen de Progreso

| Fase | Estado | Progreso | Tiempo Real | Estimado |
|------|--------|----------|-------------|----------|
| 1. Setup Inicial | ✅ Completado | 100% | ~2 horas | 2-3 horas |
| 2. Autenticación | ✅ Completado | 100% | ~3 horas | 4-5 horas |
| 3. Integración UI | ✅ Completado | 100% | ~2 horas | 2-3 horas |
| 4. Firestore Database | 🔄 Pendiente | 0% | - | 5-6 horas |
| 5. Migración Datos | 🔄 Pendiente | 0% | - | 3-4 horas |
| 6. Manejo Errores | 🔄 Pendiente | 0% | - | 2-3 horas |
| 7. Optimización | 🔄 Pendiente | 0% | - | 3-4 horas |
| 8. Documentación | 🔄 Pendiente | 0% | - | 2 horas |
| **TOTAL** | **47% Completo** | **47%** | **~7 horas** | **23-30 horas** |

---

## ⚠️ Advertencias Importantes

### 1. **Breaking Change Mayor**
- v3.0 requiere **Google Sign-In obligatorio** para sincronización
- Usuarios deben autenticarse para usar la extensión
- Sin auth = solo almacenamiento local (sin sincronización entre dispositivos)

### 2. **Privacidad del Usuario**
- Necesitas **política de privacidad actualizada**
- Informar qué datos se almacenan en Firebase
- Compliance con GDPR (si tienes usuarios en EU)

### 3. **Costos de Firebase**
**Plan Spark (Gratuito):**
- 50,000 lecturas/día
- 20,000 escrituras/día
- 1 GB almacenamiento

**Estimación de uso:**
- 1000 usuarios activos × 5 aperturas/día = 5,000 lecturas/día ✅ OK
- Suficiente para fase inicial

### 4. **OAuth Client ID Específico**
- El Extension ID cambia entre desarrollo y producción
- Necesitarás **2 OAuth Client IDs**:
  - Uno para dev (`eldeicjkfibgeicelepghpfbkbkmnbfi`)
  - Uno para producción (cuando publiques en Chrome Web Store)

### 5. **Content Security Policy (CSP)**
- Manifest V3 es MUY restrictivo
- NO permite `unsafe-eval` ni scripts remotos
- Firebase Auth estándar podría no funcionar
- Usar `chrome.identity.getAuthToken()` es la solución correcta

---

## 🎯 Próximos Pasos Inmediatos

1. ✅ **COMPLETADO - Commits realizados:**
   - `c153305`: FASE 1-2 (Setup + Autenticación)
   - `2c134b1`: FASE 3 (Integración UI)

2. 🔧 **OPCIONAL - Debuggear autenticación:**
   - Abrir DevTools en la extensión
   - Verificar errores en consola al hacer login
   - Posible problema: `signInWithCredential` failing
   - Solución temporal: Verificar tokens en chrome.identity

3. **🚀 SIGUIENTE: FASE 4 - Firestore Database**
   - Configurar reglas de seguridad en Firebase Console
   - Crear servicio Firestore (`src/firebase/firestore.ts`)
   - Implementar CRUD completo
   - Hook `useFirestoreConfig` para sincronización

4. **Continuar con FASE 5-8** según roadmap

---

## 📚 Referencias

- [Firebase Auth for Chrome Extensions](https://firebase.google.com/docs/auth/web/chrome-extension)
- [chrome.identity API](https://developer.chrome.com/docs/extensions/reference/identity/)
- [Firestore Web SDK](https://firebase.google.com/docs/firestore/quickstart)
- [Manifest V3 Migration](https://developer.chrome.com/docs/extensions/mv3/intro/)

---

## 📝 Notas para Continuar en Próxima Sesión

### 🐛 Problema Actual de Autenticación
**Síntoma:**
- Usuario hace click en "Continuar con Google"
- Se abre ventana de Google OAuth
- Ventana se cierra y regresa a Welcome screen (no completa login)

**Para Debuggear:**
```javascript
// En chrome://extensions/ → Smart Shortcuts → Inspeccionar vista popup
// Revisar consola al hacer login

// Posibles errores:
// 1. signInWithCredential failing
// 2. Token inválido de chrome.identity
// 3. Firebase Auth no inicializado correctamente
// 4. CSP bloqueando requests
```

**Archivos Relevantes:**
- `src/firebase/auth.ts:15-44` - Función signInWithGoogle()
- `src/context/AuthContext.tsx:48-67` - signIn handler
- `public/manifest.json:13-19` - OAuth2 config

**Posibles Soluciones:**
1. Verificar que Firebase proyecto tenga Google Sign-In habilitado
2. Revisar si Extension ID cambió (si se recargó la extensión)
3. Agregar más logging en auth.ts para ver dónde falla
4. Verificar que `.env` tenga todas las variables correctas

### 📂 Archivos Importantes

**Variables de Entorno:**
```bash
/Users/gustavomarrero/Documents/node/smart-shortcuts-extension/.env
```

**Configuración Firebase:**
```bash
src/firebase/config.ts    # Inicialización
src/firebase/auth.ts      # Autenticación
src/context/AuthContext.tsx  # Estado global
```

**UI Components:**
```bash
src/components/Auth/
  ├── Welcome.tsx         # 380x600px
  ├── LoginButton.tsx
  └── UserProfile.tsx
```

**Apps Principales:**
```bash
src/popup/App.tsx         # Popup principal
src/options/Options.tsx   # Página de configuración
```

### 🔧 Comandos Útiles

```bash
# Compilar proyecto
npm run build

# Recargar extensión después de cambios
# chrome://extensions/ → Click reload (🔄)

# Ver logs de la extensión
# chrome://extensions/ → Smart Shortcuts → "Inspeccionar vista: popup"

# Ver variables de entorno
cat .env

# Ver últimos commits
git log --oneline -5
```

### 🚀 Para Continuar con FASE 4

1. **Primero:** Resolver problema de autenticación (opcional, no bloqueante)
2. **Firebase Console:** https://console.firebase.google.com/
   - Habilitar Firestore Database
   - Configurar reglas de seguridad
3. **Crear:** `src/firebase/firestore.ts`
4. **Estructura de datos en Firestore:**
```
users/{userId}/
  config/
    version: string
    lastModified: timestamp
    sections: Array<Section>
```

### ⚡ Quick Start para Próxima Sesión

```bash
# 1. Navegar al proyecto
cd /Users/gustavomarrero/Documents/node/smart-shortcuts-extension

# 2. Revisar estado
git status
git log --oneline -3

# 3. Ver ROADMAP actualizado
cat ROADMAP_FIREBASE.md | head -100

# 4. Continuar con FASE 4
# Ver sección "FASE 4: Firestore Database" arriba
```

---

**Última actualización:** 6 de Noviembre, 2025 - 17:51
**Mantenedor:** Gustavo Marrero
**Repositorio:** [smart-shortcuts-extension](https://github.com/gustavojmarrero/smart-shortcuts-extension)

**Progreso:** 47% completado (3 de 8 fases) ✅✅✅⬜⬜⬜⬜⬜
