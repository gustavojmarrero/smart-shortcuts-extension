import { useState, useEffect } from 'react';
import { Settings, ChevronsDown, ChevronsUp } from 'lucide-react';
import ShortcutSection from './components/ShortcutSection';
import EmptyState from './components/EmptyState';
import SearchBar from './components/SearchBar';
import { EditShortcutModal, EditSectionModal } from './components/EditModal';
import {
  loadConfig,
  addSection,
  updateSection,
  deleteSection,
  addShortcut,
  updateShortcut,
  deleteShortcut,
} from '../storage/config';
import { filterSections } from '../utils/searchUtils';
import type { ShortcutConfig, Section, Shortcut } from '../storage/types';

type ModalState =
  | { type: 'none' }
  | { type: 'section'; section?: Section }
  | { type: 'shortcut'; sectionId: string; shortcut?: Shortcut };

const STORAGE_KEY = 'expandedSections';

export default function App() {
  const [config, setConfig] = useState<ShortcutConfig | null>(null);
  const [modal, setModal] = useState<ModalState>({ type: 'none' });
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(() => {
    // Cargar desde localStorage
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return new Set(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading expanded sections:', error);
    }
    return new Set();
  });

  // Load config on mount
  useEffect(() => {
    loadConfig().then((cfg) => {
      setConfig(cfg);
      // Si no hay secciones expandidas guardadas, expandir la primera
      if (cfg.sections.length > 0 && expandedSections.size === 0) {
        const firstSection = [...cfg.sections].sort((a, b) => a.order - b.order)[0];
        setExpandedSections(new Set([firstSection.id]));
      }
    });
  }, []);

  // Guardar expandedSections en localStorage cuando cambien
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...expandedSections]));
    } catch (error) {
      console.error('Error saving expanded sections:', error);
    }
  }, [expandedSections]);

  // Listen for storage changes
  useEffect(() => {
    const listener = () => {
      loadConfig().then(setConfig);
    };
    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  }, []);

  const handleCreateSection = async () => {
    setModal({ type: 'section' });
  };

  const handleSaveSection = async (data: Partial<Section>) => {
    if (modal.type === 'section') {
      if (modal.section) {
        await updateSection(modal.section.id, data);
      } else {
        const newSection = await addSection({
          name: data.name!,
          icon: data.icon,
          items: [],
        });
        // Auto-expandir nueva sección
        setExpandedSections((prev) => new Set([...prev, newSection.id]));
      }
      const updated = await loadConfig();
      setConfig(updated);
      setModal({ type: 'none' });
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (confirm('¿Seguro que quieres eliminar esta sección?')) {
      await deleteSection(sectionId);
      // Remover de expandedSections
      setExpandedSections((prev) => {
        const next = new Set(prev);
        next.delete(sectionId);
        return next;
      });
      const updated = await loadConfig();
      setConfig(updated);
    }
  };

  const handleAddShortcut = (sectionId: string) => {
    setModal({ type: 'shortcut', sectionId });
  };

  const handleSaveShortcut = async (data: Partial<Shortcut>) => {
    if (modal.type === 'shortcut') {
      if (modal.shortcut) {
        await updateShortcut(modal.sectionId, modal.shortcut.id, data);
      } else {
        await addShortcut(modal.sectionId, {
          type: data.type!,
          label: data.label!,
          url: data.url,
          urlTemplate: data.urlTemplate,
          placeholder: data.placeholder,
          icon: data.icon,
          description: data.description,
          inputType: data.inputType,
        });
      }
      const updated = await loadConfig();
      setConfig(updated);
      setModal({ type: 'none' });
    }
  };

  const handleDeleteShortcut = async (sectionId: string, shortcutId: string) => {
    if (confirm('¿Seguro que quieres eliminar este shortcut?')) {
      await deleteShortcut(sectionId, shortcutId);
      const updated = await loadConfig();
      setConfig(updated);
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const toggleAllSections = () => {
    if (!config) return;
    const allSectionIds = config.sections.map((s) => s.id);
    if (expandedSections.size === allSectionIds.length) {
      // Todas están expandidas → colapsar todas
      setExpandedSections(new Set());
    } else {
      // Algunas o ninguna expandida → expandir todas
      setExpandedSections(new Set(allSectionIds));
    }
  };

  const openOptions = () => {
    chrome.runtime.openOptionsPage();
  };

  if (!config) {
    return (
      <div className="w-[380px] h-[600px] flex items-center justify-center">
        <div className="text-text-secondary">Cargando...</div>
      </div>
    );
  }

  const sortedSections = [...config.sections].sort((a, b) => a.order - b.order);

  // Filtrar secciones según búsqueda
  const { sections: displaySections, expandedIds: searchExpandedIds } = searchQuery
    ? filterSections(sortedSections, searchQuery)
    : { sections: sortedSections, expandedIds: [] };

  // Si hay búsqueda activa, usar los IDs de búsqueda para expansión
  const effectiveExpandedSections = searchQuery
    ? new Set(searchExpandedIds)
    : expandedSections;

  const allExpanded = displaySections.length > 0 && expandedSections.size === sortedSections.length;

  return (
    <div className="w-[380px] h-[600px] flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-border bg-background">
        <h1 className="text-[15px] font-semibold text-text-primary">
          Smart Shortcuts
        </h1>
        <div className="flex items-center gap-1">
          {sortedSections.length > 0 && (
            <button
              onClick={toggleAllSections}
              className="p-1 hover:bg-hover rounded transition-smooth"
              title={allExpanded ? 'Colapsar todo' : 'Expandir todo'}
            >
              {allExpanded ? (
                <ChevronsUp className="w-3.5 h-3.5 text-text-secondary" />
              ) : (
                <ChevronsDown className="w-3.5 h-3.5 text-text-secondary" />
              )}
            </button>
          )}
          <button
            onClick={openOptions}
            className="p-1 hover:bg-hover rounded transition-smooth"
            title="Configuración avanzada"
          >
            <Settings className="w-3.5 h-3.5 text-text-secondary" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {sortedSections.length > 0 && (
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
        />
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {sortedSections.length === 0 ? (
          <EmptyState onCreateSection={handleCreateSection} />
        ) : displaySections.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-8 text-center">
            <div className="text-[13px] text-text-secondary mb-2">
              No se encontraron resultados para "{searchQuery}"
            </div>
            <button
              onClick={() => setSearchQuery('')}
              className="text-[11px] text-primary hover:underline"
            >
              Limpiar búsqueda
            </button>
          </div>
        ) : (
          displaySections.map((section) => (
            <ShortcutSection
              key={section.id}
              section={section}
              isExpanded={effectiveExpandedSections.has(section.id)}
              onToggle={() => toggleSection(section.id)}
              onEditShortcut={(shortcut) =>
                setModal({ type: 'shortcut', sectionId: section.id, shortcut })
              }
              onDeleteShortcut={(shortcutId) =>
                handleDeleteShortcut(section.id, shortcutId)
              }
              onAddShortcut={() => handleAddShortcut(section.id)}
              onEditSection={() => setModal({ type: 'section', section })}
              onDeleteSection={() => handleDeleteSection(section.id)}
              searchQuery={searchQuery}
            />
          ))
        )}
      </div>

      {/* Modals */}
      {modal.type === 'section' && (
        <EditSectionModal
          section={modal.section}
          onSave={handleSaveSection}
          onClose={() => setModal({ type: 'none' })}
        />
      )}
      {modal.type === 'shortcut' && (
        <EditShortcutModal
          sectionId={modal.sectionId}
          shortcut={modal.shortcut}
          onSave={handleSaveShortcut}
          onClose={() => setModal({ type: 'none' })}
        />
      )}
    </div>
  );
}
