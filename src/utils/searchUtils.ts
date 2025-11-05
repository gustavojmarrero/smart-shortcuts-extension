import type { Section, Shortcut, Folder, Item } from '../storage/types';
import { isShortcut, isFolder } from '../storage/types';

/**
 * Fuzzy match - verifica si query está en text (case insensitive)
 */
export function fuzzyMatch(text: string, query: string): boolean {
  if (!query) return true;
  return text.toLowerCase().includes(query.toLowerCase());
}

/**
 * Verifica si un shortcut coincide con la búsqueda
 */
export function matchesSearch(shortcut: Shortcut, query: string): boolean {
  if (!query) return true;

  const searchText = [
    shortcut.label,
    shortcut.description || '',
    shortcut.url || '',
    shortcut.urlTemplate || '',
  ].join(' ').toLowerCase();

  return searchText.includes(query.toLowerCase());
}

/**
 * Verifica si una carpeta coincide con la búsqueda por nombre
 */
export function matchesFolder(folder: Folder, query: string): boolean {
  if (!query) return true;
  return folder.name.toLowerCase().includes(query.toLowerCase());
}

/**
 * Busca recursivamente en un array de items (shortcuts y carpetas)
 * Retorna items que coinciden con la búsqueda, manteniendo la estructura de carpetas
 */
export function searchInItems(items: Item[], query: string): Item[] {
  const matchingItems: Item[] = [];

  items.forEach((item) => {
    if (isShortcut(item)) {
      // Si es un shortcut, verificar si coincide con la búsqueda
      if (matchesSearch(item, query)) {
        matchingItems.push(item);
      }
    } else if (isFolder(item)) {
      // Si es una carpeta, buscar recursivamente en sus items
      const matchingChildren = searchInItems(item.items, query);

      // Incluir la carpeta si:
      // 1. Su nombre coincide con la búsqueda, o
      // 2. Tiene hijos que coinciden con la búsqueda
      const folderNameMatches = matchesFolder(item, query);

      if (folderNameMatches || matchingChildren.length > 0) {
        matchingItems.push({
          ...item,
          items: folderNameMatches ? item.items : matchingChildren,
        });
      }
    }
  });

  return matchingItems;
}

/**
 * Filtra secciones y shortcuts según búsqueda
 * Retorna solo secciones que tienen shortcuts con matches
 */
export function filterSections(sections: Section[], query: string): {
  sections: Section[];
  expandedIds: string[];
} {
  if (!query.trim()) {
    return { sections, expandedIds: [] };
  }

  const filteredSections: Section[] = [];
  const expandedIds: string[] = [];

  sections.forEach((section) => {
    // Buscar recursivamente en todos los items de la sección
    const matchingItems = searchInItems(section.items, query);

    if (matchingItems.length > 0) {
      filteredSections.push({
        ...section,
        items: matchingItems,
      });
      expandedIds.push(section.id);
    }
  });

  return { sections: filteredSections, expandedIds };
}

/**
 * Resalta texto que coincide con la búsqueda
 * Retorna HTML string con <mark> tags
 */
export function highlightText(text: string, query: string): string {
  if (!query.trim()) return text;

  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
  return text.replace(regex, '<mark class="search-highlight">$1</mark>');
}

/**
 * Escapa caracteres especiales de regex
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Split text into parts for highlighting
 * Returns array of {text, isMatch} objects
 */
export function getHighlightParts(text: string, query: string): Array<{ text: string; isMatch: boolean }> {
  if (!query.trim()) {
    return [{ text, isMatch: false }];
  }

  const parts = text.split(new RegExp(`(${escapeRegex(query)})`, 'gi'));
  return parts.map((part) => ({
    text: part,
    isMatch: part.toLowerCase() === query.toLowerCase(),
  }));
}
