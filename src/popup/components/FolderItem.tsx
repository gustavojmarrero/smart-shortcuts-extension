import { useState } from 'react';
import { ChevronDown, Folder as FolderIcon, Plus, Edit2, Trash2 } from 'lucide-react';
import DirectLink from './DirectLink';
import DynamicInput from './DynamicInput';
import type { Folder, Item, Shortcut } from '../../storage/types';
import { isFolder, isShortcut } from '../../storage/types';

interface FolderItemProps {
  folder: Folder;
  depth: number;
  searchQuery?: string;
  onEditItem: (item: Item) => void;
  onDeleteItem: (itemId: string) => void;
  onAddFolder: (parentFolderId: string) => void;
  onAddShortcut: (parentFolderId: string) => void;
}

export default function FolderItem({
  folder,
  depth,
  searchQuery = '',
  onEditItem,
  onDeleteItem,
  onAddFolder,
  onAddShortcut,
}: FolderItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const sortedItems = [...folder.items].sort((a, b) => a.order - b.order);
  const leftPadding = `${(depth + 1) * 12}px`;

  return (
    <div className="border-l-2 border-border/30">
      {/* Folder Header */}
      <div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ paddingLeft: leftPadding }}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center gap-1.5 px-2 py-1 hover:bg-hover transition-smooth text-left rounded-md"
        >
          <ChevronDown
            className={`w-3 h-3 text-text-secondary transition-transform duration-200 flex-shrink-0 ${
              isExpanded ? 'rotate-0' : '-rotate-90'
            }`}
          />
          {folder.icon ? (
            <span className="text-sm flex-shrink-0">{folder.icon}</span>
          ) : (
            <FolderIcon className="w-3 h-3 text-text-secondary flex-shrink-0" />
          )}
          <span className="text-[12px] font-medium text-text-primary">
            {folder.name}
          </span>
          <span className="text-[10px] text-text-secondary">
            ({sortedItems.length})
          </span>
        </button>

        {/* Hover actions */}
        {isHovered && (
          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-0.5 bg-background shadow-md rounded-lg border border-border p-0.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddFolder(folder.id);
              }}
              className="p-1 hover:bg-hover rounded transition-smooth"
              title="Agregar carpeta"
            >
              <Plus className="w-3 h-3 text-text-secondary" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditItem(folder);
              }}
              className="p-1 hover:bg-hover rounded transition-smooth"
              title="Editar carpeta"
            >
              <Edit2 className="w-3 h-3 text-text-secondary" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteItem(folder.id);
              }}
              className="p-1 hover:bg-hover rounded transition-smooth"
              title="Eliminar carpeta"
            >
              <Trash2 className="w-3 h-3 text-text-secondary" />
            </button>
          </div>
        )}
      </div>

      {/* Folder Content */}
      {isExpanded && (
        <div className="space-y-0.5" style={{ paddingLeft: leftPadding }}>
          {sortedItems.length === 0 ? (
            <div className="text-center py-2 text-[10px] text-text-secondary">
              Carpeta vacía
            </div>
          ) : (
            sortedItems.map((item) => {
              if (isFolder(item)) {
                // Recursive: render nested folder
                return (
                  <FolderItem
                    key={item.id}
                    folder={item}
                    depth={depth + 1}
                    searchQuery={searchQuery}
                    onEditItem={onEditItem}
                    onDeleteItem={onDeleteItem}
                    onAddFolder={onAddFolder}
                    onAddShortcut={onAddShortcut}
                  />
                );
              } else if (isShortcut(item)) {
                // Render shortcut
                return (
                  <div key={item.id} className="pl-4">
                    {item.type === 'direct' ? (
                      <DirectLink
                        shortcut={item}
                        onEdit={() => onEditItem(item)}
                        onDelete={() => onDeleteItem(item.id)}
                        searchQuery={searchQuery}
                      />
                    ) : (
                      <DynamicInput
                        shortcut={item}
                        onEdit={() => onEditItem(item)}
                        onDelete={() => onDeleteItem(item.id)}
                        searchQuery={searchQuery}
                      />
                    )}
                  </div>
                );
              }
              return null;
            })
          )}
        </div>
      )}
    </div>
  );
}
