/**
 * ThemeProvider.tsx
 * Proveedor de tema para DashboardShell.
 *
 * Lee el nombre del tema desde dashboardConfig, busca la definición
 * en themeRegistry e inyecta todas las variables CSS en el elemento :root.
 * También establece la familia tipográfica en el body.
 *
 * Para usar un tema diferente:
 *   1. Crear `src/config/theme.[nombre].ts` con un objeto ThemeDefinition
 *   2. Registrarlo en el themeRegistry de ese archivo
 *   3. Actualizar `theme` en dashboardConfig.ts
 */

import React, { useEffect } from 'react';
import { config } from '../../config/dashboardConfig';
import { themeRegistry } from '../../config/theme.default';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  useEffect(() => {
    // Busca el tema activo en el registro
    const theme = themeRegistry[config.theme];

    if (!theme) {
      console.warn(
        `[DashboardShell] Tema "${config.theme}" no encontrado en themeRegistry. Se usará el estilo base.`
      );
      return;
    }

    const root = document.documentElement;

    // Aplica cada variable CSS en :root
    Object.entries(theme.variables).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    // Aplica la fuente en el body
    document.body.style.fontFamily = theme.variables['--shell-font'] ?? 'sans-serif';

    // Aplica color de fondo en body para evitar flash blanco en iOS
    document.body.style.backgroundColor = theme.variables['--shell-background'] ?? '#F4F5F7';

    console.info(`[DashboardShell] Tema "${theme.name}" aplicado correctamente.`);

    // Limpieza: restaurar variables al desmontar (útil en hot-reload)
    return () => {
      Object.keys(theme.variables).forEach((property) => {
        root.style.removeProperty(property);
      });
    };
  }, []);

  return <>{children}</>;
}