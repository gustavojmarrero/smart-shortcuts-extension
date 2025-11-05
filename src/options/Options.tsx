import { useState, useEffect } from 'react';
import {
  Plus,
  Download,
  Upload,
  GripVertical,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  loadConfig,
  addSection,
  updateSection,
  deleteSection,
  addShortcut,
  updateShortcut,
  deleteShortcut,
  exportConfig,
  importConfig,
  reorderSections,
  reorderShortcuts,
} from '../storage/config';
import type { ShortcutConfig, Section, Shortcut } from '../storage/types';
import { EditShortcutModal, EditSectionModal } from '../popup/components/EditModal';
import { isShortcut } from '../storage/types';

type ModalState =
  | { type: 'none' }
  | { type: 'section'; section?: Section }
  | { type: 'shortcut'; sectionId: string; shortcut?: Shortcut };

export default function Options() {
  const [config, setConfig] = useState<ShortcutConfig | null>(null);
  const [modal, setModal] = useState<ModalState>({ type: 'none' });
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadConfig().then((cfg) => {
      setConfig(cfg);
      // Expand all sections by default
      setExpandedSections(new Set(cfg.sections.map((s) => s.id)));
    });
  }, []);

  const handleExport = async () => {
    const json = await exportConfig();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smart-shortcuts-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const text = await file.text();
        try {
          await importConfig(text);
          const updated = await loadConfig();
          setConfig(updated);
          alert('Configuración importada exitosamente');
        } catch (error) {
          alert('Error al importar configuración. Verifica que el archivo sea válido.');
        }
      }
    };
    input.click();
  };

  const handleSaveSection = async (data: Partial<Section>) => {
    if (modal.type === 'section') {
      if (modal.section) {
        await updateSection(modal.section.id, data);
      } else {
        await addSection({
          name: data.name!,
          icon: data.icon,
          items: [],
        });
      }
      const updated = await loadConfig();
      setConfig(updated);
      setModal({ type: 'none' });
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (confirm('¿Seguro que quieres eliminar esta sección y todos sus shortcuts?')) {
      await deleteSection(sectionId);
      const updated = await loadConfig();
      setConfig(updated);
    }
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
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const moveSectionUp = async (index: number) => {
    if (!config || index === 0) return;
    const sorted = [...config.sections].sort((a, b) => a.order - b.order);
    const newOrder = [...sorted];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    await reorderSections(newOrder.map((s) => s.id));
    const updated = await loadConfig();
    setConfig(updated);
  };

  const moveSectionDown = async (index: number) => {
    if (!config || index === config.sections.length - 1) return;
    const sorted = [...config.sections].sort((a, b) => a.order - b.order);
    const newOrder = [...sorted];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    await reorderSections(newOrder.map((s) => s.id));
    const updated = await loadConfig();
    setConfig(updated);
  };

  const moveShortcutUp = async (sectionId: string, index: number) => {
    const section = config?.sections.find((s) => s.id === sectionId);
    if (!section || index === 0) return;
    const shortcuts = section.items.filter(isShortcut);
    const sorted = [...shortcuts].sort((a, b) => a.order - b.order);
    const newOrder = [...sorted];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    await reorderShortcuts(sectionId, newOrder.map((s) => s.id));
    const updated = await loadConfig();
    setConfig(updated);
  };

  const moveShortcutDown = async (sectionId: string, index: number) => {
    const section = config?.sections.find((s) => s.id === sectionId);
    if (!section) return;
    const shortcuts = section.items.filter(isShortcut);
    if (index === shortcuts.length - 1) return;
    const sorted = [...shortcuts].sort((a, b) => a.order - b.order);
    const newOrder = [...sorted];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    await reorderShortcuts(sectionId, newOrder.map((s) => s.id));
    const updated = await loadConfig();
    setConfig(updated);
  };

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-secondary">Cargando...</div>
      </div>
    );
  }

  const sortedSections = [...config.sections].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-background-secondary">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-text-primary">
                Configuración Avanzada
              </h1>
              <p className="text-small text-text-secondary mt-1">
                Gestiona tus secciones y shortcuts
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleImport}
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-hover transition-smooth"
              >
                <Upload className="w-4 h-4" />
                Importar
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-hover transition-smooth"
              >
                <Download className="w-4 h-4" />
                Exportar
              </button>
              <button
                onClick={() => setModal({ type: 'section' })}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-smooth"
              >
                <Plus className="w-4 h-4" />
                Nueva Sección
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-6">
        {sortedSections.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-text-secondary mb-4">
              No hay secciones configuradas. Crea una para empezar.
            </p>
            <button
              onClick={() => setModal({ type: 'section' })}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-smooth"
            >
              Crear Primera Sección
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedSections.map((section, sectionIndex) => {
              const isExpanded = expandedSections.has(section.id);
              const shortcuts = section.items.filter(isShortcut);
              const sortedShortcuts = [...shortcuts].sort(
                (a, b) => a.order - b.order
              );

              return (
                <div key={section.id} className="bg-background rounded-lg border border-border">
                  {/* Section Header */}
                  <div className="flex items-center gap-3 p-4 border-b border-border">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => moveSectionUp(sectionIndex)}
                        disabled={sectionIndex === 0}
                        className="p-0.5 hover:bg-hover rounded disabled:opacity-30"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => moveSectionDown(sectionIndex)}
                        disabled={sectionIndex === sortedSections.length - 1}
                        className="p-0.5 hover:bg-hover rounded disabled:opacity-30"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>
                    <GripVertical className="w-4 h-4 text-text-secondary" />
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="flex items-center gap-2 flex-1 text-left"
                    >
                      {section.icon && <span className="text-lg">{section.icon}</span>}
                      <span className="font-medium text-text-primary">
                        {section.name}
                      </span>
                      <span className="text-small text-text-secondary">
                        ({sortedShortcuts.length} shortcuts)
                      </span>
                    </button>
                    <button
                      onClick={() =>
                        setModal({ type: 'shortcut', sectionId: section.id })
                      }
                      className="p-2 hover:bg-hover rounded transition-smooth"
                      title="Agregar shortcut"
                    >
                      <Plus className="w-4 h-4 text-text-secondary" />
                    </button>
                    <button
                      onClick={() => setModal({ type: 'section', section })}
                      className="p-2 hover:bg-hover rounded transition-smooth"
                      title="Editar sección"
                    >
                      <Edit2 className="w-4 h-4 text-text-secondary" />
                    </button>
                    <button
                      onClick={() => handleDeleteSection(section.id)}
                      className="p-2 hover:bg-hover rounded transition-smooth"
                      title="Eliminar sección"
                    >
                      <Trash2 className="w-4 h-4 text-text-secondary" />
                    </button>
                  </div>

                  {/* Shortcuts List */}
                  {isExpanded && (
                    <div className="p-2">
                      {sortedShortcuts.length === 0 ? (
                        <div className="text-center py-8 text-small text-text-secondary">
                          No hay shortcuts. Haz clic en + para agregar.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {sortedShortcuts.map((shortcut, shortcutIndex) => (
                            <div
                              key={shortcut.id}
                              className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background-secondary"
                            >
                              <div className="flex flex-col gap-1">
                                <button
                                  onClick={() =>
                                    moveShortcutUp(section.id, shortcutIndex)
                                  }
                                  disabled={shortcutIndex === 0}
                                  className="p-0.5 hover:bg-hover rounded disabled:opacity-30"
                                >
                                  <ChevronUp className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() =>
                                    moveShortcutDown(section.id, shortcutIndex)
                                  }
                                  disabled={
                                    shortcutIndex === sortedShortcuts.length - 1
                                  }
                                  className="p-0.5 hover:bg-hover rounded disabled:opacity-30"
                                >
                                  <ChevronDown className="w-3 h-3" />
                                </button>
                              </div>
                              <GripVertical className="w-4 h-4 text-text-secondary" />
                              {shortcut.icon && (
                                <span className="text-lg">{shortcut.icon}</span>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-text-primary">
                                    {shortcut.label}
                                  </span>
                                  <span
                                    className={`text-small px-2 py-0.5 rounded ${
                                      shortcut.type === 'direct'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-blue-100 text-blue-700'
                                    }`}
                                  >
                                    {shortcut.type === 'direct'
                                      ? 'Directo'
                                      : 'Dinámico'}
                                  </span>
                                </div>
                                <div className="text-small text-text-secondary truncate mt-0.5">
                                  {shortcut.type === 'direct'
                                    ? shortcut.url
                                    : shortcut.urlTemplate}
                                </div>
                              </div>
                              <button
                                onClick={() =>
                                  setModal({
                                    type: 'shortcut',
                                    sectionId: section.id,
                                    shortcut,
                                  })
                                }
                                className="p-2 hover:bg-hover rounded transition-smooth"
                                title="Editar"
                              >
                                <Edit2 className="w-4 h-4 text-text-secondary" />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteShortcut(section.id, shortcut.id)
                                }
                                className="p-2 hover:bg-hover rounded transition-smooth"
                                title="Eliminar"
                              >
                                <Trash2 className="w-4 h-4 text-text-secondary" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

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
