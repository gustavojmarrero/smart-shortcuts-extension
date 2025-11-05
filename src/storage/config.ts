// Storage layer for chrome.storage.sync
import type { ShortcutConfig, Section, Shortcut, Folder, Item, StorageData } from './types';
import { DEFAULT_CONFIG } from './types';

const STORAGE_KEY = 'config';
const BACKUP_KEY = 'shortcuts_backup';

/**
 * Load configuration from chrome.storage.sync
 */
export async function loadConfig(): Promise<ShortcutConfig> {
  try {
    // Check sync storage quota
    const bytesInUse = await chrome.storage.sync.getBytesInUse([STORAGE_KEY]);
    console.log(`🔍 [SYNC] Storage in use: ${bytesInUse} bytes (max: 102,400 bytes)`);

    const result = await chrome.storage.sync.get([STORAGE_KEY]) as StorageData;
    let config: ShortcutConfig = result.config || DEFAULT_CONFIG;

    // Log what we found
    if (result.config) {
      console.log('✅ [SYNC] Config loaded from sync storage');
      console.log(`📊 [SYNC] Sections: ${result.config.sections.length}, Last modified: ${new Date(result.config.lastModified).toLocaleString()}`);
    } else {
      console.log('⚠️ [SYNC] No config found in sync storage');
    }

    // If no config in sync storage, try to recover from localStorage backup
    if (!result.config) {
      console.log('⚠️ No config found in sync storage, checking backup...');
      const backup = localStorage.getItem(BACKUP_KEY);
      if (backup) {
        try {
          const parsedBackup = JSON.parse(backup) as ShortcutConfig;
          config = parsedBackup;
          console.log('✅ Config recovered from backup!');
          // Save recovered config back to sync storage
          await saveConfig(config);
        } catch (e) {
          console.error('Failed to parse backup:', e);
          config = DEFAULT_CONFIG;
        }
      }
    }

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

    // Calculate size before saving
    const configSize = JSON.stringify(updatedConfig).length;
    console.log(`💾 [SYNC] Saving config (${configSize} bytes)...`);

    await chrome.storage.sync.set({ [STORAGE_KEY]: updatedConfig });

    // Verify it was saved
    const bytesInUse = await chrome.storage.sync.getBytesInUse([STORAGE_KEY]);
    console.log(`✅ [SYNC] Config saved successfully! Storage in use: ${bytesInUse} bytes`);
    console.log(`📊 [SYNC] Sections: ${updatedConfig.sections.length}, Last modified: ${new Date(updatedConfig.lastModified).toLocaleString()}`);

    // Also save a backup to localStorage for recovery
    try {
      localStorage.setItem(BACKUP_KEY, JSON.stringify(updatedConfig));
    } catch (e) {
      // localStorage might be full or unavailable, but don't fail the main save
      console.warn('Could not save backup to localStorage:', e);
    }
  } catch (error) {
    console.error('❌ [SYNC] Error saving config:', error);
    if (error instanceof Error) {
      if (error.message.includes('QUOTA_BYTES')) {
        console.error('❌ [SYNC] QUOTA EXCEEDED! Storage limit reached.');
      }
    }
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
 * Delete a shortcut (works recursively for shortcuts inside folders)
 */
export async function deleteShortcut(sectionId: string, shortcutId: string): Promise<void> {
  const config = await loadConfig();
  const section = config.sections.find(s => s.id === sectionId);
  if (!section) throw new Error('Section not found');

  const deleted = deleteItemRecursively(section.items, shortcutId);
  if (!deleted) throw new Error('Shortcut not found');

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
 * Helper function to recursively delete an item (folder or shortcut) by ID
 */
function deleteItemRecursively(items: (Shortcut | Folder)[], itemId: string): boolean {
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === itemId) {
      items.splice(i, 1);
      // Reorder remaining items
      items.forEach((item, index) => {
        item.order = index;
      });
      return true;
    }
    if ('items' in items[i]) {
      const deleted = deleteItemRecursively((items[i] as Folder).items, itemId);
      if (deleted) return true;
    }
  }
  return false;
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

  // Find folder recursively
  const folder = findFolderById(section.items, folderId);
  if (!folder) throw new Error('Folder not found');

  // Update folder properties (keep items intact)
  Object.assign(folder, {
    ...updates,
    items: folder.items, // Preserve items
    isFolder: true, // Preserve discriminator
  });

  await saveConfig(config);
}

/**
 * Delete a folder (works recursively for nested folders)
 */
export async function deleteFolder(sectionId: string, folderId: string): Promise<void> {
  const config = await loadConfig();
  const section = config.sections.find(s => s.id === sectionId);
  if (!section) throw new Error('Section not found');

  const deleted = deleteItemRecursively(section.items, folderId);
  if (!deleted) throw new Error('Folder not found');

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

/**
 * Reorder items within a section or folder
 */
export async function reorderItems(
  sectionId: string,
  itemIds: string[],
  parentFolderId?: string
): Promise<void> {
  const config = await loadConfig();
  const section = config.sections.find(s => s.id === sectionId);
  if (!section) throw new Error('Section not found');

  let targetItems: Item[];

  if (parentFolderId) {
    const parentFolder = findFolderById(section.items, parentFolderId);
    if (!parentFolder) throw new Error('Parent folder not found');
    targetItems = parentFolder.items;
  } else {
    targetItems = section.items;
  }

  // Reorder based on itemIds array
  const reorderedItems = itemIds
    .map(id => targetItems.find(item => item.id === id))
    .filter(Boolean) as Item[];

  // Update order property
  reorderedItems.forEach((item, index) => {
    item.order = index;
  });

  // Replace items array
  if (parentFolderId) {
    const parentFolder = findFolderById(section.items, parentFolderId);
    if (parentFolder) parentFolder.items = reorderedItems;
  } else {
    section.items = reorderedItems;
  }

  await saveConfig(config);
}

/**
 * Move item from one location to another (can be different folders or sections)
 */
export async function moveItem(
  itemId: string,
  sourceSectionId: string,
  targetSectionId: string,
  sourceFolderId?: string,
  targetFolderId?: string,
  newIndex?: number
): Promise<void> {
  const config = await loadConfig();

  // Find source section
  const sourceSection = config.sections.find(s => s.id === sourceSectionId);
  if (!sourceSection) throw new Error('Source section not found');

  // Find target section
  const targetSection = config.sections.find(s => s.id === targetSectionId);
  if (!targetSection) throw new Error('Target section not found');

  // Get source items array
  let sourceItems: Item[];
  if (sourceFolderId) {
    const sourceFolder = findFolderById(sourceSection.items, sourceFolderId);
    if (!sourceFolder) throw new Error('Source folder not found');
    sourceItems = sourceFolder.items;
  } else {
    sourceItems = sourceSection.items;
  }

  // Find and remove item from source
  const itemIndex = sourceItems.findIndex(item => item.id === itemId);
  if (itemIndex === -1) throw new Error('Item not found');
  const [item] = sourceItems.splice(itemIndex, 1);

  // Reorder source items
  sourceItems.forEach((item, index) => {
    item.order = index;
  });

  // Get target items array
  let targetItems: Item[];
  if (targetFolderId) {
    const targetFolder = findFolderById(targetSection.items, targetFolderId);
    if (!targetFolder) throw new Error('Target folder not found');
    targetItems = targetFolder.items;
  } else {
    targetItems = targetSection.items;
  }

  // Insert item at new position
  const insertIndex = newIndex !== undefined ? newIndex : targetItems.length;
  targetItems.splice(insertIndex, 0, item);

  // Reorder target items
  targetItems.forEach((item, index) => {
    item.order = index;
  });

  await saveConfig(config);
}
