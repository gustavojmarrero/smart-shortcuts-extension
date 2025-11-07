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
  ChevronRight,
  FolderPlus,
  Folder as FolderIcon,
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { AuthProvider, useAuth } from '../context/AuthContext';
import Welcome from '../components/Auth/Welcome';
import UserProfile from '../components/Auth/UserProfile';
import {
  loadConfig,
  addSection,
  updateSection,
  deleteSection,
  addShortcut,
  updateShortcut,
  deleteShortcut,
  addFolder,
  updateFolder,
  deleteFolder,
  exportConfig,
  importConfig,
  reorderSections,
  reorderItems,
  moveItem,
} from '../storage/config';
import type { ShortcutConfig, Section, Shortcut, Folder, Item } from '../storage/types';
import { EditShortcutModal, EditSectionModal, EditFolderModal } from '../popup/components/EditModal';
import { isShortcut, isFolder } from '../storage/types';

type ModalState =
  | { type: 'none' }
  | { type: 'section'; section?: Section }
  | { type: 'shortcut'; sectionId: string; shortcut?: Shortcut; parentFolderId?: string }
  | { type: 'folder'; sectionId: string; folder?: Folder; parentFolderId?: string };

function OptionsContent() {
  const { user, loading } = useAuth();
  const [config, setConfig] = useState<ShortcutConfig | null>(null);
  const [modal, setModal] = useState<ModalState>({ type: 'none' });
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

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

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleSaveFolder = async (data: Partial<Folder>) => {
    if (modal.type === 'folder') {
      if (modal.folder) {
        await updateFolder(modal.sectionId, modal.folder.id, data);
      } else {
        await addFolder(
          modal.sectionId,
          {
            name: data.name!,
            icon: data.icon,
            items: [],
          },
          modal.parentFolderId
        );
      }
      const updated = await loadConfig();
      setConfig(updated);
      setModal({ type: 'none' });
    }
  };

  const handleDeleteFolder = async (sectionId: string, folderId: string) => {
    if (confirm('¿Seguro que quieres eliminar esta carpeta y todo su contenido?')) {
      await deleteFolder(sectionId, folderId);
      const updated = await loadConfig();
      setConfig(updated);
    }
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

  // Componente recursivo para renderizar items (shortcuts y folders)
  const renderItems = (
    items: Item[],
    sectionId: string,
    depth: number = 0,
    parentFolderId?: string
  ): JSX.Element[] => {
    const sortedItems = [...items].sort((a, b) => a.order - b.order);

    return sortedItems.map((item, index) => {
      if (isFolder(item)) {
        const isExpanded = expandedFolders.has(item.id);
        return (
          <div key={item.id} className="space-y-2">
            <div
              className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background-secondary"
              style={{ marginLeft: `${depth * 20}px` }}
            >
              <GripVertical className="w-4 h-4 text-text-secondary" />
              <button
                onClick={() => toggleFolder(item.id)}
                className="flex items-center gap-2 flex-1 text-left hover:bg-hover rounded px-2 py-1 transition-smooth"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-text-secondary" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-text-secondary" />
                )}
                {item.icon ? (
                  <span className="text-lg">{item.icon}</span>
                ) : (
                  <FolderIcon className="w-4 h-4 text-text-secondary" />
                )}
                <span className="font-medium text-text-primary">{item.name}</span>
                <span className="text-small text-text-secondary">
                  ({item.items.length} items)
                </span>
              </button>
              <button
                onClick={() =>
                  setModal({
                    type: 'folder',
                    sectionId,
                    parentFolderId: item.id,
                  })
                }
                className="p-2 hover:bg-hover rounded transition-smooth"
                title="Agregar subfolder"
              >
                <FolderPlus className="w-4 h-4 text-text-secondary" />
              </button>
              <button
                onClick={() =>
                  setModal({
                    type: 'shortcut',
                    sectionId,
                    parentFolderId: item.id,
                  })
                }
                className="p-2 hover:bg-hover rounded transition-smooth"
                title="Agregar shortcut"
              >
                <Plus className="w-4 h-4 text-text-secondary" />
              </button>
              <button
                onClick={() =>
                  setModal({
                    type: 'folder',
                    sectionId,
                    folder: item,
                    parentFolderId,
                  })
                }
                className="p-2 hover:bg-hover rounded transition-smooth"
                title="Editar"
              >
                <Edit2 className="w-4 h-4 text-text-secondary" />
              </button>
              <button
                onClick={() => handleDeleteFolder(sectionId, item.id)}
                className="p-2 hover:bg-hover rounded transition-smooth"
                title="Eliminar"
              >
                <Trash2 className="w-4 h-4 text-text-secondary" />
              </button>
            </div>
            {isExpanded && (
              <Droppable droppableId={`folder-${item.id}`}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`space-y-2 p-2 ${snapshot.isDraggingOver ? 'bg-primary/5 rounded' : ''}`}
                    style={{ minHeight: '40px' }}
                  >
                    {item.items.length === 0 && !snapshot.isDraggingOver && (
                      <div className="text-center py-4 text-small text-text-secondary">
                        Arrastra items aquí
                      </div>
                    )}
                    {item.items
                      .sort((a, b) => a.order - b.order)
                      .map((subItem, subIndex) => (
                        <Draggable key={subItem.id} draggableId={subItem.id} index={subIndex}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={snapshot.isDragging ? 'opacity-50' : ''}
                            >
                              <div {...provided.dragHandleProps}>
                                {renderItems([subItem], sectionId, depth + 1, item.id)}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            )}
          </div>
        );
      } else if (isShortcut(item)) {
        return (
          <div
            key={item.id}
            className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background-secondary"
            style={{ marginLeft: `${depth * 20}px` }}
          >
            <div className="flex flex-col gap-1">
              <button
                onClick={() => {
                  // TODO: implement move up for items in folders
                }}
                disabled={index === 0}
                className="p-0.5 hover:bg-hover rounded disabled:opacity-30"
              >
                <ChevronUp className="w-3 h-3" />
              </button>
              <button
                onClick={() => {
                  // TODO: implement move down for items in folders
                }}
                disabled={index === sortedItems.length - 1}
                className="p-0.5 hover:bg-hover rounded disabled:opacity-30"
              >
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
            <GripVertical className="w-4 h-4 text-text-secondary" />
            {item.icon && <span className="text-lg">{item.icon}</span>}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-text-primary">{item.label}</span>
                <span
                  className={`text-small px-2 py-0.5 rounded ${
                    item.type === 'direct'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {item.type === 'direct' ? 'Directo' : 'Dinámico'}
                </span>
              </div>
              <div className="text-small text-text-secondary truncate mt-0.5">
                {item.type === 'direct' ? item.url : item.urlTemplate}
              </div>
            </div>
            <button
              onClick={() =>
                setModal({
                  type: 'shortcut',
                  sectionId,
                  shortcut: item,
                  parentFolderId,
                })
              }
              className="p-2 hover:bg-hover rounded transition-smooth"
              title="Editar"
            >
              <Edit2 className="w-4 h-4 text-text-secondary" />
            </button>
            <button
              onClick={() => handleDeleteShortcut(sectionId, item.id)}
              className="p-2 hover:bg-hover rounded transition-smooth"
              title="Eliminar"
            >
              <Trash2 className="w-4 h-4 text-text-secondary" />
            </button>
          </div>
        );
      }
      return null;
    }).filter(Boolean) as JSX.Element[];
  };

  // Drag and drop handler (similar to App.tsx)
  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    // Parse droppableIds using indexOf to handle UUIDs with hyphens
    const sourceHyphenIndex = source.droppableId.indexOf('-');
    const sourceType = source.droppableId.substring(0, sourceHyphenIndex);
    const sourceId = source.droppableId.substring(sourceHyphenIndex + 1);

    const destHyphenIndex = destination.droppableId.indexOf('-');
    const destType = destination.droppableId.substring(0, destHyphenIndex);
    const destId = destination.droppableId.substring(destHyphenIndex + 1);

    // Find section IDs
    const sourceSectionId = sourceType === 'section' ? sourceId : findSectionForFolder(sourceId);
    const destSectionId = destType === 'section' ? destId : findSectionForFolder(destId);

    if (!sourceSectionId || !destSectionId) return;

    // Same container - reorder
    if (source.droppableId === destination.droppableId) {
      const section = config?.sections.find(s => s.id === sourceSectionId);
      if (!section) return;

      const containerItems = sourceType === 'section'
        ? section.items
        : findFolderItems(section.items, sourceId);

      if (!containerItems) return;

      const sortedItems = [...containerItems].sort((a, b) => a.order - b.order);
      const reordered = Array.from(sortedItems);
      const [removed] = reordered.splice(source.index, 1);
      reordered.splice(destination.index, 0, removed);

      await reorderItems(
        sourceSectionId,
        reordered.map(item => item.id),
        sourceType === 'folder' ? sourceId : undefined
      );
    } else {
      // Different containers - move item
      await moveItem(
        draggableId,
        sourceSectionId,
        destSectionId,
        sourceType === 'folder' ? sourceId : undefined,
        destType === 'folder' ? destId : undefined,
        destination.index
      );
    }

    // Reload config
    const updated = await loadConfig();
    setConfig(updated);
  };

  // Helper: find which section contains a folder
  const findSectionForFolder = (folderId: string): string | null => {
    if (!config) return null;
    for (const section of config.sections) {
      if (findFolderInItems(section.items, folderId)) {
        return section.id;
      }
    }
    return null;
  };

  // Helper: recursively find folder in items
  const findFolderInItems = (items: Item[], folderId: string): boolean => {
    for (const item of items) {
      if (item.id === folderId) return true;
      if (isFolder(item) && findFolderInItems(item.items, folderId)) {
        return true;
      }
    }
    return false;
  };

  // Helper: find folder items by ID
  const findFolderItems = (items: Item[], folderId: string): Item[] | null => {
    for (const item of items) {
      if (isFolder(item)) {
        if (item.id === folderId) return item.items;
        const found = findFolderItems(item.items, folderId);
        if (found) return found;
      }
    }
    return null;
  };

  // Mostrar loading mientras se verifica autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-secondary">Cargando...</div>
      </div>
    );
  }

  // Mostrar Welcome si no está autenticado
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Welcome />
      </div>
    );
  }

  // Mostrar loading mientras se carga config
  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-secondary">Cargando configuración...</div>
      </div>
    );
  }

  const sortedSections = [...config.sections].sort((a, b) => a.order - b.order);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
    <div className="min-h-screen bg-background-secondary">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-text-primary">
                  Configuración Avanzada
                </h1>
                <p className="text-small text-text-secondary mt-1">
                  Gestiona tus secciones y shortcuts
                </p>
              </div>
              <UserProfile />
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
        {/* Sync Info Banner */}
        <div className="mb-6 bg-primary/10 border border-primary/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-text-primary mb-1">
                Sincronización automática activa
              </h3>
              <p className="text-xs text-text-secondary mb-2">
                Tus shortcuts se sincronizan automáticamente entre todos tus dispositivos con Chrome usando tu cuenta de Google.
              </p>
              <details className="text-xs text-text-secondary">
                <summary className="cursor-pointer hover:text-primary transition-smooth">
                  Ver más información
                </summary>
                <div className="mt-2 space-y-1 pl-4 border-l-2 border-primary/30">
                  <p>• <strong>Sincronización automática:</strong> Los cambios se propagan en segundos entre dispositivos</p>
                  <p>• <strong>Backup local:</strong> Copia de seguridad automática en localStorage</p>
                  <p>• <strong>Límite:</strong> ~100KB (suficiente para cientos de shortcuts)</p>
                  <p>• <strong>Exportar/Importar:</strong> Usa los botones arriba para backups manuales o compartir configuraciones</p>
                </div>
              </details>
            </div>
          </div>
        </div>

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
                        ({section.items.length} items)
                      </span>
                    </button>
                    <button
                      onClick={() =>
                        setModal({ type: 'folder', sectionId: section.id })
                      }
                      className="p-2 hover:bg-hover rounded transition-smooth"
                      title="Agregar carpeta"
                    >
                      <FolderPlus className="w-4 h-4 text-text-secondary" />
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

                  {/* Items List (Folders and Shortcuts) */}
                  {isExpanded && (
                    <Droppable droppableId={`section-${section.id}`}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`p-2 ${snapshot.isDraggingOver ? 'bg-primary/5' : ''}`}
                          style={{ minHeight: '40px' }}
                        >
                          {section.items.length === 0 && !snapshot.isDraggingOver && (
                            <div className="text-center py-8 text-small text-text-secondary">
                              No hay items. Haz clic en los botones + o 📁 para agregar.
                            </div>
                          )}
                          <div className="space-y-2">
                            {section.items
                              .sort((a, b) => a.order - b.order)
                              .map((item, index) => (
                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      className={snapshot.isDragging ? 'opacity-50' : ''}
                                    >
                                      <div {...provided.dragHandleProps}>
                                        {renderItems([item], section.id)}
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                          </div>
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
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
      {modal.type === 'folder' && (
        <EditFolderModal
          sectionId={modal.sectionId}
          folder={modal.folder}
          onSave={handleSaveFolder}
          onClose={() => setModal({ type: 'none' })}
        />
      )}
    </div>
    </DragDropContext>
  );
}

// Wrapper principal con AuthProvider
export default function Options() {
  return (
    <AuthProvider>
      <OptionsContent />
    </AuthProvider>
  );
}
