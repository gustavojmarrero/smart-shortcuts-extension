# Smart Shortcuts - Chrome Extension

Extensión de Chrome para organizar y acceder rápidamente a tus páginas web favoritas con accesos directos inteligentes.

## Características

- 🚀 **Ultra rápido**: Abre con `Ctrl+Shift+S` (o `Cmd+Shift+S` en Mac)
- 🎯 **Enlaces directos**: Acceso instantáneo a URLs
- ⚡ **Enlaces dinámicos**: Construye URLs con inputs (ej: número de orden → URL completa)
- 📂 **Organización por secciones**: Amazon, Mercadolibre, Planillas, etc.
- ⚙️ **Completamente configurable**: Crea, edita, reordena y elimina shortcuts
- 💾 **Sincronización**: Tu configuración se sincroniza entre dispositivos
- 📤 **Import/Export**: Respalda y comparte tu configuración

## Instalación

### Desde el código fuente

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

**Ejemplo 2: Link dinámico**
- Tipo: Dinámico
- Nombre: "Pedido Amazon"
- URL Template: `https://www.amazon.com.mx/your-orders/order-details?orderID={input}`
- Placeholder: "Ingresa número de orden"
- Uso: Escribe "702-8229162-0992232" → Enter → abre la página del pedido

## Desarrollo

### Scripts disponibles

```bash
# Desarrollo con hot-reload
npm run dev

# Build para producción
npm run build

# Previsualizar build
npm run preview

# Linting
npm run lint
```

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

- [ ] Búsqueda rápida (Ctrl+F)
- [ ] Historial de uso
- [ ] Validación de inputs con regex
- [ ] Dark mode
- [ ] Atajos de teclado personalizados
- [ ] Drag & drop nativo
- [ ] Estadísticas de uso

## Licencia

MIT

## Autor

Desarrollado para optimizar el flujo de trabajo de vendedores y usuarios frecuentes de plataformas web.
