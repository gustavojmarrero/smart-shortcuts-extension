# TODO: Implementación de Carpetas Anidadas (v2.1.0)

## 🎯 Objetivo
Implementar sistema de subcategorías/carpetas infinitamente anidadas dentro de las secciones.

## ✅ Completado

### 1. Tipos TypeScript Actualizados (`src/storage/types.ts`)
- ✅ Nueva interface `Folder` con estructura recursiva
- ✅ Type union `Item = Shortcut | Folder`
- ✅ Type guards: `isFolder()` y `isShortcut()`
- ✅ Helper functions: `createFolder()` y `createShortcut()`
- ✅ Cambio de `Section.shortcuts[]` a `Section.items[]`
- ✅ Version actualizada a `'2.1.0'`

### 2. Componente FolderItem (`src/popup/components/FolderItem.tsx`)
- ✅ Componente recursivo para renderizar carpetas anidadas
- ✅ Acordeón colapsable con chevron animado
- ✅ Indentación visual basada en profundidad (`depth * 12px`)
- ✅ Badge con contador de items
- ✅ Hover actions: Add Folder, Edit, Delete
- ✅ Renderiza shortcuts dentro usando DirectLink/DynamicInput
- ✅ Soporte para búsqueda (prop `searchQuery`)

### 3. Sistema de Migración (`src/storage/migration.ts`)
- ✅ Función `migrateToV2_1()` para convertir configs antiguos
- ✅ Convierte `shortcuts[]` a `items[]`
- ✅ Función `needsMigration()` para detectar si es necesario

---

## 🚧 Pendiente de Implementar

### 1. **Actualizar `src/storage/config.ts`** ⚠️ CRÍTICO

**Problema**: El archivo actual usa `shortcuts[]` en lugar de `items[]`.

**Tareas**:
- [ ] Importar funciones de migración al cargar config
- [ ] Modificar `addSection()` para usar `items: []` en lugar de `shortcuts: []`
- [ ] Crear funciones CRUD para carpetas:

```typescript
// Nuevas funciones necesarias:

/**
 * Add folder to section or parent folder
 */
export async function addFolder(
  sectionId: string,
  folder: Omit<Folder, 'id' | 'order'>,
  parentFolderId?: string
): Promise<Folder>

/**
 * Update folder
 */
export async function updateFolder(
  sectionId: string,
  folderId: string,
  updates: Partial<Folder>,
  parentFolderId?: string
): Promise<void>

/**
 * Delete folder (recursively deletes all content)
 */
export async function deleteFolder(
  sectionId: string,
  folderId: string,
  parentFolderId?: string
): Promise<void>

/**
 * Move item (shortcut or folder) to another folder/section
 */
export async function moveItem(
  itemId: string,
  fromSectionId: string,
  toSectionId: string,
  fromFolderId?: string,
  toFolderId?: string
): Promise<void>

/**
 * Recursive helper to find item in nested structure
 */
function findItemInItems(items: Item[], itemId: string): Item | null

/**
 * Recursive helper to find parent folder of an item
 */
function findParentFolder(items: Item[], itemId: string): Folder | null
```

**Estrategia de implementación**:
1. Crear helpers recursivos para navegar el árbol de items
2. Modificar funciones existentes de shortcuts para trabajar con `items[]`
3. Agregar nuevas funciones específicas para carpetas
4. Mantener retrocompatibilidad con migración automática

---

### 2. **Actualizar `src/popup/components/ShortcutSection.tsx`**

**Cambios necesarios**:
- [ ] Cambiar de `section.shortcuts` a `section.items`
- [ ] Renderizar `FolderItem` cuando `isFolder(item)`
- [ ] Renderizar shortcuts directamente cuando `isShortcut(item)`
- [ ] Agregar botón "📁+" para crear carpetas (al lado del botón actual "+")
- [ ] Props adicionales:
  - `onAddFolder: (sectionId: string, parentFolderId?: string) => void`
  - `onEditFolder: (folder: Folder) => void`
  - `onDeleteFolder: (folderId: string) => void`

**Ejemplo de renderizado**:
```typescript
{sortedItems.map((item) => {
  if (isFolder(item)) {
    return (
      <FolderItem
        key={item.id}
        folder={item}
        depth={0}
        searchQuery={searchQuery}
        onEditItem={onEditItem}
        onDeleteItem={onDeleteItem}
        onAddFolder={(parentId) => onAddFolder(section.id, parentId)}
        onAddShortcut={(parentId) => onAddShortcut(section.id, parentId)}
      />
    );
  } else if (isShortcut(item)) {
    return item.type === 'direct' ? (
      <DirectLink key={item.id} ... />
    ) : (
      <DynamicInput key={item.id} ... />
    );
  }
})}
```

---

### 3. **Crear Modal de Carpetas** (`src/popup/components/EditModal.tsx`)

