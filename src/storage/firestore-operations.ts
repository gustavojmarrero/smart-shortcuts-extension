/**
 * Operaciones CRUD que trabajan directamente con el estado en memoria
 * Para usuarios autenticados que usan Firestore
 *
 * NO tocan chrome.storage.sync - solo manipulan el objeto de configuración
 * y luego se guarda en Firestore via saveToFirestore
 */

import type { ShortcutConfig, Section, Shortcut, Folder, Item } from './types';

/**
 * Helper: Elimina campos undefined de un objeto (Firestore no los acepta)
 */
function removeUndefined<T extends Record<string, any>>(obj: T): T {
  const result = { ...obj };
  Object.keys(result).forEach(key => {
    if (result[key] === undefined) {
      delete result[key];
    }
  });
  return result;
}

/**
 * Helper: Genera un ID único
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Helper: Encuentra el siguiente order disponible
 */
function getNextOrder(items: { order: number }[]): number {
  if (items.length === 0) return 0;
  return Math.max(...items.map(i => i.order)) + 1;
}

/**
 * Agregar nueva sección
 */
export function addSectionToConfig(
  config: ShortcutConfig,
  sectionData: { name: string; icon?: string }
): { config: ShortcutConfig; newSection: Section } {
  const newSection: Section = removeUndefined({
    id: generateId(),
    name: sectionData.name,
    icon: sectionData.icon,
    items: [],
    order: getNextOrder(config.sections),
  } as Section);

  const updatedConfig: ShortcutConfig = {
    ...config,
    sections: [...config.sections, newSection],
    lastModified: Date.now(),
  };

  return { config: updatedConfig, newSection };
}

/**
 * Actualizar sección existente
 */
export function updateSectionInConfig(
  config: ShortcutConfig,
  sectionId: string,
  updates: Partial<Section>
): ShortcutConfig {
  const cleanUpdates = removeUndefined(updates);
  return {
    ...config,
    sections: config.sections.map(section =>
      section.id === sectionId
        ? { ...section, ...cleanUpdates }
        : section
    ),
    lastModified: Date.now(),
  };
}

/**
 * Eliminar sección
 */
export function deleteSectionFromConfig(
  config: ShortcutConfig,
  sectionId: string
): ShortcutConfig {
  return {
    ...config,
    sections: config.sections.filter(s => s.id !== sectionId),
    lastModified: Date.now(),
  };
}

/**
 * Agregar shortcut a sección
 */
export function addShortcutToConfig(
  config: ShortcutConfig,
  sectionId: string,
  shortcutData: Omit<Shortcut, 'id' | 'order'>,
  parentFolderId?: string
): ShortcutConfig {
  const newShortcut: Shortcut = removeUndefined({
    ...shortcutData,
    id: generateId(),
    order: 0, // Se calculará después
  } as Shortcut);

  return {
    ...config,
    sections: config.sections.map(section => {
      if (section.id !== sectionId) return section;

      if (parentFolderId) {
        // Agregar a carpeta
        return {
          ...section,
          items: addItemToFolder(section.items, parentFolderId, newShortcut),
        };
      } else {
        // Agregar a sección raíz
        const updatedItems = [...section.items, { ...newShortcut, order: getNextOrder(section.items) }];
        return { ...section, items: updatedItems };
      }
    }),
    lastModified: Date.now(),
  };
}

/**
 * Actualizar shortcut
 */
export function updateShortcutInConfig(
  config: ShortcutConfig,
  sectionId: string,
  shortcutId: string,
  updates: Partial<Shortcut>
): ShortcutConfig {
  const cleanUpdates = removeUndefined(updates);
  return {
    ...config,
    sections: config.sections.map(section => {
      if (section.id !== sectionId) return section;
      return {
        ...section,
        items: updateItemInItems(section.items, shortcutId, cleanUpdates),
      };
    }),
    lastModified: Date.now(),
  };
}

/**
 * Eliminar shortcut
 */
