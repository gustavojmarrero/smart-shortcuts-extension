// Storage layer for chrome.storage.sync
import type { ShortcutConfig, Section, Shortcut, StorageData } from './types';
import { DEFAULT_CONFIG } from './types';

const STORAGE_KEY = 'config';

/**
 * Load configuration from chrome.storage.sync
 */
export async function loadConfig(): Promise<ShortcutConfig> {
  try {
    const result = await chrome.storage.sync.get([STORAGE_KEY]) as StorageData;
    return result.config || DEFAULT_CONFIG;
  } catch (error) {
    console.error('Error loading config:', error);
    return DEFAULT_CONFIG;
  }
}

/**
 * Save configuration to chrome.storage.sync
 */
export async function saveConfig(config: ShortcutConfig): Promise<void> {
  try {
    const updatedConfig: ShortcutConfig = {
      ...config,
      lastModified: Date.now(),
    };
    await chrome.storage.sync.set({ [STORAGE_KEY]: updatedConfig });
  } catch (error) {
    console.error('Error saving config:', error);
    throw error;
  }
}

/**
 * Add a new section
 */
export async function addSection(section: Omit<Section, 'id' | 'order'>): Promise<Section> {
  const config = await loadConfig();
  const newSection: Section = {
    ...section,
    id: crypto.randomUUID(),
    order: config.sections.length,
    shortcuts: [],
  };
  config.sections.push(newSection);
  await saveConfig(config);
  return newSection;
}

/**
 * Update an existing section
 */
export async function updateSection(sectionId: string, updates: Partial<Section>): Promise<void> {
  const config = await loadConfig();
  const sectionIndex = config.sections.findIndex(s => s.id === sectionId);
  if (sectionIndex === -1) throw new Error('Section not found');

  config.sections[sectionIndex] = {
    ...config.sections[sectionIndex],
    ...updates,
  };
  await saveConfig(config);
}

/**
 * Delete a section
 */
export async function deleteSection(sectionId: string): Promise<void> {
  const config = await loadConfig();
  config.sections = config.sections.filter(s => s.id !== sectionId);
  // Reorder remaining sections
  config.sections.forEach((section, index) => {
    section.order = index;
  });
  await saveConfig(config);
}

/**
 * Add a shortcut to a section
 */
export async function addShortcut(
  sectionId: string,
  shortcut: Omit<Shortcut, 'id' | 'order'>
): Promise<Shortcut> {
  const config = await loadConfig();
  const section = config.sections.find(s => s.id === sectionId);
  if (!section) throw new Error('Section not found');

  const newShortcut: Shortcut = {
    ...shortcut,
    id: crypto.randomUUID(),
    order: section.shortcuts.length,
  };
  section.shortcuts.push(newShortcut);
  await saveConfig(config);
  return newShortcut;
}

/**
 * Update an existing shortcut
 */
export async function updateShortcut(
  sectionId: string,
  shortcutId: string,
  updates: Partial<Shortcut>
): Promise<void> {
  const config = await loadConfig();
  const section = config.sections.find(s => s.id === sectionId);
  if (!section) throw new Error('Section not found');

  const shortcutIndex = section.shortcuts.findIndex(sc => sc.id === shortcutId);
  if (shortcutIndex === -1) throw new Error('Shortcut not found');

  section.shortcuts[shortcutIndex] = {
    ...section.shortcuts[shortcutIndex],
    ...updates,
  };
  await saveConfig(config);
}

/**
 * Delete a shortcut
 */
export async function deleteShortcut(sectionId: string, shortcutId: string): Promise<void> {
  const config = await loadConfig();
  const section = config.sections.find(s => s.id === sectionId);
  if (!section) throw new Error('Section not found');

  section.shortcuts = section.shortcuts.filter(sc => sc.id !== shortcutId);
  // Reorder remaining shortcuts
  section.shortcuts.forEach((shortcut, index) => {
    shortcut.order = index;
  });
  await saveConfig(config);
}

/**
 * Reorder sections
 */
export async function reorderSections(sectionIds: string[]): Promise<void> {
  const config = await loadConfig();
  const reorderedSections = sectionIds
    .map(id => config.sections.find(s => s.id === id))
    .filter((s): s is Section => s !== undefined);

  reorderedSections.forEach((section, index) => {
    section.order = index;
  });

  config.sections = reorderedSections;
  await saveConfig(config);
}

/**
 * Reorder shortcuts within a section
 */
export async function reorderShortcuts(sectionId: string, shortcutIds: string[]): Promise<void> {
  const config = await loadConfig();
  const section = config.sections.find(s => s.id === sectionId);
  if (!section) throw new Error('Section not found');

  const reorderedShortcuts = shortcutIds
    .map(id => section.shortcuts.find(sc => sc.id === id))
    .filter((sc): sc is Shortcut => sc !== undefined);

  reorderedShortcuts.forEach((shortcut, index) => {
    shortcut.order = index;
  });

  section.shortcuts = reorderedShortcuts;
  await saveConfig(config);
}

/**
 * Export config as JSON
 */
export async function exportConfig(): Promise<string> {
  const config = await loadConfig();
  return JSON.stringify(config, null, 2);
}

/**
 * Import config from JSON
 */
export async function importConfig(jsonString: string): Promise<void> {
  try {
    const config = JSON.parse(jsonString) as ShortcutConfig;
    // Validate basic structure
    if (!config.sections || !Array.isArray(config.sections)) {
      throw new Error('Invalid config format');
    }
    await saveConfig(config);
  } catch (error) {
    console.error('Error importing config:', error);
    throw new Error('Invalid JSON format');
  }
}
