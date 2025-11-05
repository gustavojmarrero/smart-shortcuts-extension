import type { Section, Shortcut } from '../storage/types';
import { isShortcut } from '../storage/types';

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
    // Filter items to only include shortcuts that match the search
    const matchingItems = section.items.filter((item) => {
      // Only search shortcuts (not folders for now)
      if (!isShortcut(item)) return false;
      return matchesSearch(item, query);
    });

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
