import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = 'Buscar shortcuts...' }: SearchBarProps) {
  return (
    <div className="relative px-2.5 py-1.5 border-b border-border bg-background">
      <div className="relative flex items-center">
        <Search className="absolute left-2 w-3.5 h-3.5 text-text-secondary pointer-events-none" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-8 pr-7 py-1 text-[11px] border border-border rounded-md focus:outline-none focus:border-primary transition-smooth bg-background"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-2 p-0.5 hover:bg-hover rounded transition-smooth"
            title="Limpiar búsqueda"
          >
            <X className="w-3 h-3 text-text-secondary" />
          </button>
        )}
      </div>
    </div>
  );
}
