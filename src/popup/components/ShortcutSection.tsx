import { Plus, Settings, Trash2, ChevronDown } from 'lucide-react';
import DirectLink from './DirectLink';
import DynamicInput from './DynamicInput';
import type { Section, Shortcut } from '../../storage/types';

interface ShortcutSectionProps {
  section: Section;
  isExpanded: boolean;
  onToggle: () => void;
  onEditShortcut: (shortcut: Shortcut) => void;
  onDeleteShortcut: (shortcutId: string) => void;
  onAddShortcut: () => void;
  onEditSection: () => void;
  onDeleteSection: () => void;
  searchQuery?: string;
}

export default function ShortcutSection({
  section,
  isExpanded,
  onToggle,
  onEditShortcut,
  onDeleteShortcut,
  onAddShortcut,
  onEditSection,
  onDeleteSection,
  searchQuery = '',
}: ShortcutSectionProps) {
  const sortedShortcuts = [...section.shortcuts].sort((a, b) => a.order - b.order);

  return (
    <div className="border-b border-border last:border-b-0">
      {/* Section Header - Clickeable para toggle */}
      <div className="flex items-center justify-between bg-background-secondary">
        <button
          onClick={onToggle}
          className="flex-1 flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-hover transition-smooth text-left"
        >
          {/* Chevron indicator */}
          <ChevronDown
            className={`w-3.5 h-3.5 text-text-secondary transition-transform duration-200 flex-shrink-0 ${
              isExpanded ? 'rotate-0' : '-rotate-90'
            }`}
          />
          {section.icon && <span className="text-base flex-shrink-0">{section.icon}</span>}
          <h3 className="text-[13px] font-medium text-text-primary">
            {section.name}
          </h3>
          {/* Badge con contador */}
          <span className="text-[10px] text-text-secondary">
            ({sortedShortcuts.length})
          </span>
        </button>

        {/* Action buttons */}
        <div className="flex items-center gap-0.5 px-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddShortcut();
            }}
            className="p-1 hover:bg-hover rounded transition-smooth"
            title="Agregar shortcut"
          >
            <Plus className="w-3 h-3 text-text-secondary" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditSection();
            }}
            className="p-1 hover:bg-hover rounded transition-smooth"
            title="Editar sección"
          >
            <Settings className="w-3 h-3 text-text-secondary" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteSection();
            }}
            className="p-1 hover:bg-hover rounded transition-smooth"
            title="Eliminar sección"
          >
            <Trash2 className="w-3 h-3 text-text-secondary" />
          </button>
        </div>
      </div>

      {/* Content con animación de collapse */}
      <div
        className={`overflow-hidden transition-accordion ${
          isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-2 py-1.5 space-y-0.5">
          {sortedShortcuts.length === 0 ? (
            <div className="text-center py-3 text-[11px] text-text-secondary">
              No hay shortcuts. Haz clic en + para agregar uno.
            </div>
          ) : (
            sortedShortcuts.map((shortcut) => (
              <div key={shortcut.id}>
                {shortcut.type === 'direct' ? (
                  <DirectLink
                    shortcut={shortcut}
                    onEdit={() => onEditShortcut(shortcut)}
                    onDelete={() => onDeleteShortcut(shortcut.id)}
                    searchQuery={searchQuery}
                  />
                ) : (
                  <DynamicInput
                    shortcut={shortcut}
                    onEdit={() => onEditShortcut(shortcut)}
                    onDelete={() => onDeleteShortcut(shortcut.id)}
                    searchQuery={searchQuery}
                  />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
