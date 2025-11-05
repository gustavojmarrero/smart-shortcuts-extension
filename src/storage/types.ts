// Core Types for Smart Shortcuts Extension

export interface ShortcutConfig {
  sections: Section[];
  version: string;
  lastModified: number;
}

export interface Section {
  id: string;
  name: string;
  icon?: string; // Emoji or URL
  color?: string; // Hex color for section theme
  items: Item[]; // Can contain shortcuts OR folders
  order: number;
}

// Union type for items that can be in a section or folder
export type Item = Shortcut | Folder;

// Type guard functions
export function isFolder(item: Item): item is Folder {
  return 'items' in item;
}

export function isShortcut(item: Item): item is Shortcut {
  return 'type' in item && (item.type === 'direct' || item.type === 'dynamic');
}

export interface Folder {
  id: string;
  name: string;
  icon?: string;
  items: Item[]; // Recursive: can contain shortcuts OR more folders
  order: number;
  isFolder: true; // Discriminator
}

export interface Shortcut {
  id: string;
  type: 'direct' | 'dynamic';
  label: string;

  // For direct links
  url?: string;

  // For dynamic links with input
  urlTemplate?: string; // e.g., "https://amazon.com/orders/{input}"
  placeholder?: string; // Input placeholder text
  inputType?: 'text' | 'number';

  // Metadata
  icon?: string;
  description?: string;
  order: number;
}

export interface StorageData {
  config?: ShortcutConfig;
}

// Default empty config
export const DEFAULT_CONFIG: ShortcutConfig = {
  sections: [],
  version: '2.1.0',
  lastModified: Date.now(),
};

// Helper function to create a new folder
export function createFolder(name: string, icon?: string): Folder {
  return {
    id: crypto.randomUUID(),
    name,
    icon,
    items: [],
    order: 0,
    isFolder: true,
  };
}

// Helper function to create a new shortcut
export function createShortcut(
  type: 'direct' | 'dynamic',
  label: string,
  urlOrTemplate: string
): Shortcut {
  const base: Shortcut = {
    id: crypto.randomUUID(),
    type,
    label,
    order: 0,
  };

  if (type === 'direct') {
    base.url = urlOrTemplate;
  } else {
    base.urlTemplate = urlOrTemplate;
  }

  return base;
}
