/* =====================================================
   DocumentacionView — Manual de Usuario y Docs Técnica
   Versiones · Changelog · Búsqueda · Categorías
   ===================================================== */
import React, { useState } from 'react';
import { OrangeHeader } from '../OrangeHeader';
import type { MainSection } from '../../../AdminDashboard';
import { BookOpen, Search, ChevronRight, ChevronDown, ExternalLink, Clock, Star, Code } from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

interface DocItem {
  id: string; titulo: string; descripcion: string; categoria: string; emoji: string;
  actualizado: string; lectura: string; destacado?: boolean;
}

const docs: DocItem[] = [
  // Primeros pasos
  { id: 'inicio', titulo: 'Guía de inicio rápido', descripcion: 'Configuración inicial del sistema, primer login y tour de módulos.', categoria: 'Primeros pasos', emoji: '🚀', actualizado: '2026-02-24', lectura: '5 min', destacado: true },
  { id: 'roles', titulo: 'Gestión de roles y usuarios', descripcion: 'Cómo crear usuarios, asignar roles y configurar permisos granulares.', categoria: 'Primeros pasos', emoji: '👥', actualizado: '2026-02-20', lectura: '8 min' },
  { id: 'supabase', titulo: 'Conexión con Supabase', descripcion: 'Configuración de credenciales, RLS policies y Edge Functions.', categoria: 'Primeros pasos', emoji: '⚡', actualizado: '2026-02-18', lectura: '12 min' },
  // eCommerce
  { id: 'pedidos', titulo: 'Gestión de pedidos', descripcion: 'Árbol madre/hijos, estados del pedido, notas y acuse de recibo.', categoria: 'eCommerce', emoji: '📦', actualizado: '2026-02-22', lectura: '10 min', destacado: true },
  { id: 'pos', titulo: 'Punto de Venta (POS)', descripcion: 'Cómo usar el POS, aplicar descuentos y procesar diferentes métodos de pago.', categoria: 'eCommerce', emoji: '🖥️', actualizado: '2026-02-19', lectura: '7 min' },
  { id: 'pagos', titulo: 'Configurar métodos de pago', descripcion: 'Integración con Plexo, MercadoPago, Stripe y métodos locales Uruguay.', categoria: 'eCommerce', emoji: '💳', actualizado: '2026-02-16', lectura: '15 min' },
  // Logística
  { id: 'envios', titulo: 'Módulo de envíos', descripcion: 'Cómo crear envíos, asignar carriers y hacer tracking multi-tramo.', categoria: 'Logística', emoji: '🚚', actualizado: '2026-02-21', lectura: '12 min', destacado: true },
  { id: 'fulfillment', titulo: 'Wave picking y fulfillment', descripcion: 'Proceso de preparación de pedidos, lotes y control de empaque.', categoria: 'Logística', emoji: '🏭', actualizado: '2026-02-17', lectura: '9 min' },
  { id: 'etiqueta-emotiva', titulo: 'Etiqueta Emotiva QR', descripcion: 'Configurar mensajes personalizados con QR para envíos especiales.', categoria: 'Logística', emoji: '❤️', actualizado: '2026-02-14', lectura: '6 min' },
  // Marketing
  { id: 'mailing', titulo: 'Email marketing con Resend', descripcion: 'Crear campañas, segmentar audiencias y analizar métricas.', categoria: 'Marketing', emoji: '✉️', actualizado: '2026-02-20', lectura: '14 min' },
  { id: 'seo', titulo: 'Dashboard SEO', descripcion: 'Keywords, rankings, análisis on-page y estrategia de backlinks.', categoria: 'Marketing', emoji: '🔍', actualizado: '2026-02-13', lectura: '11 min' },
  // APIs
  { id: 'api-plexo', titulo: 'Integración Plexo', descripcion: 'Configuración completa de la pasarela de pagos nativa de Uruguay.', categoria: 'APIs y técnica', emoji: '🔗', actualizado: '2026-02-15', lectura: '20 min' },
  { id: 'api-ml', titulo: 'Sincronización con Mercado Libre', descripcion: 'OAuth, sync de catálogo, stock y gestión de pedidos ML.', categoria: 'APIs y técnica', emoji: '🛒', actualizado: '2026-02-12', lectura: '18 min', destacado: true },
  { id: 'edge-functions', titulo: 'Supabase Edge Functions', descripcion: 'Cómo extender el backend con Deno y llamar desde el frontend.', categoria: 'APIs y técnica', emoji: '🔧', actualizado: '2026-02-10', lectura: '25 min' },
];

