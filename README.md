# Smart Shortcuts - Chrome Extension

[![GitHub release](https://img.shields.io/github/v/release/YOUR_USERNAME/shortcuts)](https://github.com/YOUR_USERNAME/shortcuts/releases/latest)
[![GitHub downloads](https://img.shields.io/github/downloads/YOUR_USERNAME/shortcuts/total)](https://github.com/YOUR_USERNAME/shortcuts/releases)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Extensión de Chrome para organizar y acceder rápidamente a tus páginas web favoritas con accesos directos inteligentes.

> 💡 **[Descargar la última versión (v2.1.0)](https://github.com/YOUR_USERNAME/shortcuts/releases/latest)** - ¡Sin compilar, lista para usar!

## Características

### 🚀 Core Features
- **Ultra rápido**: Abre con `Ctrl+Shift+S` (o `Cmd+Shift+S` en Mac)
- **Enlaces directos**: Acceso instantáneo a URLs
- **Enlaces dinámicos**: Construye URLs con inputs (ej: número de orden → URL completa)
- **Validación con regex**: Valida inputs antes de abrir URLs (emails, códigos, etc.)

### 📂 v2.1.0 - Folders & Drag & Drop
- **Folders anidados**: Organiza shortcuts en carpetas recursivas sin límite
- **Drag & drop completo**: Mueve shortcuts y carpetas entre secciones y niveles
- **Búsqueda recursiva**: Encuentra shortcuts dentro de carpetas anidadas
- **Auto-expansión**: Carpetas se expanden automáticamente en búsqueda

### ⚙️ Gestión
- **Completamente configurable**: Crea, edita, reordena y elimina shortcuts
- **Acordeón inteligente**: Colapsa/expande secciones con persistencia
- **Búsqueda con highlighting**: Filtra y resalta resultados en tiempo real
- **Sincronización**: Tu configuración se sincroniza entre dispositivos
- **Import/Export**: Respalda y comparte tu configuración

## Instalación

### 📦 Descarga Directa (Recomendado)

1. Ve a la [página de Releases](https://github.com/YOUR_USERNAME/shortcuts/releases/latest)
2. Descarga el archivo `smart-shortcuts-v2.1.0.zip`
3. Descomprime el archivo ZIP
4. Abre Chrome y ve a `chrome://extensions/`
5. Activa el "Modo de desarrollador" (esquina superior derecha)
6. Haz clic en "Cargar extensión sin empaquetar"
7. Selecciona la carpeta descomprimida

### 🔧 Desde el código fuente (Para desarrolladores)

1. Clona o descarga este repositorio
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Compila la extensión:
   ```bash
   npm run build
   ```
4. Abre Chrome y ve a `chrome://extensions/`
5. Activa el "Modo de desarrollador" (esquina superior derecha)
6. Haz clic en "Cargar extensión sin empaquetar"
7. Selecciona la carpeta `dist` generada

## Uso

### Popup Principal (Ctrl+Shift+S)

- **Enlaces directos**: Click para abrir inmediatamente
- **Enlaces dinámicos**: Ingresa un valor → Enter → abre URL construida
- **Edición rápida**: Hover sobre un shortcut → botones de editar/eliminar
- **Agregar shortcuts**: Click en el ícono "+" en cada sección

### Configuración Avanzada

1. Click en el ícono de configuración (⚙️) en el popup
2. O click derecho en el ícono de la extensión → Opciones
3. Funciones disponibles:
   - Crear/editar/eliminar secciones
   - Reordenar secciones y shortcuts con los botones de flechas
   - Importar/Exportar configuración en JSON
   - Vista completa de todos tus shortcuts

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
- Si escribes un formato incorrecto, muestra error y no abre la URL

## Desarrollo

### Scripts disponibles

```bash
# Desarrollo con hot-reload
npm run dev

# Build para producción
npm run build

# Crear package de release (ZIP)
npm run package

# Previsualizar build
npm run preview

# Linting
npm run lint
```

### 🔄 Flujo Automático de Release

Este proyecto usa **Git Hooks** (Husky) para automatizar el proceso de release:

#### Cada vez que haces commit:
1. **Pre-commit**: Compila automáticamente la extensión
2. **Post-commit**: Crea el archivo ZIP en `releases/`

```bash
# Simplemente haz commit como siempre:
git add .
git commit -m "feat: nueva funcionalidad"

# El sistema automáticamente:
# ✅ Compila la extensión (npm run build)
# ✅ Crea el ZIP actualizado (smart-shortcuts-vX.X.X.zip)
```

#### Publicar Release en GitHub:
1. El ZIP ya está creado en `releases/`
2. Ve a GitHub → Releases → Create new release
3. Sube el ZIP generado
4. Publica

**Nota**: Los archivos ZIP se excluyen del repositorio (.gitignore) y se suben manualmente a GitHub Releases.

### Estructura del proyecto

```
/shortcuts
├── public/
│   ├── manifest.json       # Configuración de la extensión
│   └── icons/              # Iconos de la extensión
├── src/
│   ├── popup/              # UI del popup principal
│   ├── options/            # Página de configuración
│   ├── storage/            # Lógica de almacenamiento
│   ├── utils/              # Utilidades
│   └── styles/             # Estilos globales
└── dist/                   # Build de producción
```

## Tecnologías

- **React** + **TypeScript**: UI y type safety
- **Vite**: Build ultra-rápido
- **Tailwind CSS**: Estilos minimalistas
- **Chrome Extensions API**: Manifest V3
- **chrome.storage.sync**: Sincronización entre dispositivos

## Ventajas vs Favoritos Tradicionales

| Característica | Smart Shortcuts | Favoritos |
|---------------|-----------------|-----------|
| Velocidad | 1 atajo (< 100ms) | 3-4 clicks |
| Enlaces dinámicos | ✅ Sí | ❌ No |
| Organización visual | ✅ Secciones | 📁 Carpetas |
| Sincronización | ✅ Automática | ✅ Automática |
| Búsqueda | ✅ En desarrollo | ⚠️ Limitada |

## Roadmap

### ✅ v2.1.0 (Completado)
- [x] Búsqueda rápida con highlighting
- [x] Folders anidados con soporte recursivo ilimitado
- [x] Validación de inputs con regex
- [x] Drag & drop completo entre secciones y carpetas
- [x] Sistema de release automatizado con Husky

### 🔮 v2.2.0+ (Próximas versiones)
- [ ] Persistencia de estado de expansión de carpetas
- [ ] Historial de uso
- [ ] Dark mode
- [ ] Atajos de teclado personalizados por shortcut
- [ ] Estadísticas de uso por carpeta
- [ ] Plantillas predefinidas de carpetas

## Licencia

MIT

## Autor

Desarrollado para optimizar el flujo de trabajo de vendedores y usuarios frecuentes de plataformas web.
