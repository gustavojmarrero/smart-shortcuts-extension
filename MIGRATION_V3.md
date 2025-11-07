# Guía de Migración a Smart Shortcuts v3.0

## Tabla de Contenidos
- [¿Qué hay de nuevo en v3.0?](#qué-hay-de-nuevo-en-v30)
- [¿Por qué migrar?](#por-qué-migrar)
- [¿Qué sucede con mis datos?](#qué-sucede-con-mis-datos)
- [Proceso de Migración](#proceso-de-migración)
- [Preguntas Frecuentes](#preguntas-frecuentes)
- [Solución de Problemas](#solución-de-problemas)
- [Comparación v2.x vs v3.0](#comparación-v2x-vs-v30)

---

## ¿Qué hay de nuevo en v3.0?

Smart Shortcuts v3.0 introduce **sincronización en la nube con Firebase**, permitiendo:

### Nuevas Características

- **☁️ Sincronización Multi-dispositivo**: Accede a tus shortcuts desde cualquier navegador
- **🔄 Sincronización en Tiempo Real**: Los cambios se propagan instantáneamente a todos tus dispositivos
- **👤 Autenticación con Google**: Inicia sesión con tu cuenta de Google
- **📱 Sin límites de almacenamiento**: chrome.storage.sync tiene límite de 100KB, Firestore es prácticamente ilimitado
- **🔒 Privacidad**: Tus datos se almacenan de forma segura y solo tú tienes acceso
- **💾 Cache Inteligente**: Carga instantánea (1-2ms) con cache local
- **🌐 Modo Offline**: Funciona sin conexión, sincroniza automáticamente al reconectar
- **♻️ Auto-refresh de tokens**: Tu sesión permanece activa mientras uses la extensión
- **🎨 Interfaz mejorada**: Nuevo panel de perfil y configuración

### Cambios Técnicos

| Aspecto | v2.x | v3.0 |
|---------|------|------|
| **Almacenamiento** | chrome.storage.sync (local) | Firebase Firestore (nube) |
| **Límite de datos** | 100KB máximo | Prácticamente ilimitado |
| **Sincronización** | Solo entre Chrome del mismo navegador | Entre cualquier dispositivo |
| **Autenticación** | No requerida | Google OAuth |
| **Tiempo de carga** | 50-200ms | 1-2ms (con cache) |
| **Offline** | Siempre disponible | Disponible con cache |
| **Multi-dispositivo** | No soportado | ✅ Soportado |

---

## ¿Por qué migrar?

### Beneficios

1. **Libertad de dispositivos**: Trabaja desde casa, oficina, laptop, cualquier Chrome
2. **Respaldo automático**: Tus datos están seguros en la nube
3. **Sin límites**: Crea tantos shortcuts como necesites
4. **Colaboración futura**: Base para features colaborativos (compartir carpetas, equipos, etc.)
5. **Rendimiento**: Carga instantánea con cache inteligente
6. **Confiabilidad**: Firestore es altamente disponible y escalable

### ¿Debo migrar?

**Migra si:**
- ✅ Usas Chrome en múltiples computadoras
- ✅ Quieres respaldo automático en la nube
- ✅ Necesitas más de 100KB de almacenamiento
- ✅ Valoras sincronización en tiempo real

**Puedes esperar si:**
- ⏸️ Solo usas un dispositivo y no necesitas sincronización
- ⏸️ Prefieres almacenamiento completamente local
- ⏸️ No tienes cuenta de Google (próximamente más opciones de autenticación)

> **Nota**: v2.x seguirá funcionando, pero no recibirá nuevas características. La migración es **opcional** pero **recomendada**.

---

## ¿Qué sucede con mis datos?

### Durante la Migración

1. **Tus datos v2.x NO se eliminan**: Permanecen en `chrome.storage.sync`
2. **Se COPIAN a Firestore**: No se mueven, se duplican
3. **Puedes revertir**: Si algo sale mal, tus datos originales están intactos
4. **Sin pérdida de información**: Todos los shortcuts, carpetas y estructura se preservan

### Después de la Migración

- **chrome.storage.sync**: Ya no se usa para nuevos cambios, pero permanece como respaldo
- **Firestore**: Se convierte en la fuente principal de datos
- **Cache local**: Se crea en `chrome.storage.local` para carga rápida

### Diagrama de Flujo de Datos

```
ANTES (v2.x):
┌─────────────────────┐
│ chrome.storage.sync │ ← ÚNICA fuente de datos
└─────────────────────┘

DURANTE MIGRACIÓN:
┌─────────────────────┐
│ chrome.storage.sync │ ← Datos originales (intactos)
└─────────────────────┘
           │
           ▼ COPIA
┌─────────────────────┐
│     Firestore       │ ← Nuevos datos en la nube
└─────────────────────┘

DESPUÉS (v3.0):
┌─────────────────────┐
│ chrome.storage.sync │ ← Backup (no se modifica)
└─────────────────────┘

┌─────────────────────┐
│     Firestore       │ ← FUENTE PRINCIPAL
└─────────────────────┘
           │
           ▼ cache
┌─────────────────────┐
│chrome.storage.local │ ← Cache (carga rápida)
└─────────────────────┘
```

---

## Proceso de Migración

### Opción 1: Migración Automática (Recomendado)

1. **Actualiza la extensión** a v3.0.0
2. **Abre Smart Shortcuts** (click en el ícono o `Ctrl+Shift+S` / `Cmd+Shift+S`)
3. **Verás la pantalla de migración**:
   ```
   ┌─────────────────────────────────────┐
   │  🚀 Actualización a v3.0            │
   │                                     │
   │  Sincroniza tus shortcuts en la     │
   │  nube con Firebase                  │
   │                                     │
   │  [Iniciar sesión con Google]        │
   │  [Saltar migración]                 │
   │  [No volver a preguntar]            │
   └─────────────────────────────────────┘
   ```
4. **Haz click en "Iniciar sesión con Google"**
5. **Autoriza la aplicación** en la ventana de Google OAuth
6. **Espera la migración automática**:
   ```
   ┌─────────────────────────────────────┐
   │  ⏳ Migrando datos...                │
   │                                     │
   │  📦 12 shortcuts encontrados        │
   │  📁 3 carpetas encontradas          │
   │                                     │
   │  ▓▓▓▓▓▓▓▓▓▓░░░░░░ 75%             │
   └─────────────────────────────────────┘
   ```
7. **¡Listo!** Tus datos están sincronizados

### Opción 2: Migración Manual

Si prefieres controlar el proceso:

1. **Exporta tus datos v2.x** (desde Opciones > Exportar/Importar)
2. **Actualiza a v3.0**
3. **Inicia sesión con Google**
4. **Importa tus datos** (desde Opciones > Exportar/Importar)

### Opción 3: Empezar de Cero

Si quieres configurar todo desde cero en v3.0:

1. **Exporta tus datos v2.x** como respaldo (opcional pero recomendado)
2. **Actualiza a v3.0**
3. **Inicia sesión con Google**
4. **Haz click en "No volver a preguntar"** en el diálogo de migración
5. **Crea tus shortcuts nuevamente**

---

## Preguntas Frecuentes

### ¿Necesito una cuenta de Google?

**Sí**, por ahora v3.0 solo soporta autenticación con Google. Próximamente:
- Autenticación con GitHub
- Autenticación anónima
- Autenticación con email/contraseña

### ¿Puedo usar v3.0 sin internet?

**Sí**, v3.0 funciona completamente offline gracias al cache local:
- Tus shortcuts se cargan instantáneamente desde cache
- Puedes crear, editar y eliminar shortcuts offline
- Los cambios se sincronizarán automáticamente cuando vuelvas online
- Verás un banner amarillo indicando "Sin conexión - Mostrando datos en caché"

### ¿Qué pasa si no migro?

- Tus datos permanecen en `chrome.storage.sync`
- Puedes seguir usando la extensión normalmente en ese dispositivo
- **NO tendrás**:
  - Sincronización multi-dispositivo
  - Respaldo en la nube
  - Nuevas características de v3.0
  - Soporte para más de 100KB de datos

### ¿Puedo revertir a v2.x?

**Sí**, en cualquier momento:

1. **Opción A**: Desinstala v3.0 e instala v2.x desde releases antiguos
2. **Opción B**: Tus datos v2.x siguen en `chrome.storage.sync`, solo cierra sesión en v3.0

> **Nota**: Cambios hechos en v3.0 **después** de migrar no se sincronizarán de vuelta a `chrome.storage.sync`.

### ¿Los datos están seguros en Firebase?

**Sí**, tus datos están protegidos:

- **Autenticación requerida**: Solo tú (con tu cuenta de Google) puedes acceder
- **Reglas de seguridad Firestore**: Cada usuario solo puede leer/escribir sus propios datos
- **Encriptación en tránsito**: Todas las comunicaciones usan HTTPS
- **Encriptación en reposo**: Firestore encripta datos automáticamente
- **No compartimos datos**: Ver [Política de Privacidad](PRIVACY.md)

### ¿Cuánto cuesta Firebase?

**Gratis** para uso normal:

- **Plan gratuito**: 50,000 lecturas/día, 20,000 escrituras/día, 1GB almacenamiento
- **Uso típico por usuario**: ~100 lecturas/día, ~20 escrituras/día, <1MB almacenamiento
- **Monitoreo**: Puedes ver tu uso en Firebase Console

Ver [README.md - Costos y Límites](README.md#costos-y-límites) para más detalles.

### ¿Puedo sincronizar entre Chrome y Firefox?

**No**, por ahora Smart Shortcuts solo funciona en Chrome/Chromium. Razones técnicas:
- Usa Chrome Extension Manifest V3
- Usa `chrome.identity` API (específica de Chrome)
- Firestore Web SDK funciona en Chrome pero necesitamos adaptar la extensión para Firefox

**Futuro**: Soporte para Firefox está en el roadmap.

### ¿Qué pasa si elimino la extensión?

- **Datos en Firestore**: Permanecen en tu cuenta, no se eliminan
- **Cache local**: Se elimina (está en Chrome)
- **Reinstalar**: Al instalar de nuevo e iniciar sesión, tus datos se restauran automáticamente

### ¿Puedo tener múltiples cuentas?

**Sí**, pero no simultáneamente:
- Cierra sesión de la cuenta actual
- Inicia sesión con otra cuenta de Google
- Tus datos de cada cuenta son completamente independientes

---

## Solución de Problemas

### La migración falla con "Error de autenticación"

**Causa**: Problema con OAuth de Google

**Solución**:
1. Verifica que tengas internet
2. Intenta cerrar sesión e iniciar de nuevo
3. Limpia cookies de `accounts.google.com`
4. Desactiva extensiones que puedan bloquear popups
5. Si persiste, reporta el issue en GitHub

### Mis shortcuts aparecen duplicados

**Causa**: Migración ejecutada múltiples veces

**Solución**:
1. Ve a Opciones
2. Elimina los shortcuts duplicados manualmente
3. O exporta tus datos, cierra sesión, elimina todo en Firestore, e importa

### La extensión está muy lenta

**Causa**: Cache no está funcionando correctamente

**Solución**:
1. Abre DevTools (F12) en la extensión
2. Ve a Console y busca logs de `[CACHE]`
3. Deberías ver `✅ [CACHE] Config cargada desde cache local`
4. Si no, reporta el issue con los logs

### "Sin conexión" aunque tengo internet

**Causa**: Problema con Firestore o firewall

**Solución**:
1. Verifica que `*.googleapis.com` no esté bloqueado
2. Verifica que `*.firebaseio.com` no esté bloqueado
3. Intenta en otra red (WiFi/datos móviles)
4. Revisa si tu empresa tiene firewall que bloquea Firebase

### Los cambios no se sincronizan entre dispositivos

**Causa**: No estás usando la misma cuenta o hay problema de sincronización

**Solución**:
1. Verifica que iniciaste sesión con la **misma cuenta de Google** en ambos dispositivos
2. Haz un cambio y espera 2-3 segundos
3. En el otro dispositivo, abre DevTools y busca logs `🔄 [useFirestoreConfig] Config actualizada desde servidor`
4. Si no ves ese log, reporta el issue

### "Error de permisos" al guardar

**Causa**: Reglas de seguridad de Firestore están bloqueando la escritura

**Solución**:
1. Verifica que estás autenticado (deberías ver tu email en la extensión)
2. Intenta cerrar sesión e iniciar de nuevo
3. Si persiste, puede ser un bug - reporta en GitHub

### Datos perdidos después de migrar

**Causa**: MUY RARO - error en migración

**Solución**:
1. **NO CIERRES SESIÓN AÚN**
2. Exporta tus datos inmediatamente (Opciones > Exportar)
3. Tus datos v2.x deberían seguir en `chrome.storage.sync`
4. Reporta el issue en GitHub con detalles
5. Para recuperar: importa el archivo exportado

---

## Comparación v2.x vs v3.0

### Características

| Característica | v2.x | v3.0 |
|----------------|------|------|
| **Shortcuts ilimitados** | ✅ (hasta 100KB) | ✅ (sin límite práctico) |
| **Carpetas anidadas** | ✅ | ✅ |
| **Variables dinámicas** | ✅ | ✅ |
| **Drag & Drop** | ✅ | ✅ |
| **Búsqueda rápida** | ✅ | ✅ |
| **Exportar/Importar** | ✅ | ✅ |
| **Sincronización multi-dispositivo** | ❌ | ✅ |
| **Autenticación** | ❌ | ✅ (Google) |
| **Tiempo real** | ❌ | ✅ |
| **Respaldo en nube** | ❌ | ✅ |
| **Cache inteligente** | ❌ | ✅ |
| **Modo offline** | ✅ | ✅ |
| **Auto-refresh tokens** | N/A | ✅ |

### Rendimiento

| Métrica | v2.x | v3.0 (Primera carga) | v3.0 (Con cache) |
|---------|------|---------------------|------------------|
| **Tiempo de carga** | 50-200ms | 100-500ms | **1-2ms** |
| **Tiempo de guardado** | 10-50ms | 50-150ms | 50-150ms + cache |
| **Lecturas Firestore/día** | N/A | 0 (con cache) | 0 (con cache) |
| **Escrituras Firestore/día** | N/A | ~20-50 | ~20-50 |

### Almacenamiento

| Aspecto | v2.x | v3.0 |
|---------|------|------|
| **Ubicación** | chrome.storage.sync | Firebase Firestore |
| **Límite de tamaño** | 100KB total | 1MB/documento (prácticamente ilimitado) |
| **Límite de items** | 512 items | Ilimitado |
| **Persistencia** | Local Chrome | Nube (multi-dispositivo) |
| **Backup** | Manual (exportar) | Automático |

### Privacidad

| Aspecto | v2.x | v3.0 |
|---------|------|------|
| **Almacenamiento local** | ✅ 100% local | ⚠️ Nube + cache local |
| **Requiere cuenta** | ❌ | ✅ Google |
| **Datos compartidos** | ❌ | ❌ (solo tú) |
| **Encriptación** | Chrome maneja | HTTPS + Firestore |
| **Rastreo/Analytics** | ❌ | ❌ |
| **Código abierto** | ✅ | ✅ |

---

## Soporte

¿Necesitas ayuda con la migración?

- **GitHub Issues**: [github.com/gustavojmarrero/smart-shortcuts-extension/issues](https://github.com/gustavojmarrero/smart-shortcuts-extension/issues)
- **Documentación**: [README.md](README.md)
- **Roadmap**: [ROADMAP_FIREBASE.md](ROADMAP_FIREBASE.md)

---

## Changelog

Ver [CHANGELOG.md](CHANGELOG.md) para detalles completos de todos los cambios en v3.0.0.
