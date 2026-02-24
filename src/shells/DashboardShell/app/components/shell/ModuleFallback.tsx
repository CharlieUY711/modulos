/**
 * ModuleFallback.tsx
 * Componente de carga que se muestra mientras un módulo lazy se descarga.
 *
 * Se usa como fallback en React Suspense durante la carga inicial del módulo.
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

export function ModuleFallback() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full gap-4">
      <Loader2
        size={32}
        className="animate-spin"
        style={{ color: 'var(--shell-primary)' }}
      />
      <span
        className="text-sm"
        style={{ color: 'var(--shell-text-muted)' }}
      >
        Cargando módulo...
      </span>
    </div>
  );
}