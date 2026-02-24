/**
 * App.tsx
 * Punto de entrada principal del DashboardShell.
 *
 * Responsabilidades:
 *   1. Envuelve la app con ThemeProvider (aplica variables CSS del tema activo)
 *   2. Inicializa React Router con RouterProvider
 *
 * Todo el layout del shell se resuelve en DashboardShell (ver routes.tsx).
 */

import React from 'react';
import { RouterProvider } from 'react-router';
import { ThemeProvider } from './providers/ThemeProvider';
import { router } from './routes';

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}