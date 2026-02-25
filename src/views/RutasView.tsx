/* =====================================================
   RutasView — Gestión de Rutas de Entrega
   Planificación · Seguimiento · Paradas
   ===================================================== */
import React, { useState, useEffect } from 'react';
import { OrangeHeader } from '../OrangeHeader';
import type { MainSection } from '../../../AdminDashboard';
import { Map, Truck, MapPin, CheckCircle, Clock, Package, Navigation, Users, Plus, ArrowUp, ArrowDown, X, AlertCircle, Filter, Search } from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

// Configuración Supabase - ajustar según tu proyecto
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key';

interface Route {
  id: string;
  name: string;
  driver_name: string | null;
  date: string;
  status: string;
  created_at: string;
}

interface RouteStop {
  id: string;
  route_id: string;
  shipment_id: string | null;
  recipient_name: string | null;
  address: string | null;
  order_index: number;
  status: string;
  completed_at: string | null;
  notes: string | null;
  proof_url: string | null;
}

interface RouteWithStops extends Route {
  stops: RouteStop[];
  completed_count: number;
  total_count: number;
}

type ViewMode = 'list' | 'form' | 'detail';

const estadoColor: Record<string, { bg: string; color: string }> = {
  pending: { bg: '#F3F4F6', color: '#6B7280' },
  active: { bg: '#DBEAFE', color: '#1D4ED8' },
  completed: { bg: '#D1FAE5', color: '#059669' },
  failed: { bg: '#FEE2E2', color: '#DC2626' },
};

const stopEstadoColor: Record<string, { bg: string; color: string }> = {
  pending: { bg: '#F3F4F6', color: '#6B7280' },
  completed: { bg: '#D1FAE5', color: '#059669' },
  failed: { bg: '#FEE2E2', color: '#DC2626' },
};