**Nueva interface y componente**:
```typescript
interface EditFolderModalProps {
  folder?: Folder;
  onSave: (data: Partial<Folder>) => void;
  onClose: () => void;
}

export function EditFolderModal({ folder, onSave, onClose }: EditFolderModalProps) {
  // Similar a EditSectionModal pero más simple
  // Solo necesita: name, icon
}
```

**Agregar al componente existente** o crear archivo separado.

---

### 4. **Actualizar `src/popup/App.tsx`**

**Cambios necesarios**:
- [ ] Agregar estado para carpetas en modal:
  ```typescript
  type ModalState =
    | { type: 'none' }
    | { type: 'section'; section?: Section }
    | { type: 'shortcut'; sectionId: string; shortcut?: Shortcut; parentFolderId?: string }
    | { type: 'folder'; sectionId: string; folder?: Folder; parentFolderId?: string }
  ```

- [ ] Handlers para carpetas:
  ```typescript
  const handleAddFolder = (sectionId: string, parentFolderId?: string) => {
    setModal({ type: 'folder', sectionId, parentFolderId });
  };

  const handleSaveFolder = async (data: Partial<Folder>) => {
    if (modal.type === 'folder') {
      if (modal.folder) {
        await updateFolder(modal.sectionId, modal.folder.id, data, modal.parentFolderId);
      } else {
        await addFolder(modal.sectionId, {
          name: data.name!,
          icon: data.icon,
          items: [],
        }, modal.parentFolderId);
      }
      const updated = await loadConfig();
      setConfig(updated);
      setModal({ type: 'none' });
    }
  };
  ```

- [ ] Actualizar `filterSections` en búsqueda para buscar recursivamente en carpetas

---

### 5. **Actualizar `src/utils/searchUtils.ts`**

**Función recursiva de búsqueda**:
```typescript
/**
 * Search recursively in items (shortcuts and folders)
 */
export function searchInItems(items: Item[], query: string): Item[] {
  const results: Item[] = [];

  for (const item of items) {
    if (isShortcut(item) && matchesSearch(item, query)) {
      results.push(item);
    } else if (isFolder(item)) {
      // Search in folder name
      if (fuzzyMatch(item.name, query)) {
        results.push(item); // Include folder if name matches
      } else {
        // Search in folder contents
        const childResults = searchInItems(item.items, query);
        if (childResults.length > 0) {
          // Return folder with filtered children
          results.push({
            ...item,
            items: childResults,
          });
        }
      }
    }
  }

  return results;
}
```

---

### 6. **Implementar Drag & Drop** (OPCIONAL - puede ser v2.2.0)

**Librería**: `@hello-pangea/dnd` (fork mantenido de react-beautiful-dnd)

**Instalación**:
```bash
npm install @hello-pangea/dnd
```

**Implementación**:
- [ ] Envolver secciones con `<DragDropContext>`
- [ ] Cada carpeta y shortcut en `<Draggable>`
- [ ] Cada contenedor (section/folder) en `<Droppable>`
- [ ] Handler `onDragEnd` para actualizar orden y mover items

**Complejidad**: Media-Alta (requiere entender estructura nested)

---

### 7. **Actualizar Options Page** (`src/options/Options.tsx`)

Similar a los cambios en `App.tsx` pero para la vista de configuración avanzada:
- [ ] Renderizar árbol de carpetas completo
- [ ] Soportar expansión/colapso de carpetas
- [ ] Botones para agregar carpetas
- [ ] Drag & drop (si se implementa)

---

### 8. **Testing Completo**

**Casos de prueba**:
- [ ] Crear carpeta en sección vacía
- [ ] Crear carpeta dentro de otra carpeta (anidación)
- [ ] Crear shortcut dentro de carpeta
- [ ] Editar nombre/icono de carpeta
- [ ] Eliminar carpeta (debe pedir confirmación)
- [ ] Migración automática de config v2.0 → v2.1
- [ ] Búsqueda dentro de carpetas anidadas
- [ ] Persistencia de estado de carpetas expandidas
- [ ] Performance con 50+ items en múltiples niveles
- [ ] Expansión/colapso de carpetas es suave

---

## 📊 Estimación de Tiempo

| Tarea | Tiempo | Prioridad |
|-------|--------|-----------|
| config.ts refactor | 30-40 min | CRÍTICA |
| ShortcutSection update | 15-20 min | CRÍTICA |
| EditFolderModal | 10 min | CRÍTICA |
| App.tsx update | 15-20 min | CRÍTICA |
| searchUtils update | 15 min | ALTA |
| Options.tsx update | 20 min | MEDIA |
| Drag & Drop | 45-60 min | BAJA (v2.2) |
| Testing completo | 30 min | ALTA |
| **TOTAL (sin drag&drop)** | **~2.5 horas** | - |
| **TOTAL (con drag&drop)** | **~3.5 horas** | - |

