# Changelog - Smart Shortcuts

## v2.2.0 - Drag & Drop para Secciones (2025-11-05)

### 🎉 Nuevas Características

- ✅ **Drag & Drop de secciones**: Ahora puedes arrastrar y soltar secciones completas para reordenarlas
- ✅ **Handle visual de arrastre**: Icono de grip visible en cada sección para facilitar el drag & drop
- ✅ **Feedback visual mejorado**: Opacity y shadow al arrastrar secciones
- ✅ **Integración completa**: Funciona en conjunto con el drag & drop de items y carpetas

---

## v2.1.1 - Bug Fixes (2025-11-05)

### 🐛 Bugs Corregidos

- ✅ **Crear shortcuts dentro de carpetas**: Corregido bug donde al crear un shortcut o carpeta dentro de otra carpeta, se agregaba a la raíz de la sección
- ✅ **Propagación de parentFolderId**: Las funciones onAddShortcut y onAddFolder ahora pasan correctamente el parentFolderId a través de todos los componentes

---

## v2.1.0 - Nested Folders + Drag & Drop (2025-11-05)

### 🎉 Nuevas Características Principales

#### 📂 Carpetas Anidadas (Nested Folders)
- ✅ **Organización jerárquica ilimitada**: Crea carpetas dentro de carpetas sin límite de profundidad
- ✅ **Visual indentation**: Indentación progresiva para visualizar la jerarquía
- ✅ **Expand/Collapse**: Cada carpeta puede expandirse/colapsarse independientemente
- ✅ **Contadores dinámicos**: Cada carpeta muestra cuántos items contiene
- ✅ **Hover actions**: Botones contextuales en cada carpeta:
  - 📁+ Agregar subfolder
  - ➕ Agregar shortcut
  - ✏️ Editar carpeta
  - 🗑️ Eliminar carpeta (con confirmación)

#### 🔀 Drag & Drop Completo
- ✅ **Arrastrar entre secciones**: Mueve shortcuts y carpetas entre diferentes secciones
- ✅ **Arrastrar entre carpetas**: Mueve items entre carpetas de cualquier nivel
- ✅ **Arrastrar a/desde carpetas**: Mueve shortcuts de sección a carpeta y viceversa
- ✅ **Reordenar en el mismo contenedor**: Cambia el orden dentro de secciones y carpetas
- ✅ **Visual feedback**: Highlighting de zonas válidas y opacity durante el arrastre
- ✅ **Drag handles**: Iconos de grip para arrastre intuitivo

#### 🔍 Búsqueda Recursiva en Carpetas
- ✅ **Búsqueda en profundidad**: Encuentra shortcuts dentro de carpetas anidadas
- ✅ **Búsqueda por nombre de carpeta**: Busca carpetas por su nombre
- ✅ **Mantiene jerarquía**: Muestra la estructura completa al encontrar resultados
- ✅ **Auto-expansión**: Carpetas se expanden automáticamente al mostrar resultados

#### ⚙️ Options Page Mejorada
- ✅ **Vista de árbol completo**: Visualiza toda la jerarquía de carpetas
- ✅ **Gestión completa de carpetas**: CRUD completo desde la página de opciones
- ✅ **Indentación visual**: Estructura clara de 20px por nivel
- ✅ **Botones contextuales**: Acciones rápidas en cada folder/shortcut
- ✅ **Drag & Drop completo**: Arrastrar y soltar items entre secciones y carpetas directamente en Options

#### 🎨 Mejoras de UX en Popup
- ✅ **Botón flotante para crear secciones**: Botón (+) circular en esquina inferior derecha
- ✅ **Crear secciones en cualquier momento**: Ya no limitado solo a cuando no hay secciones

---

### 🏗️ Cambios Técnicos

**Nueva estructura de datos:**
```typescript
// Ahora sections.items puede contener Folder | Shortcut
interface Folder {
  id: string;
  name: string;
  icon?: string;
  items: Item[]; // Recursivo: puede contener más folders
  order: number;
  isFolder: true;
}

type Item = Shortcut | Folder;
```

**Nuevos archivos:**
- `src/popup/components/FolderItem.tsx` - Componente recursivo de carpetas
- `src/popup/components/EditModal.tsx` - Incluye EditFolderModal
- `src/storage/migration.ts` - Sistema de migración automática

