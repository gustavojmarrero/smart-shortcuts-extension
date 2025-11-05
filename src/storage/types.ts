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
  shortcuts: Shortcut[];
  order: number;
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
  version: '1.0.0',
  lastModified: Date.now(),
};
