/**
 * routes.tsx
 * Configuración del enrutador del DashboardShell.
 *
 * Las rutas se generan dinámicamente a partir de dashboardConfig.ts.
 * Para agregar una nueva ruta, solo hace falta:
 *   1. Añadir el módulo en dashboardConfig.ts
 *   2. Registrar el componente en moduleRegistry.tsx
 *
 * Estructura de rutas:
 *   /            → DashboardShell
 *     index      → HomeModule      (id: 'home')
 *     productos  → ProductosModule (id: 'productos')
 *     ordenes    → OrdenesModule   (id: 'ordenes')
 *     *          → Redirección a /
 */

import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import { config } from '../config/dashboardConfig';
import { DashboardShell } from './components/shell/DashboardShell';
import { ModuleFallback } from './components/shell/ModuleFallback';
import { moduleRegistry } from './registry/moduleRegistry';

/**
 * Genera las rutas hijas a partir de la configuración de módulos.
 * El módulo con id 'home' se convierte en la ruta index (/).
 */
const moduleRoutes = config.modules.map((module) => {
  const LazyComponent = moduleRegistry[module.id];

  // Componente envuelto en Suspense para manejar la carga lazy
  const WrappedComponent = () => (
    <Suspense fallback={<ModuleFallback />}>
      <LazyComponent />
    </Suspense>
  );

  if (module.id === 'home') {
    // El módulo home es la ruta índice (path = '/')
    return {
      index: true as const,
      Component: WrappedComponent,
    };
  }

  // El resto de módulos usan su ID como segmento de ruta
  return {
    path: module.id,
    Component: WrappedComponent,
  };
});

/** Enrutador principal de la aplicación */
export const router = createBrowserRouter([
  {
    path: '/',
    Component: DashboardShell,
    children: [
      ...moduleRoutes,
      // Ruta comodín: redirige cualquier ruta desconocida al inicio
      {
        path: '*',
        Component: () => <Navigate to="/" replace />,
      },
    ],
  },
]);