---

## 🎯 Orden de Implementación Recomendado

1. **config.ts** - Base del sistema
2. **Migration en loadConfig** - Compatibilidad
3. **ShortcutSection** - UI principal
4. **EditFolderModal** - Creación de carpetas
5. **App.tsx handlers** - Lógica de carpetas
6. **searchUtils** - Búsqueda recursiva
7. **Testing básico** - Verificar funcionalidad core
8. **Options.tsx** - Configuración avanzada
9. **Testing completo** - Todos los casos
10. **Drag & Drop** - Feature adicional (opcional)

---

## 🐛 Problemas Potenciales a Considerar

### 1. **Performance con Anidación Profunda**
- Muchos niveles pueden causar lag
- **Solución**: Limitar depth a 5-10 niveles
- Virtualización si hay 100+ items

### 2. **Storage Limits**
- chrome.storage.sync tiene límite de 100KB
- Estructura nested aumenta tamaño JSON
- **Solución**: Advertir al usuario si se acerca al límite

### 3. **Migración de Datos**
- Usuarios con configs existentes
- **Solución**: Migración automática en loadConfig()
- Backup automático antes de migrar

### 4. **UX de Drag & Drop**
- Complejo con anidación
- **Solución**: Indicadores visuales claros de drop zones

### 5. **Estado de Expansión**
- Recordar qué carpetas están abiertas
- **Solución**: localStorage con IDs de carpetas expandidas
- Similar al sistema actual de secciones

---

## 📝 Notas de Implementación

### Estructura de Datos Ejemplo

```json
{
  "sections": [
    {
      "id": "abc123",
      "name": "Mercadolibre",
      "icon": "🛒",
      "items": [
        {
          "id": "folder1",
          "name": "Ventas",
          "icon": "💰",
          "isFolder": true,
          "items": [
            {
              "id": "shortcut1",
              "type": "direct",
              "label": "Panel Ventas",
              "url": "https://...",
              "order": 0
            },
            {
              "id": "folder2",
              "name": "México",
              "isFolder": true,
              "items": [
                {
                  "id": "shortcut2",
                  "type": "dynamic",
                  "label": "Buscar Orden",
                  "urlTemplate": "https://.../{input}",
                  "order": 0
                }
              ],
              "order": 1
            }
          ],
          "order": 0
        },
        {
          "id": "shortcut3",
          "type": "direct",
          "label": "Dashboard Principal",
          "url": "https://...",
          "order": 1
        }
      ],
      "order": 0
    }
  ],
  "version": "2.1.0"
}
```

### Helpers Útiles

```typescript
// Función para aplanar árbol (útil para búsqueda)
function flattenItems(items: Item[]): Item[] {
  const flat: Item[] = [];
  for (const item of items) {
    flat.push(item);
    if (isFolder(item)) {
      flat.push(...flattenItems(item.items));
    }
  }
  return flat;
}

// Función para contar items recursivamente
function countItems(items: Item[]): number {
  let count = 0;
  for (const item of items) {
    count++;
    if (isFolder(item)) {
      count += countItems(item.items);
    }
  }
  return count;
}

// Función para obtener ruta de carpetas
function getFolderPath(sectionId: string, folderId: string): string[] {
  // Returns: ['Mercadolibre', 'Ventas', 'México']
  // Useful for breadcrumbs in modals
}
```

---

## ✅ Checklist Final antes de Release

- [ ] Migración automática funciona
- [ ] Crear carpetas en sección raíz
- [ ] Crear carpetas anidadas (3+ niveles)
- [ ] Crear shortcuts en carpetas
- [ ] Editar carpetas (nombre, icono)
- [ ] Eliminar carpetas con confirmación
- [ ] Búsqueda encuentra items en carpetas
- [ ] Highlight funciona en carpetas anidadas
- [ ] Performance aceptable (< 100ms render)
- [ ] Storage no excede límites
- [ ] Estado de expansión persiste
- [ ] Documentación actualizada
- [ ] CHANGELOG actualizado
- [ ] README con ejemplos de carpetas
- [ ] Tests básicos pasan

---

## 🚀 Para Continuar

1. Abre este archivo: `TODO_FOLDERS.md`
2. Comienza por `config.ts` (sección "Pendiente #1")
3. Sigue el orden recomendado
4. Marca ✅ cada tarea completada
5. Haz commits incrementales
6. Test después de cada sección mayor

**Comando para continuar**:
```bash
# Ver este archivo
cat TODO_FOLDERS.md

# Empezar a trabajar
code src/storage/config.ts
```

---

**Última actualización**: 2025-11-05
**Estado**: En progreso - Tipos y componentes base completados
**Siguiente paso**: Refactorizar config.ts para soportar items[]