export function deleteShortcutFromConfig(
  config: ShortcutConfig,
  sectionId: string,
  shortcutId: string
): ShortcutConfig {
  return {
    ...config,
    sections: config.sections.map(section => {
      if (section.id !== sectionId) return section;
      return {
        ...section,
        items: deleteItemFromItems(section.items, shortcutId),
      };
    }),
    lastModified: Date.now(),
  };
}

/**
 * Agregar carpeta
 */
export function addFolderToConfig(
  config: ShortcutConfig,
  sectionId: string,
  folderData: { name: string; icon?: string },
  parentFolderId?: string
): ShortcutConfig {
  const newFolder: Folder = removeUndefined({
    id: generateId(),
    name: folderData.name,
    icon: folderData.icon,
    items: [],
    order: 0, // Se calculará después
    isFolder: true, // Discriminator
  } as Folder);

  return {
    ...config,
    sections: config.sections.map(section => {
      if (section.id !== sectionId) return section;

      if (parentFolderId) {
        // Agregar a carpeta padre
        return {
          ...section,
          items: addItemToFolder(section.items, parentFolderId, newFolder),
        };
      } else {
        // Agregar a sección raíz
        const updatedItems = [...section.items, { ...newFolder, order: getNextOrder(section.items) }];
        return { ...section, items: updatedItems };
      }
    }),
    lastModified: Date.now(),
  };
}

/**
 * Actualizar carpeta
 */
export function updateFolderInConfig(
  config: ShortcutConfig,
  sectionId: string,
  folderId: string,
  updates: Partial<Folder>
): ShortcutConfig {
  const cleanUpdates = removeUndefined(updates);
  return {
    ...config,
    sections: config.sections.map(section => {
      if (section.id !== sectionId) return section;
      return {
        ...section,
        items: updateItemInItems(section.items, folderId, cleanUpdates),
      };
    }),
    lastModified: Date.now(),
  };
}

/**
 * Eliminar carpeta
 */
export function deleteFolderFromConfig(
  config: ShortcutConfig,
  sectionId: string,
  folderId: string
): ShortcutConfig {
  return {
    ...config,
    sections: config.sections.map(section => {
      if (section.id !== sectionId) return section;
      return {
        ...section,
        items: deleteItemFromItems(section.items, folderId),
      };
    }),
    lastModified: Date.now(),
  };
}

/**
 * Reordenar secciones
 */
export function reorderSectionsInConfig(
  config: ShortcutConfig,
  sectionIds: string[]
): ShortcutConfig {
  const sectionsMap = new Map(config.sections.map(s => [s.id, s]));
  const reorderedSections = sectionIds
    .map(id => sectionsMap.get(id))
    .filter((s): s is Section => s !== undefined)
    .map((section, index) => ({ ...section, order: index }));

  return {
    ...config,
    sections: reorderedSections,
    lastModified: Date.now(),
  };
}

/**
 * Reordenar items dentro de una sección o carpeta
 */
export function reorderItemsInConfig(
  config: ShortcutConfig,
  sectionId: string,
  itemIds: string[],
  parentFolderId?: string
): ShortcutConfig {
  return {
    ...config,
    sections: config.sections.map(section => {
      if (section.id !== sectionId) return section;

      if (parentFolderId) {
        return {
          ...section,
          items: reorderItemsInFolder(section.items, parentFolderId, itemIds),
        };
      } else {
        const itemsMap = new Map(section.items.map(i => [i.id, i]));
        const reordered = itemIds
          .map(id => itemsMap.get(id))
          .filter((i): i is Item => i !== undefined)
          .map((item, index) => ({ ...item, order: index }));

        return { ...section, items: reordered };
      }
    }),
    lastModified: Date.now(),
  };
}

/**
 * Mover item entre secciones/carpetas
 */
