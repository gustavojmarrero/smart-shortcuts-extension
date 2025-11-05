/**
 * Migration utilities to convert old configs to new format
 */
import type { ShortcutConfig, Section } from './types';

/**
 * Migrate v1.0/v2.0 config (with shortcuts array) to v2.1 (with items array)
 */
export function migrateToV2_1(oldConfig: any): ShortcutConfig {
  if (!oldConfig || !oldConfig.sections) {
    return {
      sections: [],
      version: '2.1.0',
      lastModified: Date.now(),
    };
  }

  // Check if already migrated
  if (oldConfig.version === '2.1.0') {
    return oldConfig;
  }

  // Migrate sections
  const migratedSections: Section[] = oldConfig.sections.map((section: any) => {
    // If section has 'shortcuts', migrate to 'items'
    if ('shortcuts' in section) {
      return {
        ...section,
        items: section.shortcuts || [],
        // Remove old 'shortcuts' property
        shortcuts: undefined,
      };
    }
    // Already has 'items'
    return section;
  });

  return {
    sections: migratedSections,
    version: '2.1.0',
    lastModified: Date.now(),
  };
}

/**
 * Check if config needs migration
 */
export function needsMigration(config: any): boolean {
  if (!config) return false;
  if (config.version === '2.1.0') return false;

  // Check if any section has old 'shortcuts' property
  if (config.sections && Array.isArray(config.sections)) {
    return config.sections.some((section: any) => 'shortcuts' in section);
  }

  return false;
}
