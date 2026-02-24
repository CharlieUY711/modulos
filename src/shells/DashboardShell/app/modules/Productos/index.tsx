/**
 * modules/Productos/index.tsx
 * Módulo de Productos — Vista placeholder del catálogo.
 *
 * Muestra una lista de productos de ejemplo con estado visual.
 * Reemplazar este módulo con la implementación real cuando esté disponible.
 */

import React from 'react';
import { ShoppingBag, Tag, Star } from 'lucide-react';
import { ModulePlaceholder } from '../ModulePlaceholder';

/** Productos de ejemplo para dar contexto visual */
const productosEjemplo = [
  { id: 1, nombre: 'Camiseta Premium',  precio: '$1.290', stock: 48, rating: 4.8, categoria: 'Ropa' },
  { id: 2, nombre: 'Zapatillas Urban',  precio: '$4.500', stock: 12, rating: 4.5, categoria: 'Calzado' },
  { id: 3, nombre: 'Mochila Pro',       precio: '$2.100', stock: 7,  rating: 4.9, categoria: 'Accesorios' },
];

export default function ProductosModule() {
  return (
    <div className="flex flex-col h-full">
      {/* ── Header del módulo ── */}
      <div className="px-4 pt-5 pb-3 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--shell-text-muted)', fontWeight: 600 }}>
            Catálogo
          </p>
          <h1 className="mt-0.5" style={{ color: 'var(--shell-text)', fontWeight: 700, fontSize: '22px' }}>
            Productos
          </h1>
        </div>
        <div
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl"
          style={{ backgroundColor: 'var(--shell-primary-subtle)' }}
        >
          <ShoppingBag size={14} style={{ color: 'var(--shell-primary)' }} />
          <span className="text-xs" style={{ color: 'var(--shell-primary)', fontWeight: 600 }}>
            248 items
          </span>
        </div>
      </div>

      {/* ── Lista de productos ejemplo ── */}
      <div className="flex flex-col gap-3 px-4 pb-4">
        {productosEjemplo.map((producto) => (
          <div
            key={producto.id}
            className="flex items-center gap-4 p-4 rounded-2xl"
            style={{
              backgroundColor: 'var(--shell-surface)',
              boxShadow: 'var(--shell-shadow-sm)',
            }}
          >
            {/* Ícono del producto */}
            <div
              className="flex items-center justify-center w-12 h-12 rounded-xl shrink-0"
              style={{ backgroundColor: 'var(--shell-background)' }}
            >
              <ShoppingBag size={22} style={{ color: 'var(--shell-primary)' }} strokeWidth={1.5} />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="truncate" style={{ color: 'var(--shell-text)', fontWeight: 600 }}>
                {producto.nombre}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <Tag size={11} style={{ color: 'var(--shell-text-muted)' }} />
                <span className="text-xs" style={{ color: 'var(--shell-text-muted)' }}>
                  {producto.categoria}
                </span>
                <span className="text-xs" style={{ color: 'var(--shell-border)' }}>·</span>
                <span className="text-xs" style={{ color: 'var(--shell-text-muted)' }}>
                  Stock: {producto.stock}
                </span>
              </div>
            </div>

            {/* Precio y rating */}
            <div className="flex flex-col items-end gap-1">
              <span style={{ color: 'var(--shell-text)', fontWeight: 700 }}>{producto.precio}</span>
              <div className="flex items-center gap-0.5">
                <Star size={11} fill="#F59E0B" style={{ color: '#F59E0B' }} />
                <span className="text-xs" style={{ color: 'var(--shell-text-muted)' }}>
                  {producto.rating}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Placeholder de módulo ── */}
      <div className="flex-1 flex items-center justify-center">
        <ModulePlaceholder moduleName="Productos" />
      </div>
    </div>
  );
}