export function moveItemInConfig(
  config: ShortcutConfig,
  itemId: string,
  sourceSectionId: string,
  targetSectionId: string,
  sourceFolderId?: string,
  targetFolderId?: string,
  newIndex: number = 0
): ShortcutConfig {
  // 1. Encontrar y remover el item de su ubicación actual
  let itemToMove: Item | null = null;
  const sourceSection = config.sections.find(s => s.id === sourceSectionId);

  if (sourceSection) {
    const findAndRemove = (items: Item[], folderId?: string): Item[] => {
      if (folderId) {
        return items.map(item => {
          if ('items' in item) {
            if (item.id === folderId) {
              const found = item.items.find(i => i.id === itemId);
              if (found) {
                itemToMove = found;
                return { ...item, items: item.items.filter(i => i.id !== itemId) };
              }
            }
            return { ...item, items: findAndRemove(item.items, folderId) };
          }
          return item;
        });
      } else {
        itemToMove = items.find(i => i.id === itemId) || null;
        return items.filter(i => i.id !== itemId);
      }
    };

    const updatedSourceItems = findAndRemove(sourceSection.items, sourceFolderId);
    const configWithoutItem = {
      ...config,
      sections: config.sections.map(s =>
        s.id === sourceSectionId ? { ...s, items: updatedSourceItems } : s
      ),
    };

    if (!itemToMove) return config; // Item not found

    // 2. Insertar el item en la ubicación destino
    return {
      ...configWithoutItem,
      sections: configWithoutItem.sections.map(section => {
        if (section.id !== targetSectionId) return section;

        if (targetFolderId) {
          return {
            ...section,
            items: insertItemInFolder(section.items, targetFolderId, itemToMove!, newIndex),
          };
        } else {
          const items = [...section.items];
          items.splice(newIndex, 0, { ...itemToMove!, order: newIndex });
          return {
            ...section,
            items: items.map((item, idx) => ({ ...item, order: idx })),
          };
        }
      }),
      lastModified: Date.now(),
    };
  }

  return config;
}

// ============================================================================
// Helpers para manipular items recursivamente
// ============================================================================

function addItemToFolder(items: Item[], folderId: string, newItem: Item): Item[] {
  return items.map(item => {
    if ('items' in item) {
      if (item.id === folderId) {
        const updatedItems = [...item.items, { ...newItem, order: getNextOrder(item.items) }];
        return { ...item, items: updatedItems };
      }
      return { ...item, items: addItemToFolder(item.items, folderId, newItem) };
    }
    return item;
  });
}

function updateItemInItems(items: Item[], itemId: string, updates: Partial<Item>): Item[] {
  return items.map(item => {
    if (item.id === itemId) {
      return { ...item, ...updates };
    }
    if ('items' in item) {
      return { ...item, items: updateItemInItems(item.items, itemId, updates) };
    }
    return item;
  });
}

function deleteItemFromItems(items: Item[], itemId: string): Item[] {
  return items
    .filter(item => item.id !== itemId)
    .map(item => {
      if ('items' in item) {
        return { ...item, items: deleteItemFromItems(item.items, itemId) };
      }
      return item;
    });
}

function reorderItemsInFolder(items: Item[], folderId: string, itemIds: string[]): Item[] {
  return items.map(item => {
    if ('items' in item) {
      if (item.id === folderId) {
        const itemsMap = new Map(item.items.map(i => [i.id, i]));
        const reordered = itemIds
          .map(id => itemsMap.get(id))
          .filter((i): i is Item => i !== undefined)
          .map((i, index) => ({ ...i, order: index }));
        return { ...item, items: reordered };
      }
      return { ...item, items: reorderItemsInFolder(item.items, folderId, itemIds) };
    }
    return item;
  });
}

function insertItemInFolder(items: Item[], folderId: string, newItem: Item, index: number): Item[] {
  return items.map(item => {
    if ('items' in item) {
      if (item.id === folderId) {
        const updatedItems = [...item.items];
        updatedItems.splice(index, 0, newItem);
        return {
          ...item,
          items: updatedItems.map((i, idx) => ({ ...i, order: idx })),
        };
      }
      return { ...item, items: insertItemInFolder(item.items, folderId, newItem, index) };
    }
    return item;
  });
}
