/**
 * BottomNav.tsx
 * Barra de navegación inferior del DashboardShell.
 *
 * Se construye automáticamente a partir de la lista de módulos
 * definida en dashboardConfig.ts — no hay rutas hardcodeadas aquí.
 *
 * Características:
 *   - Ícono + etiqueta por cada módulo
 *   - Indicador activo con color primario del tema
 *   - Animación suave al cambiar de pestaña
 *   - Respeta el safe area de iOS (env(safe-area-inset-bottom))
 */

import React from 'react';
import { NavLink } from 'react-router';
import { motion } from 'motion/react';
import { config } from '../../../config/dashboardConfig';
import { getIcon } from '../../utils/iconRegistry';

export function BottomNav() {
  return (
    <nav
      aria-label="Navegación principal"
      className="flex items-stretch shrink-0 z-20"
      style={{
        height: 'var(--shell-bottom-nav-height)',
        backgroundColor: 'var(--shell-surface)',
        borderTop: '1px solid var(--shell-border)',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {config.modules.map((module) => (
        <NavTabItem key={module.id} module={module} />
      ))}
    </nav>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/*  Sub-componentes                                                 */
/* ─────────────────────────────────────────────────────────────── */

interface NavTabItemProps {
  module: (typeof config.modules)[number];
}

/** Pestaña individual de la barra de navegación */
function NavTabItem({ module }: NavTabItemProps) {
  // Construye la ruta: 'home' → '/', 'productos' → '/productos'
  const to = module.id === 'home' ? '/' : `/${module.id}`;
  const Icon = getIcon(module.icon);

  return (
    <NavLink
      to={to}
      end={module.id === 'home'} // Solo activo en ruta exacta para home
      className="flex-1"
      aria-label={module.label}
    >
      {({ isActive }) => (
        <div
          className="flex flex-col items-center justify-center h-full gap-1 relative transition-all duration-200"
          style={{ paddingTop: '2px' }}
        >
          {/* Indicador activo (pastilla superior) */}
          {isActive && (
            <motion.span
              layoutId="active-tab-indicator"
              className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
              style={{ backgroundColor: 'var(--shell-primary)' }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}

          {/* Contenedor del ícono con fondo activo */}
          <div
            className="flex items-center justify-center w-10 h-7 rounded-xl transition-all duration-200"
            style={{
              backgroundColor: isActive ? 'var(--shell-primary-subtle)' : 'transparent',
            }}
          >
            <Icon
              size={20}
              strokeWidth={isActive ? 2.2 : 1.7}
              style={{
                color: isActive ? 'var(--shell-primary)' : 'var(--shell-text-muted)',
                transition: 'color 0.2s, stroke-width 0.2s',
              }}
            />
          </div>

          {/* Etiqueta del módulo */}
          <span
            className="text-xs transition-all duration-200"
            style={{
              color: isActive ? 'var(--shell-primary)' : 'var(--shell-text-muted)',
              fontWeight: isActive ? 600 : 400,
              fontSize: '10px',
            }}
          >
            {module.label}
          </span>
        </div>
      )}
    </NavLink>
  );
}