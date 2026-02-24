/**
 * dashboardConfig.ts
 * Configuración principal del DashboardShell.
 *
 * Este archivo define:
 *  - El nombre de la aplicación
 *  - El tema activo (referencia a un archivo de tema)
 *  - La lista de módulos habilitados con su ID, etiqueta e ícono
 *
 * Para agregar un nuevo módulo:
 *   1. Añadir una entrada en el array `modules`
 *   2. Registrar el componente en `src/app/registry/moduleRegistry.tsx`
 *   3. Crear el componente en `src/app/modules/<id>/index.tsx`
 */

export interface ModuleConfig {
  /** Identificador único del módulo (usado para rutas y registro) */
  id: string;
  /** Etiqueta visible en la navegación */
  label: string;
  /** Nombre del ícono de lucide-react */
  icon: string;
}

export interface DashboardConfig {
  /** Nombre de la aplicación mostrado en el header */
  appName: string;
  /** Identificador del tema activo (debe coincidir con un archivo theme.[nombre].ts) */
  theme: string;
  /** Lista de módulos habilitados en este despliegue */
  modules: ModuleConfig[];
}

export const config: DashboardConfig = {
  appName: 'Mi Dashboard',
  theme: 'default',
  modules: [
    {
      id: 'home',
      label: 'Inicio',
      icon: 'LayoutDashboard',
    },
    {
      id: 'productos',
      label: 'Productos',
      icon: 'ShoppingBag',
    },
    {
      id: 'ordenes',
      label: 'Órdenes',
      icon: 'ClipboardList',
    },
  ],
};