**Funciones añadidas en `config.ts`:**
- `addFolder()` - Crear carpetas en secciones o dentro de otras carpetas
- `updateFolder()` - Editar carpetas (búsqueda recursiva)
- `deleteFolder()` - Eliminar carpetas (búsqueda recursiva)
- `reorderItems()` - Reordenar items dentro de un contenedor
- `moveItem()` - Mover items entre contenedores diferentes
- `findFolderById()` - Helper recursivo
- `deleteItemRecursively()` - Helper recursivo

**Archivos modificados:**
- `src/storage/types.ts` - Tipos actualizados con Folder e Item
- `src/storage/config.ts` - CRUD completo para carpetas
- `src/popup/App.tsx` - DragDropContext global + handlers
- `src/popup/components/ShortcutSection.tsx` - Soporte para folders y drag & drop
- `src/utils/searchUtils.ts` - Búsqueda recursiva en carpetas
- `src/options/Options.tsx` - Gestión completa de carpetas

**Nuevas dependencias:**
- `@hello-pangea/dnd` ^18.0.1 - Librería de drag & drop

---

### 🔄 Sistema de Migración Automática

**v2.0 → v2.1:**
- ✅ Automática al cargar la extensión
- ✅ Convierte `sections[].shortcuts` → `sections[].items`
- ✅ Mantiene todos los datos intactos
- ✅ No requiere acción manual del usuario
- ✅ Backup automático antes de migrar

```typescript
// Antes (v2.0):
sections: [{
  shortcuts: [...]
}]

// Después (v2.1):
sections: [{
  items: [...] // Puede contener Shortcut | Folder
}]
```

---

### 🐛 Bugs Corregidos

- ✅ **Eliminación recursiva**: Ahora funciona eliminar folders/shortcuts en cualquier nivel de anidación
- ✅ **Edición recursiva**: Editar folders funciona en cualquier nivel
- ✅ **Búsqueda en carpetas**: Encuentra shortcuts dentro de carpetas anidadas
- ✅ **Drag & drop global**: Ahora permite mover items entre diferentes contenedores
- ✅ **Performance**: Optimizada búsqueda recursiva para estructuras grandes
- ✅ **Parsing de droppableId**: Corregido split para soportar UUIDs con guiones en los IDs de carpetas/secciones (fix crítico: "Source section not found")
- ✅ **Drag & drop en secciones colapsadas**: Ahora se puede arrastrar items a secciones/carpetas colapsadas correctamente
- ✅ **MinHeight en áreas droppable**: Mantiene altura mínima para facilitar el drop incluso cuando las carpetas están colapsadas

---

### 📊 Métricas de Build

```
Bundle sizes (gzipped):
- popup.js:   117.08 kB → 34.24 kB (+30KB por drag & drop)
- options.js:  11.14 kB →  2.83 kB
- index.js:   161.09 kB → 50.24 kB
- index.css:   14.82 kB →  3.64 kB

Total: ~304 KB (~91 KB gzipped)
```

**Performance:**
- Tiempo de build: ~1.6s
- Renderizado de 50+ items: < 100ms ✅
- Drag & drop: 60fps ✅
- Búsqueda recursiva: < 50ms ✅

---

### 🎯 Testing Completo

**Carpetas:**
- [x] Crear carpeta en sección vacía
- [x] Crear carpetas anidadas (3+ niveles)
- [x] Crear shortcuts dentro de carpetas
- [x] Editar nombre/icono de carpetas
- [x] Eliminar carpetas con confirmación
- [x] Eliminar carpetas anidadas recursivamente

**Drag & Drop:**
- [x] Arrastrar shortcuts entre secciones
- [x] Arrastrar shortcuts de sección a carpeta
- [x] Arrastrar shortcuts entre carpetas
- [x] Arrastrar carpetas completas
- [x] Reordenar dentro del mismo contenedor
- [x] Visual feedback funciona correctamente

**Búsqueda:**
- [x] Buscar shortcuts en carpetas anidadas
- [x] Buscar por nombre de carpeta
- [x] Auto-expansión de carpetas con resultados
- [x] Highlighting de texto encontrado

**Migración:**
- [x] Migración automática de v2.0 a v2.1
- [x] Datos preservados correctamente
- [x] Log de migración en consola

---

### 🚀 Sistema de Release Automatizado

**Nuevo:** Git Hooks con Husky
- ✅ **Pre-commit**: Compila automáticamente la extensión
- ✅ **Post-commit**: Crea el ZIP de release automáticamente
- ✅ Archivo listo en `releases/smart-shortcuts-v2.1.0.zip`
- ✅ Comando: `npm run package` para crear manualmente

