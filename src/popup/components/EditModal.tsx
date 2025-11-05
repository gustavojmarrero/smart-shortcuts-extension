import { X } from 'lucide-react';
import { useState } from 'react';
import type { Shortcut, Section } from '../../storage/types';

interface EditShortcutModalProps {
  shortcut?: Shortcut;
  sectionId: string;
  onSave: (data: Partial<Shortcut>) => void;
  onClose: () => void;
}

export function EditShortcutModal({ shortcut, onSave, onClose }: EditShortcutModalProps) {
  const [type, setType] = useState<'direct' | 'dynamic'>(shortcut?.type || 'direct');
  const [label, setLabel] = useState(shortcut?.label || '');
  const [url, setUrl] = useState(shortcut?.url || '');
  const [urlTemplate, setUrlTemplate] = useState(shortcut?.urlTemplate || '');
  const [placeholder, setPlaceholder] = useState(shortcut?.placeholder || '');
  const [icon, setIcon] = useState(shortcut?.icon || '');
  const [description, setDescription] = useState(shortcut?.description || '');
  const [inputType, setInputType] = useState<'text' | 'number'>(shortcut?.inputType || 'text');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: Partial<Shortcut> = {
      type,
      label,
      icon: icon || undefined,
      description: description || undefined,
    };

    if (type === 'direct') {
      data.url = url;
    } else {
      data.urlTemplate = urlTemplate;
      data.placeholder = placeholder;
      data.inputType = inputType;
    }

    onSave(data);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg shadow-lg w-[340px] max-h-[500px] overflow-y-auto">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="text-title font-medium">
            {shortcut ? 'Editar Shortcut' : 'Nuevo Shortcut'}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-hover rounded transition-smooth">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          {/* Type */}
          <div>
            <label className="block text-small font-medium text-text-primary mb-1">
              Tipo
            </label>
            <div className="flex gap-2">
              <label className="flex-1 flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="direct"
                  checked={type === 'direct'}
                  onChange={(e) => setType(e.target.value as 'direct')}
                  className="accent-primary"
                />
                <span className="text-small">Directo</span>
              </label>
              <label className="flex-1 flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="dynamic"
                  checked={type === 'dynamic'}
                  onChange={(e) => setType(e.target.value as 'dynamic')}
                  className="accent-primary"
                />
                <span className="text-small">Dinámico</span>
              </label>
            </div>
          </div>

          {/* Label */}
          <div>
            <label className="block text-small font-medium text-text-primary mb-1">
              Nombre *
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              required
              className="w-full px-3 py-2 text-small border border-border rounded-md focus:outline-none focus:border-primary"
              placeholder="Ej: Pedidos Amazon"
            />
          </div>

          {/* Icon */}
          <div>
            <label className="block text-small font-medium text-text-primary mb-1">
              Icono (emoji)
            </label>
            <input
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full px-3 py-2 text-small border border-border rounded-md focus:outline-none focus:border-primary"
              placeholder="📦"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-small font-medium text-text-primary mb-1">
              Descripción
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-small border border-border rounded-md focus:outline-none focus:border-primary"
              placeholder="Descripción opcional"
            />
          </div>

          {/* URL (for direct) */}
          {type === 'direct' && (
            <div>
              <label className="block text-small font-medium text-text-primary mb-1">
                URL *
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="w-full px-3 py-2 text-small border border-border rounded-md focus:outline-none focus:border-primary"
                placeholder="https://ejemplo.com"
              />
            </div>
          )}

          {/* URL Template (for dynamic) */}
          {type === 'dynamic' && (
            <>
              <div>
                <label className="block text-small font-medium text-text-primary mb-1">
                  URL Template *
                </label>
                <input
                  type="text"
                  value={urlTemplate}
                  onChange={(e) => setUrlTemplate(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-small border border-border rounded-md focus:outline-none focus:border-primary"
                  placeholder="https://amazon.com/orders/{input}"
                />
                <p className="text-small text-text-secondary mt-1">
                  Usa {'{input}'} donde va el valor
                </p>
              </div>

              <div>
                <label className="block text-small font-medium text-text-primary mb-1">
                  Placeholder
                </label>
                <input
                  type="text"
                  value={placeholder}
                  onChange={(e) => setPlaceholder(e.target.value)}
                  className="w-full px-3 py-2 text-small border border-border rounded-md focus:outline-none focus:border-primary"
                  placeholder="Ingresa número de orden..."
                />
              </div>

              <div>
                <label className="block text-small font-medium text-text-primary mb-1">
                  Tipo de Input
                </label>
                <select
                  value={inputType}
                  onChange={(e) => setInputType(e.target.value as 'text' | 'number')}
                  className="w-full px-3 py-2 text-small border border-border rounded-md focus:outline-none focus:border-primary"
                >
                  <option value="text">Texto</option>
                  <option value="number">Número</option>
                </select>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-hover transition-smooth text-small"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-smooth text-small"
            >
              {shortcut ? 'Guardar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface EditSectionModalProps {
  section?: Section;
  onSave: (data: Partial<Section>) => void;
  onClose: () => void;
}

export function EditSectionModal({ section, onSave, onClose }: EditSectionModalProps) {
  const [name, setName] = useState(section?.name || '');
  const [icon, setIcon] = useState(section?.icon || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      icon: icon || undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg shadow-lg w-[340px]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="text-title font-medium">
            {section ? 'Editar Sección' : 'Nueva Sección'}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-hover rounded transition-smooth">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div>
            <label className="block text-small font-medium text-text-primary mb-1">
              Nombre *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 text-small border border-border rounded-md focus:outline-none focus:border-primary"
              placeholder="Ej: Amazon"
            />
          </div>

          <div>
            <label className="block text-small font-medium text-text-primary mb-1">
              Icono (emoji)
            </label>
            <input
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full px-3 py-2 text-small border border-border rounded-md focus:outline-none focus:border-primary"
              placeholder="📦"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-hover transition-smooth text-small"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-smooth text-small"
            >
              {section ? 'Guardar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
