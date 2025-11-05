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

  // Check if already migrated (has items and version 2.1.0)
  const hasItems = oldConfig.sections.every((s: any) => 'items' in s);
  if (oldConfig.version === '2.1.0' && hasItems) {
    return oldConfig;
  }

  // Migrate sections
  const migratedSections: Section[] = oldConfig.sections.map((section: any) => {
    // If section has 'shortcuts', migrate to 'items'
    if ('shortcuts' in section && !('items' in section)) {
      const { shortcuts, ...rest } = section;
      return {
        ...rest,
        items: shortcuts || [],
      };
    }
    // Already has 'items'
    return section;
  });

  console.log('🔄 Migrating config to v2.1.0');
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

  // Check if version is not 2.1.0
  if (config.version !== '2.1.0') return true;

  // Check if any section has old 'shortcuts' property instead of 'items'
  if (config.sections && Array.isArray(config.sections)) {
    return config.sections.some((section: any) =>
      'shortcuts' in section && !('items' in section)
    );
  }

  return false;
}