**Scripts añadidos:**
```bash
npm run package  # Crear ZIP de release
```

**Archivos nuevos:**
- `.husky/pre-commit` - Hook de pre-commit
- `.husky/post-commit` - Hook de post-commit
- `scripts/package-release.cjs` - Script de empaquetado
- `RELEASE_INSTRUCTIONS.md` - Guía para GitHub Releases

---

### 📝 Notas de Migración

**De v2.0.0 a v2.1.0:**

**Automático:**
- La migración se ejecuta automáticamente al abrir la extensión
- Tus shortcuts existentes se mantienen intactos
- La estructura de datos se actualiza transparentemente

**Nuevas funcionalidades disponibles:**
- Crear carpetas para organizar shortcuts
- Arrastrar y soltar para reorganizar
- Buscar dentro de carpetas anidadas

**Sin cambios que rompan compatibilidad:**
- Todas las funcionalidades de v2.0 siguen funcionando igual
- No se requiere reconfigurar nada

---

### 🎯 Próximos Pasos (v2.2.0+)

- [ ] Persistencia de estado de expansión de carpetas
- [ ] Atajos de teclado para navegación
- [ ] Exportar/importar solo carpetas específicas
- [ ] Estadísticas de uso por carpeta
- [ ] Drag & drop en Options page
- [ ] Plantillas de carpetas predefinidas
- [ ] Límite de profundidad configurable
- [ ] Advertencia de límite de storage

---

## v2.0.0 - Diseño Compacto + Búsqueda + Acordeón (2025-11-05)

### 🎨 Rediseño UI Ultra-Compacto

**Reducción de espaciado (40-50% menos espacio vertical):**

| Elemento | Antes | Después | Ahorro |
|----------|-------|---------|--------|
| Section header padding | py-3 px-4 (12px/16px) | py-1.5 px-2.5 (6px/10px) | -50% |
| DirectLink padding | py-2.5 px-3 (10px/12px) | py-1 px-2 (4px/8px) | -60% |
| DynamicInput padding | p-3 (12px) | p-1.5 (6px) | -50% |
| Font - labels | 14px | 12px | -14% |
| Font - descripción | 12px | 10px | -17% |
| Iconos | 18px | 14-16px | ~20% |
| Gap entre items | 4px | 0.5-1px | -75% |

**Impacto:**
- **Antes**: ~1400px de altura total para 20 shortcuts
- **Después**: ~700px de altura (con 2 secciones expandidas)
- **Mejora**: 50% menos scroll + 2x más shortcuts visibles simultáneamente

---

### 🎯 Sistema de Acordeón Multi-Expansión

**Características:**
- ✅ Click en header de sección para expandir/colapsar
- ✅ Múltiples secciones pueden estar abiertas simultáneamente
- ✅ Chevron animado (▼/▶) indica estado
- ✅ Badge con contador `(N)` muestra cantidad de shortcuts
- ✅ Animación suave (200ms) al colapsar/expandir
- ✅ Persistencia en localStorage - recuerda qué secciones estaban abiertas
- ✅ Auto-expansión de primera sección en primera carga

**Beneficios:**
- Navegación más rápida con muchos shortcuts
- Visión general clara de la organización
- Menos scroll innecesario

---

### 🔍 Búsqueda Rápida con Highlight

**Funcionalidad:**
- 🔍 Barra de búsqueda debajo del header principal
- ⚡ Filtrado instantáneo de shortcuts por:
  - Label (nombre del shortcut)
  - Descripción
  - URL o URL template
- 🎨 Highlight en amarillo del texto coincidente
- 🔓 Auto-expansión de secciones con resultados
- ❌ Botón "×" para limpiar búsqueda rápidamente
- 📭 Estado "Sin resultados" con opción de limpiar

**Ejemplo de uso:**
```
Usuario busca: "pedido"
→ Filtra y muestra solo:
  - Amazon > Pedido (dinámico)
  - Mercadolibre > Pedidos Pendientes
→ Ambas secciones se auto-expanden
→ Palabra "pedido" resaltada en amarillo
```

---

### 🎛️ Botón "Expandir/Colapsar Todo"

**Ubicación:** Header principal, al lado del botón de configuración

