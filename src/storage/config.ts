// Storage layer for chrome.storage.sync
import type { ShortcutConfig, Section, Shortcut, Folder, StorageData } from './types';
import { DEFAULT_CONFIG } from './types';

const STORAGE_KEY = 'config';

/**
 * Load configuration from chrome.storage.sync
 */
export async function loadConfig(): Promise<ShortcutConfig> {
  try {
    const result = await chrome.storage.sync.get([STORAGE_KEY]) as StorageData;
    const config = result.config || DEFAULT_CONFIG;

    // Apply migration if needed
    const { migrateToV2_1, needsMigration } = await import('./migration');
    if (needsMigration(config)) {
      console.log('⚠️ Config needs migration, migrating now...');
      const migratedConfig = migrateToV2_1(config);
      await saveConfig(migratedConfig);
      console.log('✅ Config migrated successfully');
      return migratedConfig;
    }

    return config;
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
    items: [],
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
 * Add a shortcut to a section or inside a folder
 */
export async function addShortcut(
  sectionId: string,
  shortcut: Omit<Shortcut, 'id' | 'order'>,
  parentFolderId?: string
): Promise<Shortcut> {
  const config = await loadConfig();
  const section = config.sections.find(s => s.id === sectionId);
  if (!section) throw new Error('Section not found');

  const newShortcut: Shortcut = {
    ...shortcut,
    id: crypto.randomUUID(),
    order: 0,
  };

  // If parentFolderId is provided, add to that folder
  if (parentFolderId) {
    const parentFolder = findFolderById(section.items, parentFolderId);
    if (!parentFolder) throw new Error('Parent folder not found');
    newShortcut.order = parentFolder.items.length;
    parentFolder.items.push(newShortcut);
  } else {
    // Add to section root
    newShortcut.order = section.items.length;
    section.items.push(newShortcut);
  }

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

  const shortcutIndex = section.items.findIndex(item => !('items' in item) && item.id === shortcutId);
  if (shortcutIndex === -1) throw new Error('Shortcut not found');

  const shortcut = section.items[shortcutIndex];
  if ('items' in shortcut) throw new Error('Item is a folder, not a shortcut');

  section.items[shortcutIndex] = {
    ...shortcut,
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

  section.items = section.items.filter(item => item.id !== shortcutId);
  // Reorder remaining items
  section.items.forEach((item, index) => {
    item.order = index;
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
 * Reorder items within a section
 */
export async function reorderShortcuts(sectionId: string, itemIds: string[]): Promise<void> {
  const config = await loadConfig();
  const section = config.sections.find(s => s.id === sectionId);
  if (!section) throw new Error('Section not found');

  const reorderedItems = itemIds
    .map(id => section.items.find(item => item.id === id))
    .filter((item): item is (Shortcut | Folder) => item !== undefined);

  reorderedItems.forEach((item, index) => {
    item.order = index;
  });

  section.items = reorderedItems;
  await saveConfig(config);
}

/**
 * Helper function to find a folder by ID recursively
 */
function findFolderById(items: (Shortcut | Folder)[], folderId: string): Folder | null {
  for (const item of items) {
    if ('items' in item && item.id === folderId) {
      return item;
    }
    if ('items' in item) {
      const found = findFolderById(item.items, folderId);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Add a folder to a section or inside another folder
 */
export async function addFolder(
  sectionId: string,
  folder: Omit<Folder, 'id' | 'order' | 'isFolder'>,
  parentFolderId?: string
): Promise<Folder> {
  const config = await loadConfig();
  const section = config.sections.find(s => s.id === sectionId);
  if (!section) throw new Error('Section not found');

  const newFolder: Folder = {
    ...folder,
    id: crypto.randomUUID(),
    order: 0,
    isFolder: true,
    items: folder.items || [],
  };

  // If parentFolderId is provided, add to that folder
  if (parentFolderId) {
    const parentFolder = findFolderById(section.items, parentFolderId);
    if (!parentFolder) throw new Error('Parent folder not found');
    newFolder.order = parentFolder.items.length;
    parentFolder.items.push(newFolder);
  } else {
    // Add to section root
    newFolder.order = section.items.length;
    section.items.push(newFolder);
  }

  await saveConfig(config);
  return newFolder;
}

/**
 * Update an existing folder
 */
export async function updateFolder(
  sectionId: string,
  folderId: string,
  updates: Partial<Folder>
): Promise<void> {
  const config = await loadConfig();
  const section = config.sections.find(s => s.id === sectionId);
  if (!section) throw new Error('Section not found');

  const folderIndex = section.items.findIndex(item => 'items' in item && item.id === folderId);
  if (folderIndex === -1) throw new Error('Folder not found');

  const folder = section.items[folderIndex];
  if (!('items' in folder)) throw new Error('Item is not a folder');

  section.items[folderIndex] = {
    ...folder,
    ...updates,
  };
  await saveConfig(config);
}

/**
 * Delete a folder
 */
export async function deleteFolder(sectionId: string, folderId: string): Promise<void> {
  const config = await loadConfig();
  const section = config.sections.find(s => s.id === sectionId);
  if (!section) throw new Error('Section not found');

  section.items = section.items.filter(item => item.id !== folderId);
  // Reorder remaining items
  section.items.forEach((item, index) => {
    item.order = index;
  });
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
