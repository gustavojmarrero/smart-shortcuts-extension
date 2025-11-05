import { Plus } from 'lucide-react';

interface EmptyStateProps {
  onCreateSection: () => void;
}

export default function EmptyState({ onCreateSection }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-8 py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-background-secondary flex items-center justify-center mb-4">
        <Plus className="w-8 h-8 text-text-secondary" />
      </div>
      <h2 className="text-title font-medium text-text-primary mb-2">
        Bienvenido a Smart Shortcuts
      </h2>
      <p className="text-small text-text-secondary mb-6 max-w-xs">
        Crea tu primera sección para comenzar a organizar tus accesos directos.
      </p>
      <button
        onClick={onCreateSection}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-smooth focus-ring"
      >
        <Plus className="w-4 h-4" />
        Crear Primera Sección
      </button>
    </div>
  );
}
