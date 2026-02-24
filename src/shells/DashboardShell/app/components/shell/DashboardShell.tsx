/**
 * DashboardShell.tsx
 * Componente raíz del shell genérico (DashboardShell).
 *
 * Define el layout principal de la aplicación:
 *   ┌─────────────────────────┐
 *   │  Header  (60px)         │
 *   ├─────────────────────────┤
 *   │                         │
 *   │  Área de contenido      │  ← <Outlet /> con animación
 *   │  (flex-1, scroll)       │
 *   │                         │
 *   ├─────────────────────────┤
 *   │  BottomNav  (70px)      │
 *   └─────────────────────────┘
 *
 * Los módulos se renderizan dentro del <Outlet /> con transición fade.
 * El Suspense aquí captura la carga lazy de cualquier módulo registrado.
 */

import React, { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { ModuleFallback } from './ModuleFallback';

export function DashboardShell() {
  const location = useLocation();

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{
        height: '100dvh', // dvh para soporte correcto en iOS Safari
        backgroundColor: 'var(--shell-background)',
      }}
    >
      {/* ── Cabecera fija superior ── */}
      <Header />

      {/* ── Área de contenido del módulo activo ── */}
      <main
        className="flex-1 overflow-hidden relative"
        style={{ backgroundColor: 'var(--shell-background)' }}
      >
        <Suspense fallback={<ModuleFallback />}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              className="absolute inset-0 overflow-y-auto"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{
                duration: 0.22,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </main>

      {/* ── Barra de navegación inferior ── */}
      <BottomNav />
    </div>
  );
}