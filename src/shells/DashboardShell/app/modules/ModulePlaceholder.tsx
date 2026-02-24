/**
 * ModulePlaceholder.tsx
 * Componente de marcador de posición para módulos aún no conectados.
 *
 * Muestra un ícono, spinner y un mensaje genérico indicando que el módulo
 * está listo para ser conectado a su implementación real.
 * Este componente puede ser reemplazado por el módulo real en producción.
 */

import React from 'react';
import { Loader2, Plug } from 'lucide-react';

interface ModulePlaceholderProps {
  /** Nombre del módulo a mostrar en el mensaje */
  moduleName: string;
  /** Descripción o URL del origen del módulo (opcional) */
  serverUrl?: string;
}

export function ModulePlaceholder({
  moduleName,
  serverUrl,
}: ModulePlaceholderProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full px-6 gap-6">
      {/* Ícono decorativo */}
      <div
        className="flex items-center justify-center w-20 h-20 rounded-3xl"
        style={{
          backgroundColor: 'var(--shell-primary-subtle)',
          boxShadow: 'var(--shell-shadow-md)',
        }}
      >
        <Plug
          size={36}
          style={{ color: 'var(--shell-primary)' }}
          strokeWidth={1.5}
        />
      </div>

      {/* Spinner de carga */}
      <Loader2
        size={28}
        className="animate-spin"
        style={{ color: 'var(--shell-primary)' }}
      />

      {/* Mensaje principal */}
      <div className="text-center flex flex-col gap-2 max-w-xs">
        <p
          className="text-base"
          style={{ color: 'var(--shell-text)', fontWeight: 600 }}
        >
          Módulo{' '}
          <span style={{ color: 'var(--shell-primary)' }}>{moduleName}</span>{' '}
          listo para conectar
        </p>
        {serverUrl && (
          <p
            className="text-sm font-mono"
            style={{
              color: 'var(--shell-text-secondary)',
              backgroundColor: 'var(--shell-border)',
              padding: '4px 12px',
              borderRadius: 'var(--shell-radius-sm)',
            }}
          >
            {serverUrl}
          </p>
        )}
      </div>

      {/* Indicador de estado */}
      <div className="flex items-center gap-2 mt-2">
        <span
          className="inline-block w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: 'var(--shell-success)' }}
        />
        <span
          className="text-xs"
          style={{ color: 'var(--shell-text-muted)' }}
        >
          Shell activo — esperando implementación del módulo
        </span>
      </div>
    </div>
  );
}