async function supabaseFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
      ...(options?.headers || {}),
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export function RutasView({ onNavigate }: Props) {
  const [view, setView] = useState<ViewMode>('list');
  const [routeId, setRouteId] = useState<string | null>(null);
  const [routes, setRoutes] = useState<RouteWithStops[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  
  // Filtros
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [search, setSearch] = useState('');

  // Form state
  const [formName, setFormName] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formDriver, setFormDriver] = useState('');
  const [stops, setStops] = useState<Array<{ recipient_name: string; address: string }>>([]);
  const [newStopRecipient, setNewStopRecipient] = useState('');
  const [newStopAddress, setNewStopAddress] = useState('');

  // Detail state
  const [selectedRoute, setSelectedRoute] = useState<RouteWithStops | null>(null);
  const [showFailReason, setShowFailReason] = useState<string | null>(null);
  const [failReason, setFailReason] = useState('');

  useEffect(() => {
    if (view === 'list') {
      loadRoutes();
    } else if (view === 'detail' && routeId) {
      loadRouteDetail(routeId);
    }
  }, [view, routeId]);

  async function loadRoutes() {
    setLoading(true);
    setError('');
    try {
      const routesData: Route[] = await supabaseFetch('routes?select=*&order=date.desc');
      const routesWithStops: RouteWithStops[] = await Promise.all(
        routesData.map(async (route) => {
          const stopsData: RouteStop[] = await supabaseFetch(`route_stops?route_id=eq.${route.id}&order=order_index.asc`);
          const completed = stopsData.filter(s => s.status === 'completed').length;
          return { ...route, stops: stopsData, completed_count: completed, total_count: stopsData.length };
        })
      );
      setRoutes(routesWithStops);
    } catch (e: any) {
      setError(`Error al cargar rutas: ${e.message}`);
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function loadRouteDetail(id: string) {
    setLoading(true);
    setError('');
    try {
      const route: Route[] = await supabaseFetch(`routes?id=eq.${id}`);
      if (route.length === 0) {
        setError('Ruta no encontrada');
        return;
      }
      const stopsData: RouteStop[] = await supabaseFetch(`route_stops?route_id=eq.${id}&order=order_index.asc`);
      const completed = stopsData.filter(s => s.status === 'completed').length;
      const routeWithStops: RouteWithStops = { ...route[0], stops: stopsData, completed_count: completed, total_count: stopsData.length };
      setSelectedRoute(routeWithStops);
    } catch (e: any) {
      setError(`Error al cargar ruta: ${e.message}`);
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateRoute() {
    if (!formName || !formDate) {
      setError('Nombre y fecha son obligatorios');
      return;
    }
    if (stops.length === 0) {
      setError('Debe agregar al menos una parada');
      return;
    }

    setLoading(true);
    setError('');
    try {
      // Crear ruta
      const [newRoute]: Route[] = await supabaseFetch('routes', {
        method: 'POST',
        body: JSON.stringify({
          name: formName,
          date: formDate,
          driver_name: formDriver || null,
          status: 'pending',
        }),
      });

      // Crear paradas
      await Promise.all(
        stops.map((stop, index) =>
          supabaseFetch('route_stops', {
            method: 'POST',
            body: JSON.stringify({
              route_id: newRoute.id,
              recipient_name: stop.recipient_name,
              address: stop.address,
              order_index: index,
              status: 'pending',
            }),
          })
        )
      );

      setRouteId(newRoute.id);
      setView('detail');
      await loadRouteDetail(newRoute.id);
    } catch (e: any) {
      setError(`Error al crear ruta: ${e.message}`);
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleCompleteStop(stopId: string) {
    setLoading(true);
    setError('');
    try {
      await supabaseFetch(`route_stops?id=eq.${stopId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: 'completed',
          completed_at: new Date().toISOString(),
        }),
      });
      if (routeId) await loadRouteDetail(routeId);
    } catch (e: any) {
      setError(`Error al completar parada: ${e.message}`);
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleFailStop(stopId: string, reason: string) {
    setLoading(true);
    setError('');
    try {
      await supabaseFetch(`route_stops?id=eq.${stopId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: 'failed',
          notes: reason,
        }),
      });
      setShowFailReason(null);
      setFailReason('');
      if (routeId) await loadRouteDetail(routeId);
    } catch (e: any) {
      setError(`Error al marcar parada como fallida: ${e.message}`);
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleCloseRoute() {
    if (!routeId) return;
    setLoading(true);
    setError('');
    try {
      await supabaseFetch(`routes?id=eq.${routeId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'completed' }),
      });
      await loadRouteDetail(routeId);
    } catch (e: any) {
      setError(`Error al cerrar ruta: ${e.message}`);
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function addStop() {
    if (!newStopRecipient || !newStopAddress) {
      setError('Recipient y dirección son obligatorios');
      return;
    }
    setStops([...stops, { recipient_name: newStopRecipient, address: newStopAddress }]);
    setNewStopRecipient('');
    setNewStopAddress('');
    setError('');
  }

  function removeStop(index: number) {
    setStops(stops.filter((_, i) => i !== index));
  }

  function moveStop(index: number, direction: 'up' | 'down') {
    const newStops = [...stops];
    if (direction === 'up' && index > 0) {
      [newStops[index - 1], newStops[index]] = [newStops[index], newStops[index - 1]];
    } else if (direction === 'down' && index < newStops.length - 1) {
      [newStops[index], newStops[index + 1]] = [newStops[index + 1], newStops[index]];
    }
    setStops(newStops);
  }

  const filteredRoutes = routes.filter(r => {
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchDate = !dateFilter || r.date === dateFilter;
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) || (r.driver_name && r.driver_name.toLowerCase().includes(search.toLowerCase()));
    return matchStatus && matchDate && matchSearch;
  });

  const kpis = [
    { label: 'Rutas Activas', value: routes.filter(r => r.status === 'active').length.toString(), color: ORANGE, icon: Navigation },
    { label: 'En Reparto', value: routes.reduce((sum, r) => sum + r.stops.filter(s => s.status === 'pending').length, 0).toString(), color: '#3B82F6', icon: Package },
    { label: 'Completadas Hoy', value: routes.filter(r => r.status === 'completed' && r.date === new Date().toISOString().split('T')[0]).length.toString(), color: '#10B981', icon: CheckCircle },
    { label: 'Total Rutas', value: routes.length.toString(), color: '#8B5CF6', icon: Map },
  ];

  // LIST VIEW
  if (view === 'list') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
        <OrangeHeader
          icon={Map}
          title="Rutas de Entrega"
          subtitle="Planificación · Seguimiento · Gestión de paradas"
          actions={[
            { label: '← Volver', onClick: () => onNavigate('logistica') },
          ]}
        />
        {/* Botón Nueva Ruta fuera de OrangeHeader para garantizar que funcione */}
        <div style={{ padding: '12px 28px', backgroundColor: '#fff', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'flex-end', flexShrink: 0 }}>
          <button
            onClick={() => { setView('form'); setFormName(''); setFormDate(''); setFormDriver(''); setStops([]); setError(''); }}
            style={{ padding: '10px 20px', backgroundColor: ORANGE, color: '#fff', border: 'none', borderRadius: '9px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Plus size={16} /> Nueva Ruta
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
          {error && (
            <div style={{ marginBottom: 16, padding: '12px 16px', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: '10px', fontSize: '0.85rem' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 22 }}>
            {kpis.map((k, i) => (
              <div key={i} style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 42, height: 42, borderRadius: '11px', backgroundColor: `${k.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <k.icon size={20} color={k.color} />
                </div>
                <div>
                  <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#1A1A2E', lineHeight: 1 }}>{k.value}</div>
                  <div style={{ fontSize: '0.72rem', color: '#6C757D' }}>{k.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Filtros */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
              <Search size={13} color="#9CA3AF" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar ruta o repartidor..."
                style={{ width: '100%', paddingLeft: 30, paddingRight: 12, paddingTop: 8, paddingBottom: 8, border: '1px solid #E5E7EB', borderRadius: '9px', fontSize: '0.82rem', outline: 'none' }}
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              style={{ padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '9px', fontSize: '0.82rem', outline: 'none', backgroundColor: '#fff' }}
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendiente</option>
              <option value="active">Activa</option>
              <option value="completed">Completada</option>
            </select>
            <input
              type="date"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              style={{ padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '9px', fontSize: '0.82rem', outline: 'none', backgroundColor: '#fff' }}
            />
          </div>

          {/* Lista de rutas */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>Cargando rutas...</div>
          ) : routes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 40px' }}>
              <div style={{ fontSize: '1.1rem', color: '#6B7280', marginBottom: 12 }}>No hay rutas creadas</div>
              <button
                onClick={() => { setView('form'); setFormName(''); setFormDate(''); setFormDriver(''); setStops([]); setError(''); }}
                style={{ padding: '12px 24px', backgroundColor: ORANGE, color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' }}
              >
                + Nueva Ruta
              </button>
            </div>
          ) : filteredRoutes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>No hay rutas que coincidan con los filtros</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
              {filteredRoutes.map(r => {
                const s = estadoColor[r.status] ?? estadoColor.pending;
                return (
                  <div
                    key={r.id}
                    onClick={() => { setRouteId(r.id); setView('detail'); }}
                    style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '18px', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = ORANGE; e.currentTarget.style.boxShadow = '0 2px 8px rgba(255,104,53,0.1)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div style={{ fontWeight: '700', color: '#1A1A2E', fontSize: '0.95rem' }}>{r.name}</div>
                      <span style={{ fontSize: '0.68rem', fontWeight: '700', padding: '3px 8px', borderRadius: '6px', backgroundColor: s.bg, color: s.color }}>
                        {r.status === 'pending' ? 'Pendiente' : r.status === 'active' ? 'Activa' : 'Completada'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: 12 }}>
                      {r.date} {r.driver_name && `· ${r.driver_name}`}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 8, backgroundColor: '#F3F4F6', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ width: `${r.total_count > 0 ? (r.completed_count / r.total_count) * 100 : 0}%`, height: '100%', backgroundColor: s.color, borderRadius: 4 }} />
                      </div>
                      <span style={{ fontSize: '0.78rem', fontWeight: '700', color: s.color }}>
                        {r.completed_count}/{r.total_count}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // FORM VIEW
  if (view === 'form') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
        <OrangeHeader
          icon={Plus}
          title="Nueva Ruta"
          subtitle="Crear ruta de entrega con paradas"
          actions={[
            { label: '← Volver', onClick: () => { setView('list'); setError(''); } },
            { label: 'Guardar Ruta', primary: true, onClick: handleCreateRoute },
          ]}
        />
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
          {error && (
            <div style={{ marginBottom: 16, padding: '12px 16px', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: '10px', fontSize: '0.85rem' }}>
              {error}
            </div>
          )}

          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '24px', marginBottom: 20 }}>
              <div style={{ fontWeight: '700', color: '#1A1A2E', marginBottom: 18, fontSize: '1rem' }}>Información de la Ruta</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#374151', marginBottom: 6 }}>Nombre de la Ruta *</label>
                  <input
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    placeholder="Ej: Ruta Mvd Norte"
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '9px', fontSize: '0.85rem', outline: 'none' }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#374151', marginBottom: 6 }}>Fecha *</label>
                    <input
                      type="date"
                      value={formDate}
                      onChange={e => setFormDate(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '9px', fontSize: '0.85rem', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#374151', marginBottom: 6 }}>Nombre del Repartidor</label>
                    <input
                      value={formDriver}
                      onChange={e => setFormDriver(e.target.value)}
                      placeholder="Ej: Juan Pérez"
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '9px', fontSize: '0.85rem', outline: 'none' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '24px' }}>
              <div style={{ fontWeight: '700', color: '#1A1A2E', marginBottom: 18, fontSize: '1rem' }}>Agregar Paradas</div>
              
              <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                <div style={{ flex: 1 }}>
                  <input
                    value={newStopRecipient}
                    onChange={e => setNewStopRecipient(e.target.value)}
                    placeholder="Nombre del destinatario"
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '9px', fontSize: '0.85rem', outline: 'none', marginBottom: 8 }}
                  />
                  <input
                    value={newStopAddress}
                    onChange={e => setNewStopAddress(e.target.value)}
                    placeholder="Dirección completa"
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '9px', fontSize: '0.85rem', outline: 'none' }}
                  />
                </div>
                <button
                  onClick={addStop}
                  style={{ padding: '10px 20px', backgroundColor: ORANGE, color: '#fff', border: 'none', borderRadius: '9px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', alignSelf: 'flex-end' }}
                >
                  Agregar Parada
                </button>
              </div>

              {stops.length > 0 && (
                <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: 16 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: 12 }}>
                    Paradas ({stops.length}) - Arrastra para reordenar
                  </div>
                  {stops.map((stop, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px', backgroundColor: '#F9FAFB', borderRadius: '9px', marginBottom: 8 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: '700', color: ORANGE, minWidth: 24 }}>{index + 1}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', color: '#1A1A2E', fontSize: '0.85rem' }}>{stop.recipient_name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{stop.address}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          onClick={() => moveStop(index, 'up')}
                          disabled={index === 0}
                          style={{ padding: '6px', border: '1px solid #E5E7EB', borderRadius: '6px', backgroundColor: '#fff', cursor: index === 0 ? 'not-allowed' : 'pointer', opacity: index === 0 ? 0.5 : 1 }}
                        >
                          <ArrowUp size={14} color={index === 0 ? '#9CA3AF' : '#374151'} />
                        </button>
                        <button
                          onClick={() => moveStop(index, 'down')}
                          disabled={index === stops.length - 1}
                          style={{ padding: '6px', border: '1px solid #E5E7EB', borderRadius: '6px', backgroundColor: '#fff', cursor: index === stops.length - 1 ? 'not-allowed' : 'pointer', opacity: index === stops.length - 1 ? 0.5 : 1 }}
                        >
                          <ArrowDown size={14} color={index === stops.length - 1 ? '#9CA3AF' : '#374151'} />
                        </button>
                        <button
                          onClick={() => removeStop(index)}
                          style={{ padding: '6px', border: '1px solid #E5E7EB', borderRadius: '6px', backgroundColor: '#fff', cursor: 'pointer' }}
                        >
                          <X size={14} color="#DC2626" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // DETAIL VIEW
  if (view === 'detail' && selectedRoute) {
    const progress = selectedRoute.total_count > 0 ? (selectedRoute.completed_count / selectedRoute.total_count) * 100 : 0;
    const s = estadoColor[selectedRoute.status] ?? estadoColor.pending;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
        <OrangeHeader
          icon={Map}
          title={selectedRoute.name}
          subtitle={`${selectedRoute.date} ${selectedRoute.driver_name ? `· ${selectedRoute.driver_name}` : ''}`}
          actions={[
            { label: '← Volver', onClick: () => { setView('list'); setRouteId(null); setSelectedRoute(null); } },
            { label: selectedRoute.status === 'completed' ? 'Ruta Cerrada' : 'Cerrar Ruta', primary: selectedRoute.status !== 'completed', onClick: selectedRoute.status === 'completed' ? undefined : handleCloseRoute, disabled: selectedRoute.status === 'completed' },
          ]}
        />
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
          {error && (
            <div style={{ marginBottom: 16, padding: '12px 16px', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: '10px', fontSize: '0.85rem' }}>
              {error}
            </div>
          )}

          <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '24px', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ fontWeight: '800', color: '#1A1A2E', fontSize: '1.2rem', marginBottom: 4 }}>{selectedRoute.name}</div>
                <div style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>
                  {selectedRoute.date} {selectedRoute.driver_name && `· ${selectedRoute.driver_name}`}
                </div>
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: '700', padding: '4px 12px', borderRadius: '8px', backgroundColor: s.bg, color: s.color }}>
                {selectedRoute.status === 'pending' ? 'Pendiente' : selectedRoute.status === 'active' ? 'Activa' : 'Completada'}
              </span>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: '0.85rem', color: '#374151' }}>Progreso</span>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: s.color }}>{selectedRoute.completed_count}/{selectedRoute.total_count} completadas</span>
              </div>
              <div style={{ width: '100%', height: 12, backgroundColor: '#F3F4F6', borderRadius: 6, overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', backgroundColor: s.color, borderRadius: 6, transition: 'width 0.3s' }} />
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '24px' }}>
            <div style={{ fontWeight: '700', color: '#1A1A2E', marginBottom: 16, fontSize: '1rem' }}>Paradas</div>
            {selectedRoute.stops.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>No hay paradas en esta ruta</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {selectedRoute.stops.map((stop, index) => {
                  const stopS = stopEstadoColor[stop.status] ?? stopEstadoColor.pending;
                  return (
                    <div key={stop.id} style={{ display: 'flex', gap: 12, padding: '14px', backgroundColor: '#F9FAFB', borderRadius: '10px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: stopS.bg, border: `2px solid ${stopS.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: '700', color: stopS.color }}>{index + 1}</span>
                        </div>
                        {index < selectedRoute.stops.length - 1 && <div style={{ width: 2, height: 20, backgroundColor: '#E5E7EB', margin: '4px 0' }} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', color: '#1A1A2E', fontSize: '0.9rem', marginBottom: 4 }}>
                          {stop.recipient_name || 'Sin destinatario'}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#9CA3AF', marginBottom: 8 }}>
                          {stop.address || 'Sin dirección'}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: '700', padding: '2px 8px', borderRadius: '5px', backgroundColor: stopS.bg, color: stopS.color }}>
                            {stop.status === 'pending' ? 'Pendiente' : stop.status === 'completed' ? 'Completada' : 'Fallida'}
                          </span>
                          {stop.completed_at && (
                            <span style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>
                              {new Date(stop.completed_at).toLocaleString('es-UY')}
                            </span>
                          )}
                        </div>
                        {stop.notes && (
                          <div style={{ marginTop: 8, padding: '8px', backgroundColor: '#FEE2E2', borderRadius: '6px', fontSize: '0.75rem', color: '#DC2626' }}>
                            {stop.notes}
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {stop.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleCompleteStop(stop.id)}
                              disabled={loading}
                              style={{ padding: '8px 14px', backgroundColor: '#10B981', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
                            >
                              Completada
                            </button>
                            <button
                              onClick={() => setShowFailReason(stop.id)}
                              disabled={loading}
                              style={{ padding: '8px 14px', backgroundColor: '#DC2626', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
                            >
                              Fallida
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {showFailReason && (
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
              <div style={{ backgroundColor: '#fff', borderRadius: '14px', padding: '24px', width: '90%', maxWidth: 400 }}>
                <div style={{ fontWeight: '700', color: '#1A1A2E', marginBottom: 12 }}>Motivo de fallo</div>
                <textarea
                  value={failReason}
                  onChange={e => setFailReason(e.target.value)}
                  placeholder="Describe el motivo del fallo..."
                  style={{ width: '100%', minHeight: 100, padding: '10px', border: '1px solid #E5E7EB', borderRadius: '9px', fontSize: '0.85rem', outline: 'none', marginBottom: 16 }}
                />
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => { setShowFailReason(null); setFailReason(''); }}
                    style={{ padding: '8px 16px', border: '1px solid #E5E7EB', borderRadius: '8px', backgroundColor: '#F9FAFB', cursor: 'pointer', fontSize: '0.85rem' }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => handleFailStop(showFailReason, failReason)}
                    disabled={loading || !failReason}
                    style={{ padding: '8px 16px', backgroundColor: '#DC2626', color: '#fff', border: 'none', borderRadius: '8px', cursor: loading || !failReason ? 'not-allowed' : 'pointer', fontSize: '0.85rem', opacity: loading || !failReason ? 0.6 : 1 }}
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