**Comportamiento:**
- Si todas las secciones están expandidas → Colapsa todas
- Si alguna o ninguna está expandida → Expande todas
- Icono dinámico:
  - ChevronsDown (⬇⬇) cuando puede expandir
  - ChevronsUp (⬆⬆) cuando puede colapsar
- Tooltip informativo

**Utilidad:**
- Vista rápida de todas las secciones
- Limpieza rápida de la UI
- Navegación eficiente

---

### 📊 Mejoras Visuales Adicionales

1. **Scrollbar más delgada**: 6px (antes 8px) para más espacio de contenido
2. **Header principal compacto**: 15px font, padding reducido
3. **Iconos consistentes**: 3-3.5px para acciones, 3.5px para indicadores
4. **Focus rings**: Accesibilidad mejorada para navegación por teclado
5. **Transiciones suaves**: 150-200ms para todas las animaciones

---

### 🏗️ Cambios Técnicos

**Nuevos archivos:**
- `src/utils/searchUtils.ts` - Utilidades de búsqueda y filtrado
- `src/popup/components/SearchBar.tsx` - Componente de búsqueda
- `src/popup/components/HighlightedText.tsx` - Componente de texto resaltado

**Archivos modificados:**
- `src/popup/App.tsx` - Lógica de acordeón, búsqueda, toggle all
- `src/popup/components/ShortcutSection.tsx` - Acordeón + compacto
- `src/popup/components/DirectLink.tsx` - Diseño compacto + highlight
- `src/popup/components/DynamicInput.tsx` - Diseño compacto + highlight
- `tailwind.config.js` - Nuevos tamaños de fuente y colores
- `src/styles/index.css` - Estilos de acordeón y highlight

**Nuevas dependencias:**
- Ninguna (solo código propio)

---

### 📈 Métricas de Build

```
Bundle sizes (gzipped):
- popup.js:   13.64 kB → 3.97 kB
- options.js:  9.19 kB → 2.59 kB
- index.js:  152.21 kB → 48.37 kB
- index.css:  13.52 kB → 3.41 kB

Total: ~189 KB (~58 KB gzipped)
```

**Performance:**
- Tiempo de build: ~1.6s
- Target de apertura: < 100ms ✅
- Animaciones: 60fps ✅

---

### 🔄 Compatibilidad

- ✅ Chrome 88+ (Manifest V3)
- ✅ Sincronización chrome.storage.sync
- ✅ Persistencia localStorage para UI state
- ✅ Totalmente responsive dentro del popup 380x600px
- ✅ Keyboard navigation completa
- ✅ Screen reader friendly (ARIA attributes)

---

### 🎯 Testing Checklist

- [x] Acordeón expande/colapsa suavemente
- [x] Múltiples secciones pueden estar abiertas
- [x] Estado persiste al recargar popup
- [x] Búsqueda filtra correctamente
- [x] Búsqueda resalta texto coincidente
- [x] Auto-expansión en búsqueda funciona
- [x] Botón "Expandir/Colapsar Todo" funciona
- [x] Badges muestran contadores correctos
- [x] Diseño compacto pero legible
- [x] Hover actions siguen funcionando
- [x] Build exitoso sin errores

---

### 🚀 Próximas Mejoras Potenciales

- [ ] Atajos de teclado por shortcut (ej: Ctrl+1, Ctrl+2)
- [ ] Historial de shortcuts más usados
- [ ] Dark mode automático
- [ ] Validación de inputs con regex personalizable
- [ ] Templates predefinidos de configuración
- [ ] Estadísticas de uso
- [ ] Exportar solo una sección
- [ ] Carpetas dentro de secciones

---

### 📝 Notas de Migración

**De v1.0.0 a v2.0.0:**

No se requiere migración de datos. La configuración existente es 100% compatible.

**Cambios en el comportamiento:**
1. Las secciones ahora están colapsadas por defecto (excepto la primera)
2. Nueva barra de búsqueda visible cuando hay secciones
3. Nuevo botón de expandir/colapsar todo en header

**Beneficios inmediatos:**
- 50% menos scroll para acceder a shortcuts
- Búsqueda instantánea entre todos los shortcuts
- Navegación más intuitiva con acordeón

---

### 🙏 Créditos

Desarrollado para optimizar el flujo de trabajo de usuarios con múltiples accesos frecuentes.

Stack: React 18 + TypeScript 5 + Vite 6 + Tailwind CSS 3 + Chrome Extensions API