const changelog = [
  { version: '1.5.0', fecha: '2026-02-24', tipo: 'mayor', cambios: ['60+ módulos completamente implementados', 'Constructor visual drag & drop', 'OCR en browser con Tesseract', 'Repositorio de 23 APIs centralizado'] },
  { version: '1.4.0', fecha: '2026-02-10', tipo: 'menor', cambios: ['Integración PedidosYa logistics', 'Dashboard RRSS multi-plataforma', 'Rueda de sorteos interactiva'] },
  { version: '1.3.0', fecha: '2026-01-28', tipo: 'menor', cambios: ['Módulo ERP RRHH completo', 'Segunda mano marketplace', 'Etiqueta Emotiva con QR real'] },
  { version: '1.2.0', fecha: '2026-01-15', tipo: 'patch', cambios: ['Corrección de bugs en POS', 'Mejoras de performance en tabla de pedidos', 'Fix en módulo de facturación'] },
];

const categorias = ['Todos', 'Primeros pasos', 'eCommerce', 'Logística', 'Marketing', 'APIs y técnica'];

export function DocumentacionView({ onNavigate }: Props) {
  const [search, setSearch] = useState('');
  const [categoria, setCategoria] = useState('Todos');
  const [docActivo, setDocActivo] = useState<DocItem | null>(null);
  const [showChangelog, setShowChangelog] = useState(false);

  const filtrados = docs.filter(d =>
    (categoria === 'Todos' || d.categoria === categoria) &&
    (!search || d.titulo.toLowerCase().includes(search.toLowerCase()) || d.descripcion.toLowerCase().includes(search.toLowerCase()))
  );

  const destacados = docs.filter(d => d.destacado);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={BookOpen}
        title="Documentación"
        subtitle={`Manual de usuario y docs técnica · v1.5.0 · ${docs.length} artículos`}
        actions={[
          { label: '← Volver', onClick: () => onNavigate('sistema') },
          { label: '📋 Changelog', onClick: () => setShowChangelog(!showChangelog) },
        ]}
      />

      <div style={{ flex: 1, overflow: 'hidden', display: 'grid', gridTemplateColumns: docActivo ? '1fr 420px' : '1fr', gap: 0 }}>
        <div style={{ overflowY: 'auto', padding: '24px 32px' }}>

          {/* Búsqueda */}
          <div style={{ position: 'relative', marginBottom: 24 }}>
            <Search size={18} color="#9CA3AF" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar en la documentación..."
              style={{ width: '100%', paddingLeft: 48, paddingRight: 16, paddingTop: 14, paddingBottom: 14, border: '1px solid #E5E7EB', borderRadius: 14, fontSize: '0.92rem', outline: 'none', boxSizing: 'border-box', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }} />
          </div>

          {/* Changelog expandible */}
          {showChangelog && (
            <div style={{ backgroundColor: '#1A1A2E', borderRadius: 16, padding: 24, marginBottom: 24 }}>
              <h3 style={{ margin: '0 0 16px', color: '#fff', fontSize: '1rem' }}>📋 Changelog</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {changelog.map(v => (
                  <div key={v.version} style={{ borderLeft: `3px solid ${v.tipo === 'mayor' ? ORANGE : v.tipo === 'menor' ? '#3B82F6' : '#6B7280'}`, paddingLeft: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <span style={{ fontWeight: '800', color: '#fff', fontSize: '0.92rem' }}>v{v.version}</span>
                      <span style={{ padding: '2px 8px', borderRadius: 6, backgroundColor: v.tipo === 'mayor' ? `${ORANGE}30` : '#1D2D4E', color: v.tipo === 'mayor' ? ORANGE : '#93C5FD', fontSize: '0.68rem', fontWeight: '700', textTransform: 'uppercase' }}>
                        {v.tipo}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#6B7280' }}>{v.fecha}</span>
                    </div>
                    {v.cambios.map((c, i) => (
                      <div key={i} style={{ fontSize: '0.78rem', color: '#D1D5DB', display: 'flex', gap: 8, marginBottom: 4 }}>
                        <span style={{ color: '#A3E635', flexShrink: 0 }}>+</span> {c}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Destacados */}
          {!search && categoria === 'Todos' && (
            <div style={{ marginBottom: 28 }}>
              <p style={{ margin: '0 0 14px', fontWeight: '700', color: '#1A1A2E', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Star size={16} color={ORANGE} /> Artículos destacados
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
                {destacados.map(d => (
                  <div key={d.id} onClick={() => setDocActivo(d)}
                    style={{ backgroundColor: '#fff', borderRadius: 14, border: `2px solid ${ORANGE}20`, padding: 20, cursor: 'pointer', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = ORANGE; e.currentTarget.style.boxShadow = `0 4px 12px ${ORANGE}15`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = `${ORANGE}20`; e.currentTarget.style.boxShadow = 'none'; }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: 10 }}>{d.emoji}</div>
                    <h4 style={{ margin: '0 0 6px', color: '#1A1A2E', fontSize: '0.92rem' }}>{d.titulo}</h4>
                    <p style={{ margin: '0 0 10px', fontSize: '0.78rem', color: '#6B7280' }}>{d.descripcion}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#9CA3AF' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={10} /> {d.lectura}</span>
                      <span>{d.actualizado}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categorías */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            {categorias.map(c => (
              <button key={c} onClick={() => setCategoria(c)}
                style={{ padding: '7px 16px', borderRadius: 10, border: `2px solid ${categoria === c ? ORANGE : '#E5E7EB'}`, backgroundColor: categoria === c ? `${ORANGE}10` : '#fff', color: categoria === c ? ORANGE : '#6B7280', fontWeight: categoria === c ? '700' : '500', fontSize: '0.82rem', cursor: 'pointer' }}>
                {c}
              </button>
            ))}
          </div>

          {/* Lista de artículos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtrados.map(d => (
              <div key={d.id} onClick={() => setDocActivo(d)}
                style={{ backgroundColor: '#fff', borderRadius: 14, border: `1px solid ${docActivo?.id === d.id ? ORANGE : '#E5E7EB'}`, padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, transition: 'all 0.15s' }}>
                <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{d.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', color: '#1A1A2E', marginBottom: 3 }}>{d.titulo}</div>
                  <div style={{ fontSize: '0.78rem', color: '#6B7280' }}>{d.descripcion}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '0.7rem', color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                    <Clock size={10} /> {d.lectura}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#9CA3AF', marginTop: 2 }}>{d.actualizado}</div>
                </div>
                <ChevronRight size={16} color="#9CA3AF" />
              </div>
            ))}
          </div>
        </div>

        {/* Panel de artículo */}
        {docActivo && (
          <div style={{ backgroundColor: '#fff', borderLeft: '1px solid #E9ECEF', overflowY: 'auto', padding: 28 }}>
            <button onClick={() => setDocActivo(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', fontSize: '0.82rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 4 }}>
              ← Cerrar
            </button>
            <div style={{ fontSize: '2rem', marginBottom: 12 }}>{docActivo.emoji}</div>
            <h2 style={{ margin: '0 0 8px', color: '#1A1A2E', fontSize: '1.2rem' }}>{docActivo.titulo}</h2>
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              <span style={{ padding: '3px 10px', borderRadius: 7, backgroundColor: `${ORANGE}10`, color: ORANGE, fontSize: '0.72rem', fontWeight: '700' }}>{docActivo.categoria}</span>
              <span style={{ fontSize: '0.72rem', color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={10} /> {docActivo.lectura}</span>
            </div>

            {/* Contenido simulado */}
            <div style={{ fontSize: '0.88rem', color: '#374151', lineHeight: 1.8 }}>
              <p>{docActivo.descripcion}</p>
              <h3 style={{ color: '#1A1A2E', fontSize: '1rem', margin: '20px 0 10px' }}>¿Qué aprenderás?</h3>
              <ul style={{ paddingLeft: 20, margin: '0 0 16px' }}>
                <li>Configuración inicial paso a paso</li>
                <li>Casos de uso frecuentes y ejemplos prácticos</li>
                <li>Integración con otros módulos del sistema</li>
                <li>Resolución de problemas comunes</li>
              </ul>
              <div style={{ padding: 16, borderRadius: 10, backgroundColor: '#F0F9FF', border: '1px solid #BFDBFE', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <Code size={14} color="#1D4ED8" />
                  <span style={{ fontWeight: '700', color: '#1D4ED8', fontSize: '0.82rem' }}>Nota técnica</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#1E3A5F' }}>
                  Este módulo requiere configuración en Supabase. Asegurate de tener las credenciales correctas en <code>/utils/supabase/info.ts</code>.
                </p>
              </div>
              <p style={{ color: '#9CA3AF', fontSize: '0.78rem', marginTop: 20 }}>Última actualización: {docActivo.actualizado} · Charlie Marketplace Builder v1.5</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
