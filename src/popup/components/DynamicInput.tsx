import { ArrowRight, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { buildUrl, openUrl } from '../../utils/urlBuilder';
import { HighlightedText } from './HighlightedText';
import type { Shortcut } from '../../storage/types';

interface DynamicInputProps {
  shortcut: Shortcut;
  onEdit: () => void;
  onDelete: () => void;
  searchQuery?: string;
}

export default function DynamicInput({ shortcut, onEdit, onDelete, searchQuery = '' }: DynamicInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && shortcut.urlTemplate) {
      const url = buildUrl(shortcut.urlTemplate, inputValue);
      openUrl(url);
      setInputValue(''); // Clear input after opening
    }
  };

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-1 p-1.5 rounded-lg hover:bg-hover transition-smooth">
        <div className="flex items-center gap-1.5">
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
        </div>

        <div className="flex gap-1.5">
          <input
            type={shortcut.inputType || 'text'}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={shortcut.placeholder || 'Ingresa valor...'}
            className="flex-1 px-2 py-0.5 text-[11px] border border-border rounded-md focus:outline-none focus:border-primary transition-smooth"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="px-2 py-0.5 bg-primary text-white rounded-md hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-smooth flex items-center"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      {/* Quick actions on hover */}
      {isHovered && (
        <div className="absolute right-1.5 top-1.5 flex gap-0.5 bg-background shadow-md rounded-lg border border-border p-0.5">
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
