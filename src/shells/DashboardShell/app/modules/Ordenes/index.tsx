/**
 * modules/Ordenes/index.tsx
 * Módulo de Órdenes — Vista placeholder de gestión de pedidos.
 *
 * Muestra órdenes de ejemplo con estados de despacho.
 * Reemplazar este módulo con la implementación real cuando esté disponible.
 */

import React from 'react';
import { ClipboardList, Clock, CheckCircle2, Truck, AlertCircle } from 'lucide-react';
import { ModulePlaceholder } from '../ModulePlaceholder';

/** Estados posibles de una orden */
type EstadoOrden = 'pendiente' | 'preparando' | 'enviado' | 'problema';

interface OrdenEjemplo {
  id: string;
  cliente: string;
  total: string;
  items: number;
  estado: EstadoOrden;
  hora: string;
}

const ordenesEjemplo: OrdenEjemplo[] = [
  { id: '#ORD-001', cliente: 'María García',   total: '$3.400', items: 3, estado: 'enviado',    hora: '14:32' },
  { id: '#ORD-002', cliente: 'Carlos López',   total: '$1.200', items: 1, estado: 'preparando', hora: '15:10' },
  { id: '#ORD-003', cliente: 'Ana Martínez',   total: '$7.800', items: 5, estado: 'pendiente',  hora: '15:45' },
  { id: '#ORD-004', cliente: 'Pedro Rodríguez',total: '$890',   items: 2, estado: 'problema',   hora: '16:02' },
];

/** Configuración visual por estado */
const estadoConfig: Record<EstadoOrden, { label: string; color: string; bg: string; Icon: React.ElementType }> = {
  pendiente:  { label: 'Pendiente',  color: '#F59E0B', bg: '#FEF3C7', Icon: Clock         },
  preparando: { label: 'Preparando', color: '#3B82F6', bg: '#DBEAFE', Icon: ClipboardList  },
  enviado:    { label: 'Enviado',    color: '#10B981', bg: '#D1FAE5', Icon: Truck          },
  problema:   { label: 'Problema',   color: '#EF4444', bg: '#FEE2E2', Icon: AlertCircle    },
};

export default function OrdenesModule() {
  return (
    <div className="flex flex-col h-full">
      {/* ── Header del módulo ── */}
      <div className="px-4 pt-5 pb-3 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--shell-text-muted)', fontWeight: 600 }}>
            Gestión
          </p>
          <h1 className="mt-0.5" style={{ color: 'var(--shell-text)', fontWeight: 700, fontSize: '22px' }}>
            Órdenes
          </h1>
        </div>
        <div
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl"
          style={{ backgroundColor: 'var(--shell-primary-subtle)' }}
        >
          <CheckCircle2 size={14} style={{ color: 'var(--shell-primary)' }} />
          <span className="text-xs" style={{ color: 'var(--shell-primary)', fontWeight: 600 }}>
            34 hoy
          </span>
        </div>
      </div>

      {/* ── Lista de órdenes ejemplo ── */}
      <div className="flex flex-col gap-3 px-4 pb-4">
        {ordenesEjemplo.map((orden) => {
          const cfg = estadoConfig[orden.estado];
          const Icon = cfg.Icon;

          return (
            <div
              key={orden.id}
              className="flex items-center gap-4 p-4 rounded-2xl"
              style={{
                backgroundColor: 'var(--shell-surface)',
                boxShadow: 'var(--shell-shadow-sm)',
              }}
            >
              {/* Badge de estado */}
              <div
                className="flex items-center justify-center w-11 h-11 rounded-xl shrink-0"
                style={{ backgroundColor: cfg.bg }}
              >
                <Icon size={20} style={{ color: cfg.color }} strokeWidth={1.8} />
              </div>

              {/* Info de la orden */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono" style={{ color: 'var(--shell-primary)', fontWeight: 600 }}>
                    {orden.id}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: cfg.bg, color: cfg.color, fontWeight: 600 }}
                  >
                    {cfg.label}
                  </span>
                </div>
                <p className="truncate mt-0.5" style={{ color: 'var(--shell-text)', fontWeight: 500 }}>
                  {orden.cliente}
                </p>
                <p className="text-xs" style={{ color: 'var(--shell-text-muted)' }}>
                  {orden.items} item{orden.items !== 1 ? 's' : ''} · {orden.hora}
                </p>
              </div>

              {/* Total */}
              <span style={{ color: 'var(--shell-text)', fontWeight: 700 }}>{orden.total}</span>
            </div>
          );
        })}
      </div>

      {/* ── Placeholder de módulo ── */}
      <div className="flex-1 flex items-center justify-center">
        <ModulePlaceholder moduleName="Órdenes" />
      </div>
    </div>
  );
}