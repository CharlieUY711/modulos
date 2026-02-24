/**
 * modules/Home/index.tsx
 * Módulo de Inicio — Vista placeholder del dashboard principal.
 *
 * Muestra tarjetas de métricas de ejemplo y un marcador de posición genérico.
 * Reemplazar este módulo con la implementación real cuando esté disponible.
 */

import React from 'react';
import { TrendingUp, Package, ClipboardCheck, DollarSign } from 'lucide-react';
import { ModulePlaceholder } from '../ModulePlaceholder';

/** Métricas de ejemplo para el estado visual del módulo */
const metricas = [
  { label: 'Ventas hoy',   valor: '$12.430', icono: DollarSign,     color: '#10B981', bg: '#D1FAE5' },
  { label: 'Productos',    valor: '248',      icono: Package,         color: '#3B82F6', bg: '#DBEAFE' },
  { label: 'Órdenes',      valor: '34',       icono: ClipboardCheck,  color: '#6366F1', bg: '#EEF2FF' },
  { label: 'Crecimiento',  valor: '+18%',     icono: TrendingUp,      color: '#8B5CF6', bg: '#EDE9FE' },
];

export default function HomeModule() {
  return (
    <div className="flex flex-col h-full">
      {/* ── Saludo ── */}
      <div className="px-4 pt-5 pb-3">
        <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--shell-text-muted)', fontWeight: 600 }}>
          Bienvenido de vuelta
        </p>
        <h1 className="mt-0.5" style={{ color: 'var(--shell-text)', fontWeight: 700, fontSize: '22px' }}>
          Resumen del día
        </h1>
      </div>

      {/* ── Tarjetas de métricas ── */}
      <div className="grid grid-cols-2 gap-3 px-4 pb-4">
        {metricas.map((m) => {
          const Icon = m.icono;
          return (
            <div
              key={m.label}
              className="flex flex-col gap-3 p-4 rounded-2xl"
              style={{
                backgroundColor: 'var(--shell-surface)',
                boxShadow: 'var(--shell-shadow-sm)',
              }}
            >
              <div
                className="flex items-center justify-center w-9 h-9 rounded-xl"
                style={{ backgroundColor: m.bg }}
              >
                <Icon size={18} style={{ color: m.color }} strokeWidth={2} />
              </div>
              <div>
                <p className="text-xs" style={{ color: 'var(--shell-text-muted)' }}>{m.label}</p>
                <p className="mt-0.5" style={{ color: 'var(--shell-text)', fontWeight: 700, fontSize: '20px' }}>
                  {m.valor}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Placeholder de módulo ── */}
      <div className="flex-1 flex items-center justify-center">
        <ModulePlaceholder moduleName="Inicio" />
      </div>
    </div>
  );
}