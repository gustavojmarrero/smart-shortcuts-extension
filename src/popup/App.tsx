import { useState, useEffect } from 'react';
import { Settings, ChevronsDown, ChevronsUp, Plus } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import ShortcutSection from './components/ShortcutSection';

// Debug: File loaded
console.log('📦 App.tsx loaded');
import EmptyState from './components/EmptyState';
import SearchBar from './components/SearchBar';
import { EditShortcutModal, EditSectionModal, EditFolderModal } from './components/EditModal';
import { AuthProvider, useAuth } from '../context/AuthContext';
import Welcome from '../components/Auth/Welcome';
import UserProfile from '../components/Auth/UserProfile';
import { useFirestoreConfig } from '../hooks/useFirestoreConfig';
import { useMigration } from '../hooks/useMigration';
import MigrationPrompt from '../components/Migration/MigrationPrompt';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import OfflineBanner from '../components/OfflineBanner';
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
  reorderItems,
  moveItem,
  reorderSections,
} from '../storage/config';
import {
  addSectionToConfig,
  updateSectionInConfig,
  deleteSectionFromConfig,
  addShortcutToConfig,
  updateShortcutInConfig,
  deleteShortcutFromConfig,
  addFolderToConfig,
  updateFolderInConfig,
  deleteFolderFromConfig,
  reorderSectionsInConfig,
  reorderItemsInConfig,
  moveItemInConfig,
} from '../storage/firestore-operations';
import { filterSections } from '../utils/searchUtils';
import type { ShortcutConfig, Section, Shortcut, Folder } from '../storage/types';

type ModalState =
  | { type: 'none' }
  | { type: 'section'; section?: Section }
  | { type: 'shortcut'; sectionId: string; shortcut?: Shortcut; parentFolderId?: string }
  | { type: 'folder'; sectionId: string; folder?: Folder; parentFolderId?: string };

const STORAGE_KEY = 'expandedSections';

