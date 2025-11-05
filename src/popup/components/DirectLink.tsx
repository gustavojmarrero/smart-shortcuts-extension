import { ExternalLink, Edit2, Trash2 } from 'lucide-react';
import { openUrl } from '../../utils/urlBuilder';
import { HighlightedText } from './HighlightedText';
import type { Shortcut } from '../../storage/types';
import { useState } from 'react';

interface DirectLinkProps {
  shortcut: Shortcut;
  onEdit: () => void;
  onDelete: () => void;
  searchQuery?: string;
}

export default function DirectLink({ shortcut, onEdit, onDelete, searchQuery = '' }: DirectLinkProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (shortcut.url) {
      openUrl(shortcut.url);
    }
  };

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={handleClick}
        className="w-full flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-hover transition-smooth text-left focus-ring"
      >
        {shortcut.icon && (
          <span className="text-base flex-shrink-0">{shortcut.icon}</span>
        )}
        <div className="flex-1 min-w-0">
          <div className="text-[12px] text-text-primary font-medium">
            <HighlightedText text={shortcut.label} query={searchQuery} />
          </div>
          {shortcut.description && (
            <div className="text-[10px] text-text-secondary truncate">
              <HighlightedText text={shortcut.description} query={searchQuery} />
            </div>
          )}
        </div>
        <ExternalLink className="w-3.5 h-3.5 text-text-secondary flex-shrink-0" />
      </button>

      {/* Quick actions on hover */}
      {isHovered && (
        <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex gap-0.5 bg-background shadow-md rounded-lg border border-border p-0.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-1 hover:bg-hover rounded transition-smooth"
            title="Editar"
          >
            <Edit2 className="w-3 h-3 text-text-secondary" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 hover:bg-hover rounded transition-smooth"
            title="Eliminar"
          >
            <Trash2 className="w-3 h-3 text-text-secondary" />
          </button>
        </div>
      )}
    </div>
  );
}
