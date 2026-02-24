/**
 * Header.tsx
 * Cabecera superior del DashboardShell.
 *
 * Muestra:
 *   - Izquierda: Logotipo genérico (ícono de grilla + nombre de la app)
 *   - Derecha: Botón de notificaciones y avatar del usuario con iniciales
 */

import React from 'react';
import { Bell, LayoutGrid } from 'lucide-react';
import { config } from '../../../config/dashboardConfig';

export function Header() {
  return (
    <header
      className="flex items-center justify-between px-4 shrink-0 z-10"
      style={{
        height: 'var(--shell-header-height)',
        backgroundColor: 'var(--shell-surface)',
        borderBottom: '1px solid var(--shell-border)',
        boxShadow: 'var(--shell-shadow-sm)',
      }}
    >
      {/* ── Logo genérico del shell ── */}
      <div className="flex items-center gap-2">
        <ShellLogo />
        <span
          className="text-sm tracking-widest uppercase"
          style={{ color: 'var(--shell-text-muted)', letterSpacing: '0.12em' }}
        >
          {config.appName}
        </span>
      </div>

      {/* ── Acciones del header ── */}
      <div className="flex items-center gap-3">
        {/* Botón de notificaciones */}
        <button
          aria-label="Notificaciones"
          className="relative flex items-center justify-center w-9 h-9 rounded-xl transition-colors active:scale-95"
          style={{
            backgroundColor: 'var(--shell-background)',
            color: 'var(--shell-text-secondary)',
          }}
        >
          <Bell size={18} strokeWidth={1.8} />
          {/* Badge de notificación */}
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ backgroundColor: 'var(--shell-primary)' }}
          />
        </button>

        {/* Avatar del usuario */}
        <UserAvatar name="Admin" />
      </div>
    </header>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/*  Sub-componentes internos                                        */
/* ─────────────────────────────────────────────────────────────── */

/** Logotipo genérico del shell con ícono de grilla y color primario */
function ShellLogo() {
  return (
    <div
      className="flex items-center justify-center w-8 h-8 rounded-lg"
      style={{ backgroundColor: 'var(--shell-primary)' }}
    >
      <LayoutGrid size={16} strokeWidth={2} color="#FFFFFF" />
    </div>
  );
}

/** Avatar circular con iniciales del usuario */
function UserAvatar({ name }: { name: string }) {
  // Extrae iniciales (máximo 2 caracteres)
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <button
      aria-label={`Perfil de ${name}`}
      className="flex items-center justify-center w-9 h-9 rounded-full text-xs transition-transform active:scale-95"
      style={{
        background: 'linear-gradient(135deg, var(--shell-primary) 0%, var(--shell-primary-dark) 100%)',
        color: '#FFFFFF',
        fontWeight: 700,
        boxShadow: '0 2px 8px rgba(99,102,241,0.35)',
      }}
    >
      {initials}
    </button>
  );
}