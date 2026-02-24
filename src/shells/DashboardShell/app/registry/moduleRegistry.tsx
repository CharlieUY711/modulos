/**
 * moduleRegistry.tsx
 * Registro central de módulos con carga lazy.
 *
 * Cada módulo se importa de forma diferida mediante React.lazy().
 * Esto garantiza que el bundle inicial sea mínimo y cada módulo
 * se descargue solo cuando el usuario lo necesita.
 *
 * Para registrar un nuevo módulo:
 *   1. Añadir una entrada con el mismo ID definido en dashboardConfig.ts
 *   2. Apuntar al componente default del módulo correspondiente
 */

import React from 'react';

/** Tipo de componente lazy de React */
type LazyModule = React.LazyExoticComponent<React.ComponentType>;

/** Mapa de ID de módulo → componente lazy */
export const moduleRegistry: Record<string, LazyModule> = {
  /** Módulo de inicio */
  home: React.lazy(() => import('../modules/Home')),

  /** Módulo de catálogo de productos */
  productos: React.lazy(() => import('../modules/Productos')),

  /** Módulo de gestión de órdenes */
  ordenes: React.lazy(() => import('../modules/Ordenes')),
};

/**
 * Devuelve el componente lazy para un módulo dado.
 * Si el ID no está registrado, retorna un componente de aviso genérico.
 */
export function getModule(moduleId: string): LazyModule {
  return (
    moduleRegistry[moduleId] ??
    React.lazy(() =>
      Promise.resolve({
        default: function ModuloNoEncontrado() {
          return (
            <div className="flex items-center justify-center h-full">
              <p style={{ color: 'var(--shell-error)' }}>
                Módulo "{moduleId}" no encontrado en el registro.
              </p>
            </div>
          );
        },
      })
    )
  );
}