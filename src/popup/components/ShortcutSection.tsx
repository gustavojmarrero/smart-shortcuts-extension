import { Plus, Settings, Trash2, ChevronDown, FolderPlus, GripVertical } from 'lucide-react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import DirectLink from './DirectLink';
import DynamicInput from './DynamicInput';
import FolderItem from './FolderItem';
import type { Section, Shortcut, Folder } from '../../storage/types';
import { isShortcut, isFolder } from '../../storage/types';

interface ShortcutSectionProps {
  section: Section;
  isExpanded: boolean;
  onToggle: () => void;
  onEditShortcut: (shortcut: Shortcut) => void;
  onDeleteShortcut: (shortcutId: string) => void;
  onAddShortcut: (parentFolderId?: string) => void;
  onEditFolder: (folder: Folder) => void;
  onDeleteFolder: (folderId: string) => void;
  onAddFolder: (parentFolderId?: string) => void;
  onEditSection: () => void;
  onDeleteSection: () => void;
  onReorderItems?: (sectionId: string, itemIds: string[], parentFolderId?: string) => void;
  onMoveItem?: (itemId: string, sourceSectionId: string, targetSectionId: string, sourceFolderId?: string, targetFolderId?: string, newIndex?: number) => void;
  searchQuery?: string;
  dragHandleProps?: any;
}

export default function ShortcutSection({
  section,
  isExpanded,
  onToggle,
  onEditShortcut,
  onDeleteShortcut,
  onAddShortcut,
  onEditFolder,
  onDeleteFolder,
  onAddFolder,
  onEditSection,
  onDeleteSection,
  onReorderItems,
  onMoveItem,
  searchQuery = '',
  dragHandleProps,
}: ShortcutSectionProps) {
  // Sort all items (shortcuts and folders)
  const sortedItems = [...section.items].sort((a, b) => a.order - b.order);
  const shortcutCount = section.items.filter(isShortcut).length;
  const folderCount = section.items.filter(isFolder).length;

  return (
    <div className="border-b border-border last:border-b-0">
      {/* Section Header - Clickeable para toggle */}
      <div className="flex items-center justify-between bg-background-secondary">
        {/* Drag Handle */}
        {dragHandleProps && (
          <div
            {...dragHandleProps}
            className="px-1 py-1.5 cursor-grab active:cursor-grabbing hover:bg-hover transition-smooth"
            title="Arrastrar para reordenar"
          >
            <GripVertical className="w-3 h-3 text-text-secondary" />
          </div>
        )}

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
            ({shortcutCount} shortcuts{folderCount > 0 ? `, ${folderCount} folders` : ''})
          </span>
        </button>

        {/* Action buttons */}
        <div className="flex items-center gap-0.5 px-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddFolder();
            }}
            className="p-1 hover:bg-hover rounded transition-smooth"
            title="Agregar carpeta"
          >
            <FolderPlus className="w-3 h-3 text-text-secondary" />
          </button>
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

      {/* Content - Droppable always active */}
      <Droppable droppableId={`section-${section.id}`}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`overflow-hidden transition-accordion ${
              isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
            } ${snapshot.isDraggingOver ? 'bg-primary/5' : ''}`}
            style={{ minHeight: isExpanded ? 'auto' : '20px' }}
          >
            {sortedItems.length === 0 ? (
              <div className="text-center py-3 text-[11px] text-text-secondary">
                No hay items. Haz clic en + para agregar shortcuts o carpetas.
              </div>
            ) : (
              <div className="px-2 py-1.5 space-y-0.5">
                {sortedItems.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`${snapshot.isDragging ? 'opacity-50' : ''}`}
                      >
                        {isFolder(item) ? (
                          <div className="flex items-center gap-1">
                            <div
                              {...provided.dragHandleProps}
                              className="cursor-grab active:cursor-grabbing p-1"
                            >
                              <GripVertical className="w-3 h-3 text-text-secondary" />
                            </div>
                            <div className="flex-1">
                              <FolderItem
                                folder={item}
                                depth={0}
                                sectionId={section.id}
                                searchQuery={searchQuery}
                                onEditItem={(editItem) => {
                                  if (isFolder(editItem)) {
                                    onEditFolder(editItem);
                                  } else {
                                    onEditShortcut(editItem);
                                  }
                                }}
                                onDeleteItem={(itemId) => {
                                  const itemToDelete = section.items.find(i => i.id === itemId);
                                  if (itemToDelete && isFolder(itemToDelete)) {
                                    onDeleteFolder(itemId);
                                  } else {
                                    onDeleteShortcut(itemId);
                                  }
                                }}
                                onAddFolder={(_sectionId, parentFolderId) => onAddFolder(parentFolderId)}
                                onAddShortcut={(_sectionId, parentFolderId) => onAddShortcut(parentFolderId)}
                                onReorderItems={onReorderItems}
                                onMoveItem={onMoveItem}
                              />
                            </div>
                          </div>
                        ) : isShortcut(item) ? (
                          <div className="flex items-center gap-1">
                            <div
                              {...provided.dragHandleProps}
                              className="cursor-grab active:cursor-grabbing p-1"
                            >
                              <GripVertical className="w-3 h-3 text-text-secondary" />
                            </div>
                            <div className="flex-1">
                              {item.type === 'direct' ? (
                                <DirectLink
                                  shortcut={item}
                                  onEdit={() => onEditShortcut(item)}
                                  onDelete={() => onDeleteShortcut(item.id)}
                                  searchQuery={searchQuery}
                                />
                              ) : (
                                <DynamicInput
                                  shortcut={item}
                                  onEdit={() => onEditShortcut(item)}
                                  onDelete={() => onDeleteShortcut(item.id)}
                                  searchQuery={searchQuery}
                                />
                              )}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </Draggable>
                ))}
              </div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