function AppContent() {
  const { user, loading: authLoading } = useAuth();
  const {
    config: firestoreConfig,
    loading: firestoreLoading,
    hasConfig: hasFirestoreConfig,
    saveConfig: saveToFirestore,
  } = useFirestoreConfig(user);

  // Hook de migración
  const migration = useMigration(
    user?.uid || null,
    hasFirestoreConfig,
    saveToFirestore
  );

  // Hook de estado de red
  const { isOnline, isReconnecting } = useNetworkStatus();

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

  // Debug: Log when component mounts
  useEffect(() => {
    console.log('='.repeat(50));
    console.log('🚀 Smart Shortcuts App Mounted');
    console.log('DragDropContext is active');
    console.log('='.repeat(50));
  }, []);

  // Sync Firestore config to local state
  useEffect(() => {
    if (user && firestoreConfig) {
      console.log('✅ Config de Firestore disponible, actualizando estado');
      setConfig(firestoreConfig);
      // NO guardar en chrome.storage cuando está autenticado - Firestore es la fuente de verdad
    }
  }, [user, firestoreConfig]);

  // Load config based on auth status (solo primera carga)
  useEffect(() => {
    async function initConfig() {
      if (user) {
        // Usuario autenticado: esperar a que useFirestoreConfig cargue
        console.log('👤 Usuario autenticado, usando Firestore');

        // Si no hay config en Firestore y no está cargando
        // El hook useMigration se encargará de mostrar el prompt si hay datos locales
        if (!firestoreLoading && !firestoreConfig && !hasFirestoreConfig) {
          // Cargar config default para mostrar algo mientras el usuario decide migrar
          const localConfig = await loadConfig();

          // Si el usuario ya tiene datos locales, usarlos temporalmente
          // El hook useMigration mostrará el prompt para migrar
          if (localConfig.sections.length > 0) {
            console.log('📋 Datos locales encontrados, esperando decisión de migración');
            setConfig(localConfig);
          } else {
            // Usuario completamente nuevo
            console.log('🆕 Usuario nuevo sin datos');
            setConfig(localConfig); // DEFAULT_CONFIG
          }
        }
      } else {
        // Usuario no autenticado: usar chrome.storage.sync (comportamiento legacy)
        console.log('🔓 Usuario no autenticado, usando chrome.storage');
        const localConfig = await loadConfig();
        setConfig(localConfig);
      }
    }

    initConfig();
  }, [user, hasFirestoreConfig, firestoreLoading]);

  // Expandir primera sección si es necesario
  useEffect(() => {
    if (config && config.sections.length > 0 && expandedSections.size === 0) {
      const firstSection = [...config.sections].sort((a, b) => a.order - b.order)[0];
      setExpandedSections(new Set([firstSection.id]));
    }
  }, [config]);

  // Guardar expandedSections en localStorage cuando cambien
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...expandedSections]));
    } catch (error) {
      console.error('Error saving expanded sections:', error);
    }
  }, [expandedSections]);

  // Listen for storage changes (solo si NO está autenticado)
  useEffect(() => {
    if (user) {
      // Si está autenticado, Firestore maneja la sincronización en tiempo real
      return;
    }

    const listener = () => {
      loadConfig().then(setConfig);
    };
    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  }, [user]);

  const handleCreateSection = async () => {
    setModal({ type: 'section' });
  };

  const handleSaveSection = async (data: Partial<Section>) => {
    if (modal.type === 'section') {
      if (user && saveToFirestore && config) {
        // Usuario autenticado: guardar directamente en Firestore
        let updatedConfig: ShortcutConfig;
        let newSectionId: string | null = null;

        if (modal.section) {
          // Actualizar sección existente
          updatedConfig = updateSectionInConfig(config, modal.section.id, data);
        } else {
          // Crear nueva sección
          const result = addSectionToConfig(config, {
            name: data.name!,
            icon: data.icon,
          });
          updatedConfig = result.config;
          newSectionId = result.newSection.id;
        }

        // Optimistic update: actualizar UI inmediatamente
        setConfig(updatedConfig);

        // Guardar en Firestore
        await saveToFirestore(updatedConfig);

        // Auto-expandir nueva sección
        if (newSectionId) {
          setExpandedSections((prev) => new Set([...prev, newSectionId!]));
        }
      } else {
        // Usuario no autenticado: usar chrome.storage.sync (legacy)
        if (modal.section) {
          await updateSection(modal.section.id, data);
        } else {
          const newSection = await addSection({
            name: data.name!,
            icon: data.icon,
            items: [],
          });
          setExpandedSections((prev) => new Set([...prev, newSection.id]));
        }
        await reloadAndSync();
      }
      setModal({ type: 'none' });
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (confirm('¿Seguro que quieres eliminar esta sección?')) {
      if (user && saveToFirestore && config) {
        // Usuario autenticado: Firestore
        const updatedConfig = deleteSectionFromConfig(config, sectionId);
        setConfig(updatedConfig);
        await saveToFirestore(updatedConfig);
      } else {
        // Usuario no autenticado: chrome.storage.sync
        await deleteSection(sectionId);
        await reloadAndSync();
      }
      // Remover de expandedSections
      setExpandedSections((prev) => {
        const next = new Set(prev);
        next.delete(sectionId);
        return next;
      });
    }
  };

  const handleAddShortcut = (sectionId: string, parentFolderId?: string) => {
    setModal({ type: 'shortcut', sectionId, parentFolderId });
  };

  const handleSaveShortcut = async (data: Partial<Shortcut>) => {
    if (modal.type === 'shortcut') {
      if (user && saveToFirestore && config) {
        // Usuario autenticado: Firestore
        let updatedConfig: ShortcutConfig;

        if (modal.shortcut) {
          updatedConfig = updateShortcutInConfig(config, modal.sectionId, modal.shortcut.id, data);
        } else {
          updatedConfig = addShortcutToConfig(
            config,
            modal.sectionId,
            {
              type: data.type!,
              label: data.label!,
              url: data.url,
              urlTemplate: data.urlTemplate,
              placeholder: data.placeholder,
              icon: data.icon,
              description: data.description,
              inputType: data.inputType,
              validationRegex: data.validationRegex,
              validationMessage: data.validationMessage,
            },
            modal.parentFolderId
          );
        }

        setConfig(updatedConfig);
        await saveToFirestore(updatedConfig);
      } else {
        // Usuario no autenticado: chrome.storage.sync
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
            validationRegex: data.validationRegex,
            validationMessage: data.validationMessage,
          }, modal.parentFolderId);
        }
        await reloadAndSync();
      }
      setModal({ type: 'none' });
    }
  };

  const handleDeleteShortcut = async (sectionId: string, shortcutId: string) => {
    if (confirm('¿Seguro que quieres eliminar este shortcut?')) {
      if (user && saveToFirestore && config) {
        const updatedConfig = deleteShortcutFromConfig(config, sectionId, shortcutId);
        setConfig(updatedConfig);
        await saveToFirestore(updatedConfig);
      } else {
        await deleteShortcut(sectionId, shortcutId);
        await reloadAndSync();
      }
    }
  };

  const handleAddFolder = (sectionId: string, parentFolderId?: string) => {
    setModal({ type: 'folder', sectionId, parentFolderId });
  };

  const handleSaveFolder = async (data: Partial<Folder>) => {
    if (modal.type === 'folder') {
      if (user && saveToFirestore && config) {
        let updatedConfig: ShortcutConfig;

        if (modal.folder) {
          updatedConfig = updateFolderInConfig(config, modal.sectionId, modal.folder.id, data);
        } else {
          updatedConfig = addFolderToConfig(
            config,
            modal.sectionId,
            {
              name: data.name!,
              icon: data.icon,
            },
            modal.parentFolderId
          );
        }

        setConfig(updatedConfig);
        await saveToFirestore(updatedConfig);
      } else {
        if (modal.folder) {
          await updateFolder(modal.sectionId, modal.folder.id, data);
        } else {
          await addFolder(modal.sectionId, {
            name: data.name!,
            icon: data.icon,
            items: [],
          }, modal.parentFolderId);
        }
        await reloadAndSync();
      }
      setModal({ type: 'none' });
    }
  };

  const handleDeleteFolder = async (sectionId: string, folderId: string) => {
    if (confirm('¿Seguro que quieres eliminar esta carpeta y todo su contenido?')) {
      if (user && saveToFirestore && config) {
        const updatedConfig = deleteFolderFromConfig(config, sectionId, folderId);
        setConfig(updatedConfig);
        await saveToFirestore(updatedConfig);
      } else {
        await deleteFolder(sectionId, folderId);
        await reloadAndSync();
      }
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

  /**
   * Helper: Recargar config y sincronizar con Firestore si está autenticado
   */
  const reloadAndSync = async () => {
    if (user && saveToFirestore) {
      // Usuario autenticado: NO recargar desde chrome.storage, solo sincronizar con Firestore
      // Las operaciones ya guardaron en chrome.storage.sync, ahora solo propagamos a Firestore
      try {
        const updated = await loadConfig();
        await saveToFirestore(updated);
        console.log('✅ Sincronizado con Firestore');
        // No llamar setConfig aquí - el snapshot de Firestore lo actualizará
      } catch (error) {
        console.error('❌ Error sincronizando con Firestore:', error);
        // En caso de error, actualizar el estado local al menos
        const updated = await loadConfig();
        setConfig(updated);
      }
    } else {
      // Usuario no autenticado: comportamiento legacy
      const updated = await loadConfig();
      setConfig(updated);
    }
  };

  // Mostrar loading mientras se verifica autenticación o se carga Firestore
  if (authLoading || (user && firestoreLoading)) {
    return (
      <div className="w-[380px] h-[600px] flex items-center justify-center">
        <div className="text-text-secondary">
          {authLoading ? 'Verificando autenticación...' : 'Cargando configuración...'}
        </div>
      </div>
    );
  }

  // Mostrar Welcome si no está autenticado
  if (!user) {
    return <Welcome />;
  }

  // Mostrar loading mientras se carga config
  if (!config) {
    return (
      <div className="w-[380px] h-[600px] flex items-center justify-center">
        <div className="text-text-secondary">Cargando configuración...</div>
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

  // Global drag and drop handler
  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    console.log('🔄 Drag end:', {
      draggableId,
      source: source.droppableId,
      destination: destination?.droppableId,
      sourceIndex: source.index,
      destIndex: destination?.index
    });

    // Dropped outside valid droppable
    if (!destination) {
      console.log('⚠️ No destination - dropped outside');
      return;
    }

    // Same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      console.log('⚠️ Same position - no action needed');
      return;
    }

    // Handle section reordering
    if (source.droppableId === 'sections' && destination.droppableId === 'sections') {
      console.log('📦 Reordering sections');
      const reordered = Array.from(sortedSections);
      const [removed] = reordered.splice(source.index, 1);
      reordered.splice(destination.index, 0, removed);

      if (user && saveToFirestore && config) {
        const updatedConfig = reorderSectionsInConfig(config, reordered.map(s => s.id));
        setConfig(updatedConfig);
        await saveToFirestore(updatedConfig);
      } else {
        await reorderSections(reordered.map(s => s.id));
        await reloadAndSync();
      }
      return;
    }

    // Parse droppableIds: "section-{id}" or "folder-{id}"
    // Use indexOf and substring to handle IDs with hyphens
    const sourceHyphenIndex = source.droppableId.indexOf('-');
    const sourceType = source.droppableId.substring(0, sourceHyphenIndex);
    const sourceId = source.droppableId.substring(sourceHyphenIndex + 1);

    const destHyphenIndex = destination.droppableId.indexOf('-');
    const destType = destination.droppableId.substring(0, destHyphenIndex);
    const destId = destination.droppableId.substring(destHyphenIndex + 1);

    console.log('📍 Parsed IDs:', {
      sourceType,
      sourceId,
      destType,
      destId
    });

    // Find source and destination sections
    const sourceSectionId = sourceType === 'section' ? sourceId : findSectionForFolder(sourceId);
    const destSectionId = destType === 'section' ? destId : findSectionForFolder(destId);

    console.log('🔍 Section IDs:', {
      sourceSectionId,
      destSectionId
    });

    if (!sourceSectionId || !destSectionId) {
      console.log('⚠️ Could not find section IDs');
      return;
    }

    // Same container - just reorder
    if (source.droppableId === destination.droppableId) {
      console.log('↕️ Reordering within same container');
      const section = config?.sections.find(s => s.id === sourceSectionId);
      if (!section) {
        console.log('⚠️ Section not found');
        return;
      }

      const containerItems = sourceType === 'section'
        ? section.items
        : findFolderItems(section.items, sourceId);

      if (!containerItems) {
        console.log('⚠️ Container items not found');
        return;
      }

      const sortedItems = [...containerItems].sort((a, b) => a.order - b.order);
      const reordered = Array.from(sortedItems);
      const [removed] = reordered.splice(source.index, 1);
      reordered.splice(destination.index, 0, removed);

      console.log('✅ Reordering items:', reordered.map(i => i.id));

      if (user && saveToFirestore && config) {
        const updatedConfig = reorderItemsInConfig(
          config,
          sourceSectionId,
          reordered.map(item => item.id),
          sourceType === 'folder' ? sourceId : undefined
        );
        setConfig(updatedConfig);
        await saveToFirestore(updatedConfig);
      } else {
        await reorderItems(
          sourceSectionId,
          reordered.map(item => item.id),
          sourceType === 'folder' ? sourceId : undefined
        );
        await reloadAndSync();
      }
    } else {
      // Different containers - move item
      console.log('➡️ Moving between containers');

      if (user && saveToFirestore && config) {
        const updatedConfig = moveItemInConfig(
          config,
          draggableId,
          sourceSectionId,
          destSectionId,
          sourceType === 'folder' ? sourceId : undefined,
          destType === 'folder' ? destId : undefined,
          destination.index
        );
        setConfig(updatedConfig);
        await saveToFirestore(updatedConfig);
      } else {
        await moveItem(
          draggableId,
          sourceSectionId,
          destSectionId,
          sourceType === 'folder' ? sourceId : undefined,
          destType === 'folder' ? destId : undefined,
          destination.index
        );
        await reloadAndSync();
      }
      console.log('✅ Item moved successfully');
    }

    console.log('✅ Config updated');
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
  const findFolderInItems = (items: any[], folderId: string): boolean => {
    for (const item of items) {
      if (item.id === folderId) return true;
      if ('items' in item && findFolderInItems(item.items, folderId)) {
        return true;
      }
    }
    return false;
  };

  // Helper: find folder items by ID
  const findFolderItems = (items: any[], folderId: string): any[] | null => {
    for (const item of items) {
      if ('items' in item) {
        if (item.id === folderId) return item.items;
        const found = findFolderItems(item.items, folderId);
        if (found) return found;
      }
    }
    return null;
  };

  return (
    <DragDropContext
      onDragEnd={handleDragEnd}
      onDragStart={(result) => {
        console.log('🎯 Drag started:', result.draggableId);
      }}
    >
      <div className="w-[380px] h-[600px] flex flex-col bg-background relative">
      {/* Offline Banner */}
      {user && <OfflineBanner isOnline={isOnline} isReconnecting={isReconnecting} />}

      {/* Header */}
      <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-border bg-background">
        <h1 className="text-[15px] font-semibold text-text-primary">
          Smart Shortcuts
        </h1>
        <div className="flex items-center gap-2">
          <UserProfile />
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
          <Droppable droppableId="sections" type="SECTION">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={snapshot.isDraggingOver ? 'bg-primary/5' : ''}
              >
                {displaySections.map((section, index) => (
                  <Draggable key={section.id} draggableId={section.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={snapshot.isDragging ? 'opacity-70 shadow-lg' : ''}
                      >
                        <ShortcutSection
                          section={section}
                          isExpanded={effectiveExpandedSections.has(section.id)}
                          onToggle={() => toggleSection(section.id)}
                          onEditShortcut={(shortcut) =>
                            setModal({ type: 'shortcut', sectionId: section.id, shortcut })
                          }
                          onDeleteShortcut={(shortcutId) =>
                            handleDeleteShortcut(section.id, shortcutId)
                          }
                          onAddShortcut={(parentFolderId) => handleAddShortcut(section.id, parentFolderId)}
                          onEditFolder={(folder) =>
                            setModal({ type: 'folder', sectionId: section.id, folder })
                          }
                          onDeleteFolder={(folderId) =>
                            handleDeleteFolder(section.id, folderId)
                          }
                          onAddFolder={(parentFolderId) => handleAddFolder(section.id, parentFolderId)}
                          onEditSection={() => setModal({ type: 'section', section })}
                          onDeleteSection={() => handleDeleteSection(section.id)}
                          onReorderItems={async (sectionId, itemIds, parentFolderId) => {
                            if (user && saveToFirestore && config) {
                              const updatedConfig = reorderItemsInConfig(config, sectionId, itemIds, parentFolderId);
                              setConfig(updatedConfig);
                              await saveToFirestore(updatedConfig);
                            } else {
                              await reorderItems(sectionId, itemIds, parentFolderId);
                              await reloadAndSync();
                            }
                          }}
                          onMoveItem={async (itemId, sourceSectionId, targetSectionId, sourceFolderId, targetFolderId, newIndex) => {
                            if (user && saveToFirestore && config) {
                              const updatedConfig = moveItemInConfig(config, itemId, sourceSectionId, targetSectionId, sourceFolderId, targetFolderId, newIndex);
                              setConfig(updatedConfig);
                              await saveToFirestore(updatedConfig);
                            } else {
                              await moveItem(itemId, sourceSectionId, targetSectionId, sourceFolderId, targetFolderId, newIndex);
                              await reloadAndSync();
                            }
                          }}
                          searchQuery={searchQuery}
                          dragHandleProps={provided.dragHandleProps}
                        />
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

      {/* Floating Add Section Button */}
      {sortedSections.length > 0 && (
        <button
          onClick={handleCreateSection}
          className="absolute bottom-4 right-4 p-3 bg-primary text-white rounded-full shadow-lg hover:bg-primary-hover transition-smooth flex items-center justify-center"
          title="Nueva Sección"
        >
          <Plus className="w-5 h-5" />
        </button>
      )}

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

      {/* Migration Prompt */}
      {migration.needsPrompt && migration.localConfig && (
        <MigrationPrompt
          localConfig={migration.localConfig}
          progress={migration.progress}
          isMigrating={migration.status === 'migrating'}
          error={migration.error}
          onMigrate={migration.startMigration}
          onSkip={migration.skipMigration}
          onNever={migration.neverMigrate}
        />
      )}
      </div>
    </DragDropContext>
  );
}

// Wrapper principal con AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
