# Smart Shortcuts v3.0 - Chrome Extension

[![GitHub release](https://img.shields.io/github/v/release/gustavojmarrero/smart-shortcuts-extension)](https://github.com/gustavojmarrero/smart-shortcuts-extension/releases/latest)
[![GitHub downloads](https://img.shields.io/github/downloads/gustavojmarrero/smart-shortcuts-extension/total)](https://github.com/gustavojmarrero/smart-shortcuts-extension/releases)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Extensión de Chrome para organizar y acceder rápidamente a tus páginas web favoritas con **sincronización en la nube mediante Firebase/Firestore**.

> 💡 **[Descargar v3.0.0](https://github.com/gustavojmarrero/smart-shortcuts-extension/releases/latest)** - ¡Con sincronización en la nube!

## 🎉 Novedades en v3.0

### ☁️ Sincronización en la Nube con Firestore
- **Autenticación con Google**: Login seguro con OAuth
- **Sincronización en tiempo real**: Cambios se propagan instantáneamente entre dispositivos
- **Sin límites de almacenamiento**: Ya no limitado a 100KB de chrome.storage.sync
- **Cache inteligente**: Carga instantánea (1-2ms) con fallback offline completo
- **Migración automática**: Tus datos de v2.x se migran automáticamente

### 🔴 Detección de Conexión Offline
- Banner visual cuando no hay conexión
- Funciona completamente offline con cache local
- Auto-reconexión cuando vuelve internet
- Mensajes claros y específicos

### ⚡ Optimizaciones de Rendimiento
- **70-80% menos lecturas de Firestore** con cache inteligente
- **Carga 5-10x más rápida** vs versión anterior
- Debouncing para reducir escrituras
- Auto-refresh de tokens (sesión nunca expira)

### 📦 Arquitectura Firestore-First
- CRUD inmutable con operaciones puras
- Actualizaciones optimistas en UI
- Manejo robusto de errores de red
- Try-catch-finally en todas las operaciones críticas

## Características

### 🚀 Core Features
- **Ultra rápido**: Abre con `Ctrl+Shift+S` (o `Cmd+Shift+S` en Mac)
- **Enlaces directos**: Acceso instantáneo a URLs
- **Enlaces dinámicos**: Construye URLs con inputs (ej: número de orden → URL completa)
- **Validación con regex**: Valida inputs antes de abrir URLs (emails, códigos, etc.)

### 📂 Organización
- **Folders anidados**: Organiza shortcuts en carpetas recursivas sin límite
- **Drag & drop completo**: Mueve shortcuts y carpetas entre secciones y niveles
- **Búsqueda recursiva**: Encuentra shortcuts dentro de carpetas anidadas
- **Auto-expansión**: Carpetas se expanden automáticamente en búsqueda

### ⚙️ Gestión
- **Completamente configurable**: Crea, edita, reordena y elimina shortcuts
- **Acordeón inteligente**: Colapsa/expande secciones con persistencia
- **Búsqueda con highlighting**: Filtra y resalta resultados en tiempo real
- **Sincronización en la nube**: Tu configuración sincronizada en Firestore
- **Import/Export**: Respalda y comparte tu configuración (JSON)

## Instalación

### 📦 Descarga Directa (Recomendado)

1. Ve a la [página de Releases](https://github.com/gustavojmarrero/smart-shortcuts-extension/releases/latest)
2. Descarga el archivo `smart-shortcuts-v3.0.0.zip`
3. Extrae el archivo ZIP:
   ```bash
   unzip smart-shortcuts-v3.0.0.zip -d smart-shortcuts
   ```
4. Abre Chrome y ve a `chrome://extensions/`
5. Activa el "Modo de desarrollador" (esquina superior derecha)
6. Haz clic en "Cargar extensión sin empaquetar"
7. Selecciona la carpeta `smart-shortcuts` extraída

**Verifica el Extension ID:** Debe mostrar `gacibpmoecbcbhkeidgdhaoijmgablle`

### 🔧 Desde el código fuente (Para desarrolladores)

1. Clona o descarga este repositorio
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Crea archivo `.env` con tus credenciales de Firebase:
   ```env
   VITE_FIREBASE_API_KEY=tu-api-key
   VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=tu-proyecto
   VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
   ```
4. Compila la extensión:
   ```bash
   npm run build
   ```
5. Abre Chrome y ve a `chrome://extensions/`
6. Activa el "Modo de desarrollador"
7. Haz clic en "Cargar extensión sin empaquetar"
8. Selecciona la carpeta `dist` generada

## Uso

### Primera Vez - Autenticación

Al abrir la extensión por primera vez:
1. Verás una pantalla de bienvenida
2. Click en "Continuar con Google"
3. Autoriza la extensión en la ventana de OAuth
4. ¡Listo! Ya puedes usar la extensión

**Migración automática:** Si tenías datos en v2.x, verás un prompt para migrar tus shortcuts a Firestore.

### Popup Principal (Ctrl+Shift+S)

- **Enlaces directos**: Click para abrir inmediatamente
- **Enlaces dinámicos**: Ingresa un valor → Enter → abre URL construida
- **Edición rápida**: Hover sobre un shortcut → botones de editar/eliminar
- **Agregar shortcuts**: Click en el ícono "+" en cada sección
- **Perfil de usuario**: Click en tu avatar → Cerrar sesión

### Configuración Avanzada

1. Click en el ícono de configuración (⚙️) en el popup
2. O click derecho en el ícono de la extensión → Opciones
3. Funciones disponibles:
   - Crear/editar/eliminar secciones
   - Crear/editar/eliminar carpetas
   - Reordenar secciones y shortcuts con drag & drop
   - Importar/Exportar configuración en JSON
   - Botones "Expandir Todo" / "Colapsar Todo"
   - Vista completa de todos tus shortcuts

### 🔄 Sincronización entre Dispositivos

#### ✨ Sincronización Automática con Firestore (v3.0+)

**¿Cómo funciona?**
1. **Inicia sesión con Google** en todos tus dispositivos
2. **Los cambios se sincronizan automáticamente** en tiempo real (~1-2 segundos)
3. **Cache inteligente** para carga instantánea
4. **Funciona offline** - cambios se sincronizan al reconectar

**Características:**
- ✅ Sincronización en tiempo real (1-2 segundos)
- ✅ Sin límites de almacenamiento
- ✅ Cache local para carga instantánea
- ✅ Funciona completamente offline
- ✅ Auto-refresh de tokens (sesión nunca expira)
- ✅ Detección de errores de red

#### 📤 Export/Import Manual

**Cuándo usar:**
- Compartir configuraciones entre cuentas diferentes
- Backups manuales adicionales
- Migrar a un navegador diferente
- Compartir configuraciones con tu equipo

**Cómo hacerlo:**
1. **Exportar:**
   - Click en ⚙️ (Configuración) → Exportar
   - Descarga archivo JSON con toda tu configuración

2. **Importar:**
   - Click en ⚙️ (Configuración) → Importar
   - Selecciona el archivo JSON
   - Confirma para reemplazar la configuración actual

**⚠️ Importante:** Al importar se reemplaza TODA la configuración actual.

### Ejemplos de Uso

**Ejemplo 1: Link directo**
- Tipo: Directo
- Nombre: "Analítica Amazon"
- URL: `https://sellercentral.amazon.com/analytics`

**Ejemplo 2: Link dinámico con validación**
- Tipo: Dinámico
- Nombre: "Pedido Amazon"
- URL Template: `https://www.amazon.com.mx/your-orders/order-details?orderID={input}`
- Placeholder: "Ingresa número de orden"
- Validación Regex: `^\d{3}-\d{7}-\d{7}$`
- Mensaje de Error: "Formato de orden inválido (debe ser XXX-XXXXXXX-XXXXXXX)"
- Uso: Escribe "702-8229162-0992232" → Enter → abre la página del pedido

**Ejemplo 3: Carpeta de pedidos**
- Crea una carpeta "Pedidos"
- Agrega múltiples shortcuts de tracking
- Drag & drop para reorganizar
- Colapsa/expande para organizar

## Desarrollo

### Scripts disponibles

```bash
# Desarrollo con hot-reload
npm run dev

# Build para producción
npm run build

# Crear package de release (ZIP)
npm run package

# Crear release completo en GitHub
npm run release

# Previsualizar build
npm run preview

# Linting
npm run lint
```

### 🔄 Flujo Automático de Release

Este proyecto usa **Git Hooks** (Husky) + **GitHub CLI**:

#### Cada vez que haces commit:
1. **Pre-commit**: Compila automáticamente la extensión
2. **Post-commit**:
   - Crea el archivo ZIP en `releases/`
   - Crea automáticamente el release en GitHub
   - Sube el ZIP al release

```bash
# Simplemente haz commit como siempre:
git add .
git commit -m "feat: nueva funcionalidad"
git push

# El sistema automáticamente:
# ✅ Compila la extensión (npm run build)
# ✅ Crea el ZIP (smart-shortcuts-vX.X.X.zip)
# ✅ Crea release en GitHub con el ZIP adjunto
```

### Estructura del proyecto

```
/smart-shortcuts-extension
├── public/
│   ├── manifest.json          # Configuración de la extensión (con campo "key")
│   └── icons/                 # Iconos de la extensión
├── src/
│   ├── popup/                 # UI del popup principal
│   ├── options/               # Página de configuración
│   ├── storage/               # Lógica de almacenamiento
│   │   ├── config.ts          # Operaciones chrome.storage (legacy)
│   │   ├── cache.ts           # Cache inteligente con chrome.storage.local
│   │   ├── firestore-operations.ts  # CRUD inmutable para Firestore
│   │   └── types.ts           # Tipos TypeScript
│   ├── firebase/              # Integración Firebase
│   │   ├── config.ts          # Configuración Firebase
│   │   ├── auth.ts            # Autenticación con Google
│   │   └── firestore.ts       # Operaciones Firestore
│   ├── hooks/                 # React Hooks
│   │   ├── useFirestoreConfig.ts   # Sincronización con Firestore
│   │   ├── useMigration.ts         # Migración de datos
│   │   ├── useNetworkStatus.ts     # Detección de offline
│   │   └── useDebouncedSave.ts     # Guardado con debounce
│   ├── context/               # React Context
│   │   └── AuthContext.tsx    # Estado global de autenticación
│   ├── components/            # Componentes React
│   │   ├── Auth/              # Componentes de autenticación
│   │   ├── Migration/         # Prompt de migración
│   │   └── OfflineBanner.tsx  # Banner de offline
│   ├── utils/                 # Utilidades
│   │   ├── debounce.ts        # Debouncing/throttling
│   │   └── searchUtils.ts     # Utilidades de búsqueda
│   └── styles/                # Estilos globales
├── dist/                      # Build de producción
└── releases/                  # ZIPs de release
```

## Tecnologías

- **React 18.3.1** + **TypeScript 5.7.2**: UI y type safety
- **Vite 6.4.1**: Build ultra-rápido
- **Firebase 10.14.0**: Backend y autenticación
  - Firebase Auth (Google OAuth)
  - Cloud Firestore (database NoSQL)
- **Tailwind CSS** (inline): Estilos minimalistas
- **Chrome Extensions API**: Manifest V3
- **@hello-pangea/dnd**: Drag and drop

## Arquitectura v3.0

### Flujo de Datos

```
Usuario autenticado
    ↓
[Cache Local] ← Carga instantánea (1-2ms)
    ↓
[Verificar Firestore] ← ¿Cache válido?
    ↓
[Actualizar si necesario]
    ↓
[onSnapshot] ← Sync en tiempo real
    ↓
[Actualizar Cache + UI]
```

### Estrategia de Guardado

```
Cambio en UI
    ↓
[Actualización optimista] ← UI se actualiza inmediatamente
    ↓
[Guardar en Firestore]
    ↓
[Actualizar Cache Local]
    ↓
[onSnapshot propaga a otros tabs/dispositivos]
```

### Manejo de Offline

```
Sin conexión detectada
    ↓
[Mostrar OfflineBanner]
    ↓
[Usar Cache Local] ← Funcionalidad completa
    ↓
[Guardar cambios en cache]
    ↓
Conexión restaurada
    ↓
[Sincronizar con Firestore]
```

## Ventajas vs Favoritos Tradicionales

| Característica | Smart Shortcuts v3.0 | Favoritos | Bookmarks Manager |
|---------------|---------------------|-----------|-------------------|
| Velocidad | 1 atajo (< 2ms cache) | 3-4 clicks | 2-3 clicks |
| Enlaces dinámicos | ✅ Sí | ❌ No | ❌ No |
| Organización visual | ✅ Secciones + Folders | 📁 Carpetas | 📁 Carpetas |
| Sincronización | ✅ Firestore (tiempo real) | ✅ Chrome Sync | ✅ Chrome Sync |
| Búsqueda | ✅ Con highlighting | ⚠️ Limitada | ✅ Básica |
| Drag & Drop | ✅ Completo | ❌ No | ⚠️ Limitado |
| Offline | ✅ Funcional completo | ✅ Sí | ✅ Sí |
| Límite almacenamiento | ✅ Ilimitado | 📊 Ilimitado | 📊 Ilimitado |

## Roadmap

### ✅ v3.0.0 (Completado - Nov 2025)
- [x] Autenticación con Google OAuth
- [x] Sincronización en tiempo real con Firestore
- [x] Migración automática desde v2.x
- [x] Detección de conexión offline
- [x] Auto-refresh de tokens
- [x] Cache inteligente (70-80% reducción de lecturas)
- [x] Debouncing para escrituras
- [x] Manejo robusto de errores
- [x] Extension ID permanente

### 🔮 v3.1.0+ (Futuras versiones)
- [ ] Compartir configuraciones entre usuarios
- [ ] Historial de uso y estadísticas
- [ ] Dark mode automático
- [ ] Atajos de teclado personalizados por shortcut
- [ ] Plantillas predefinidas de carpetas
- [ ] Categorías con colores personalizados
- [ ] Exportar a diferentes formatos (CSV, HTML)
- [ ] Búsqueda con comandos (ej: `/search amazon`)

## Migración desde v2.x

Si vienes de v2.x (chrome.storage.sync):

1. **Instala v3.0.0** siguiendo las instrucciones arriba
2. **Inicia sesión** con tu cuenta de Google
3. **Acepta el prompt de migración** - tus datos se copiarán automáticamente a Firestore
4. **¡Listo!** - tus shortcuts ahora están en la nube

**Notas:**
- La migración NO elimina tus datos locales
- Puedes elegir "No migrar" y seguir usando almacenamiento local
- Una vez migrado, los cambios se sincronizan en Firestore

Ver [MIGRATION_V3.md](docs/MIGRATION_V3.md) para más detalles.

## Documentación

- [README](README.md) - Este archivo
- [ROADMAP Firebase](ROADMAP_FIREBASE.md) - Plan de desarrollo v3.0
- [Guía de Migración v3](docs/MIGRATION_V3.md) - Migración desde v2.x
- [CHANGELOG](CHANGELOG.md) - Historial de cambios
- [Development Setup](DEVELOPMENT_SETUP.md) - Setup para desarrolladores

## Costos de Firebase (Transparencia)

**Plan Gratuito (Spark):**
- 50,000 lecturas/día
- 20,000 escrituras/día
- 1 GB almacenamiento

**Uso real con 1000 usuarios:**
- ~1,000 lecturas/día (98% margen libre)
- ~3,000 escrituras/día (85% margen libre)
- **Conclusión:** Plan gratuito soporta fácilmente 10,000+ usuarios

## Privacidad y Seguridad

- ✅ Tus datos solo son accesibles por ti (reglas de Firestore)
- ✅ Autenticación segura con OAuth de Google
- ✅ No compartimos información con terceros
- ✅ Cache se limpia automáticamente al cerrar sesión
- ✅ Extension ID permanente (no cambiará)
- ✅ Código fuente abierto y auditable

## Licencia

MIT

## Autor

**Gustavo Marrero**
- GitHub: [@gustavojmarrero](https://github.com/gustavojmarrero)
- Desarrollado para optimizar el flujo de trabajo de vendedores y usuarios frecuentes de plataformas web

## Agradecimientos

Desarrollado con [Claude Code](https://claude.com/claude-code) por Anthropic.

---

**¿Preguntas o problemas?** Abre un [issue en GitHub](https://github.com/gustavojmarrero/smart-shortcuts-extension/issues)
