/* =====================================================
   RepositorioAPIsView — Repositorio centralizado de APIs
   23 APIs catalogadas · Estado · Credenciales · Test
   ===================================================== */
import React, { useState } from 'react';
import { OrangeHeader } from '../OrangeHeader';
import type { MainSection } from '../../../AdminDashboard';
import { Globe, CheckCircle, XCircle, AlertTriangle, Search, Eye, EyeOff, TestTube, ChevronDown, ChevronRight, Zap } from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

interface API {
  id: string; nombre: string; grupo: string; version: string;
  estado: 'activa' | 'inactiva' | 'degradada' | 'mantenimiento';
  tipo: string; url: string; apiKey: string; latencia: string; uptime: string; descripcion: string; emoji: string;
}

const apis: API[] = [
  // Pagos
  { id: 'plexo', nombre: 'Plexo', grupo: 'Pagos', version: 'v2', estado: 'activa', tipo: 'REST', url: 'https://api.plexo.com.uy/v2', apiKey: 'plx_live_xxxxxxxxxxxxxxxx', latencia: '142ms', uptime: '99.9%', descripcion: 'Pasarela de pagos nativa Uruguay. Acepta todas las tarjetas.', emoji: '🇺🇾' },
  { id: 'mercadopago', nombre: 'MercadoPago', grupo: 'Pagos', version: 'v1', estado: 'activa', tipo: 'REST', url: 'https://api.mercadopago.com/v1', apiKey: 'APP_USR-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', latencia: '210ms', uptime: '99.7%', descripcion: 'Pagos Latam. Checkout Pro, Bricks y suscripciones.', emoji: '🛒' },
  { id: 'stripe', nombre: 'Stripe', grupo: 'Pagos', version: 'v1', estado: 'activa', tipo: 'REST', url: 'https://api.stripe.com/v1', apiKey: 'STRIPE_SECRET_KEY', latencia: '180ms', uptime: '99.99%', descripcion: 'Pagos global. Tarjetas, transferencias, wallets.', emoji: '⚡' },
  { id: 'paypal', nombre: 'PayPal', grupo: 'Pagos', version: 'v2', estado: 'inactiva', tipo: 'REST', url: 'https://api-m.paypal.com/v2', apiKey: '', latencia: '—', uptime: '—', descripcion: 'PayPal Checkout, suscripciones y pagos internacionales.', emoji: '💙' },
  // Logística
  { id: 'correo-uy', nombre: 'Correo Uruguay', grupo: 'Logística', version: 'v1', estado: 'activa', tipo: 'SOAP', url: 'https://api.correo.com.uy/v1', apiKey: 'correo_xxxxxxxxxxxxxxxx', latencia: '340ms', uptime: '98.2%', descripcion: 'API oficial del Correo Uruguayo. Tracking y cotizaciones.', emoji: '🇺🇾' },
  { id: 'oca', nombre: 'OCA', grupo: 'Logística', version: 'v2', estado: 'activa', tipo: 'REST', url: 'https://api.oca.com.uy/v2', apiKey: 'oca_xxxxxxxxxxxxxxxx', latencia: '220ms', uptime: '99.1%', descripcion: 'Servicios de mensajería OCA Argentina/Uruguay.', emoji: '🚚' },
  { id: 'andreani', nombre: 'Andreani', grupo: 'Logística', version: 'v1', estado: 'inactiva', tipo: 'REST', url: 'https://apis.andreani.com/v1', apiKey: '', latencia: '—', uptime: '—', descripcion: 'Logística y mensajería Argentina + integración ARCA.', emoji: '📦' },
  { id: 'pedidosya', nombre: 'PedidosYa', grupo: 'Logística', version: 'v1', estado: 'degradada', tipo: 'REST', url: 'https://api.pedidosya.com/v1', apiKey: 'pya_xxxxxxxxxxxxxxxx', latencia: '850ms', uptime: '94.1%', descripcion: 'Delivery y logística last-mile regional.', emoji: '🛵' },
  // Marketplaces
  { id: 'ml', nombre: 'Mercado Libre', grupo: 'Marketplaces', version: 'v1', estado: 'activa', tipo: 'REST', url: 'https://api.mercadolibre.com/v1', apiKey: 'ML_TOKEN_xxxxxxxxxxxxxxxxxx', latencia: '195ms', uptime: '99.5%', descripcion: 'Sincronización de productos, pedidos y mensajes ML.', emoji: '🛍️' },
  { id: 'tiendanube', nombre: 'TiendaNube', grupo: 'Marketplaces', version: 'v1', estado: 'activa', tipo: 'REST', url: 'https://api.tiendanube.com/v1', apiKey: 'TN_TOKEN_xxxxxxxxxxxxxxxxxx', latencia: '165ms', uptime: '99.8%', descripcion: 'Sync de catálogo y pedidos con TiendaNube.', emoji: '☁️' },
  { id: 'shopify', nombre: 'Shopify', grupo: 'Marketplaces', version: '2024-01', estado: 'inactiva', tipo: 'GraphQL', url: 'https://tienda.myshopify.com/admin/api', apiKey: '', latencia: '—', uptime: '—', descripcion: 'API Admin de Shopify para sync bidireccional.', emoji: '🟢' },
  // RRSS
  { id: 'meta-graph', nombre: 'Meta Graph API', grupo: 'RRSS', version: 'v20.0', estado: 'activa', tipo: 'REST', url: 'https://graph.facebook.com/v20.0', apiKey: 'EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', latencia: '230ms', uptime: '99.6%', descripcion: 'Facebook, Instagram, WhatsApp Business API.', emoji: '👥' },
  { id: 'tiktok-api', nombre: 'TikTok for Business', grupo: 'RRSS', version: 'v1.3', estado: 'inactiva', tipo: 'REST', url: 'https://business-api.tiktok.com/open_api/v1.3', apiKey: '', latencia: '—', uptime: '—', descripcion: 'TikTok Ads API para campañas y reportes.', emoji: '🎵' },
  // Comunicaciones
  { id: 'twilio-api', nombre: 'Twilio', grupo: 'Comunicaciones', version: '2010-04-01', estado: 'activa', tipo: 'REST', url: 'https://api.twilio.com/2010-04-01', apiKey: 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', latencia: '120ms', uptime: '99.95%', descripcion: 'SMS, WhatsApp, llamadas de voz y verificación OTP.', emoji: '📱' },
  { id: 'resend-api', nombre: 'Resend', grupo: 'Comunicaciones', version: 'v1', estado: 'activa', tipo: 'REST', url: 'https://api.resend.com/v1', apiKey: 're_xxxxxxxxxxxxxxxxxxxx', latencia: '95ms', uptime: '99.99%', descripcion: 'Email transaccional moderno con React Email templates.', emoji: '✉️' },
  // Analíticas
  { id: 'ga4-api', nombre: 'GA4 Reporting API', grupo: 'Analíticas', version: 'v1beta', estado: 'activa', tipo: 'REST', url: 'https://analyticsdata.googleapis.com/v1beta', apiKey: 'AIzaxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', latencia: '280ms', uptime: '99.9%', descripcion: 'Reporting API de Google Analytics 4.', emoji: '📊' },
  // Automatización
  { id: 'zapier-hooks', nombre: 'Zapier Webhooks', grupo: 'Automatización', version: 'v1', estado: 'activa', tipo: 'Webhooks', url: 'https://hooks.zapier.com/hooks/catch/', apiKey: 'zap_xxxxxxxxxxxxxxxxxxxxxxxx', latencia: '150ms', uptime: '99.5%', descripcion: 'Triggers y actions de Zapier para workflows automáticos.', emoji: '⚡' },
  // Supabase
  { id: 'supabase-db', nombre: 'Supabase DB', grupo: 'Backend', version: 'v1', estado: 'activa', tipo: 'REST/GraphQL', url: 'https://xxxx.supabase.co/rest/v1', apiKey: 'sbp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', latencia: '55ms', uptime: '99.99%', descripcion: 'PostgREST sobre PostgreSQL. Auth, Storage, Realtime.', emoji: '⚡' },
  { id: 'supabase-edge', nombre: 'Supabase Edge Functions', grupo: 'Backend', version: 'v1', estado: 'activa', tipo: 'HTTP', url: 'https://xxxx.supabase.co/functions/v1', apiKey: 'sbp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', latencia: '88ms', uptime: '99.9%', descripcion: 'Funciones serverless en Deno. Lógica de negocio segura.', emoji: '🔧' },
  // Geolocalización
  { id: 'google-maps', nombre: 'Google Maps', grupo: 'Geolocalización', version: 'v3', estado: 'activa', tipo: 'REST/JS', url: 'https://maps.googleapis.com/maps/api', apiKey: 'AIzaxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', latencia: '130ms', uptime: '99.9%', descripcion: 'Maps, Geocoding, Directions y Places para logística.', emoji: '🗺️' },
  // IA
  { id: 'openai', nombre: 'OpenAI GPT-4', grupo: 'IA', version: 'v1', estado: 'mantenimiento', tipo: 'REST', url: 'https://api.openai.com/v1', apiKey: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', latencia: '—', uptime: '—', descripcion: 'GPT-4 para IA generativa: chatbot, clasificación, resúmenes.', emoji: '🤖' },
  { id: 'anthropic', nombre: 'Anthropic Claude', grupo: 'IA', version: 'v1', estado: 'inactiva', tipo: 'REST', url: 'https://api.anthropic.com/v1', apiKey: '', latencia: '—', uptime: '—', descripcion: 'Claude 3 para análisis de texto y soporte IA.', emoji: '🧠' },
  { id: 'gemini', nombre: 'Google Gemini', grupo: 'IA', version: 'v1', estado: 'inactiva', tipo: 'REST', url: 'https://generativelanguage.googleapis.com/v1', apiKey: '', latencia: '—', uptime: '—', descripcion: 'Gemini Pro para multimodal y procesamiento de imágenes.', emoji: '✨' },
];

const GRUPOS = ['Todos', 'Pagos', 'Logística', 'Marketplaces', 'RRSS', 'Comunicaciones', 'Analíticas', 'Automatización', 'Backend', 'Geolocalización', 'IA'];

const estadoStyle = {
  activa:       { bg: '#D1FAE5', color: '#059669', icon: CheckCircle },
  inactiva:     { bg: '#F3F4F6', color: '#6B7280', icon: XCircle },
  degradada:    { bg: '#FEF3C7', color: '#D97706', icon: AlertTriangle },
  mantenimiento:{ bg: '#EDE9FE', color: '#7C3AED', icon: AlertTriangle },
};

export function RepositorioAPIsView({ onNavigate }: Props) {
  const [filtroGrupo, setFiltroGrupo] = useState('Todos');
  const [search, setSearch] = useState('');
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [expandida, setExpandida] = useState<string | null>(null);
  const [testing, setTesting] = useState<Record<string, boolean>>({});
  const [testResult, setTestResult] = useState<Record<string, string>>({});

  const filtradas = apis.filter(a =>
    (filtroGrupo === 'Todos' || a.grupo === filtroGrupo) &&
    (!search || a.nombre.toLowerCase().includes(search.toLowerCase()) || a.descripcion.toLowerCase().includes(search.toLowerCase()))
  );

  const activas = apis.filter(a => a.estado === 'activa').length;
  const inactivas = apis.filter(a => a.estado === 'inactiva').length;
  const degradadas = apis.filter(a => a.estado === 'degradada').length;

  const probarConexion = (id: string) => {
    setTesting(prev => ({ ...prev, [id]: true }));
    setTestResult(prev => ({ ...prev, [id]: '' }));
    setTimeout(() => {
      const api = apis.find(a => a.id === id);
      const ok = api?.estado === 'activa';
      setTestResult(prev => ({ ...prev, [id]: ok ? `✅ OK · ${api?.latencia}` : '❌ Sin respuesta' }));
      setTesting(prev => ({ ...prev, [id]: false }));
    }, 1500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={Globe}
        title="Repositorio de APIs"
        subtitle={`${apis.length} APIs catalogadas · Estado en tiempo real · Credenciales · Test de conexión`}
        actions={[
          { label: '← Volver', onClick: () => onNavigate('integraciones') },
          { label: '+ Agregar API', primary: true },
        ]}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'APIs activas', value: activas, icon: '✅', color: '#10B981' },
            { label: 'Inactivas', value: inactivas, icon: '⚫', color: '#6B7280' },
            { label: 'Degradadas', value: degradadas, icon: '⚠️', color: '#D97706' },
            { label: 'Total catalogadas', value: apis.length, icon: '🔗', color: ORANGE },
          ].map((k, i) => (
            <div key={i} style={{ backgroundColor: '#fff', borderRadius: 14, border: '1px solid #E5E7EB', padding: 20 }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>{k.icon}</div>
              <div style={{ fontSize: '0.78rem', color: '#6B7280', marginBottom: 4 }}>{k.label}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: k.color }}>{k.value}</div>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} color="#9CA3AF" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar API..."
              style={{ paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8, border: '1px solid #E5E7EB', borderRadius: 9, fontSize: '0.82rem', outline: 'none', width: 200 }} />
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {GRUPOS.map(g => (
              <button key={g} onClick={() => setFiltroGrupo(g)}
                style={{ padding: '6px 12px', borderRadius: 8, border: `2px solid ${filtroGrupo === g ? ORANGE : '#E5E7EB'}`, backgroundColor: filtroGrupo === g ? `${ORANGE}10` : 'transparent', color: filtroGrupo === g ? ORANGE : '#6B7280', fontWeight: filtroGrupo === g ? '700' : '500', fontSize: '0.75rem', cursor: 'pointer' }}>
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de APIs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtradas.map(api => {
            const st = estadoStyle[api.estado];
            const Icon = st.icon;
            const isExpanded = expandida === api.id;
            return (
              <div key={api.id} style={{ backgroundColor: '#fff', borderRadius: 14, border: `1px solid ${isExpanded ? ORANGE + '40' : '#E5E7EB'}`, overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}
                  onClick={() => setExpandida(isExpanded ? null : api.id)}>
                  <div style={{ fontSize: '1.3rem', flexShrink: 0 }}>{api.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                      <span style={{ fontWeight: '700', color: '#1A1A2E', fontSize: '0.92rem' }}>{api.nombre}</span>
                      <span style={{ padding: '2px 8px', borderRadius: 6, backgroundColor: '#F3F4F6', color: '#6B7280', fontSize: '0.7rem', fontWeight: '600' }}>{api.grupo}</span>
                      <span style={{ padding: '2px 8px', borderRadius: 6, backgroundColor: '#EFF6FF', color: '#1D4ED8', fontSize: '0.7rem', fontWeight: '600' }}>{api.tipo}</span>
                      <span style={{ padding: '2px 8px', borderRadius: 6, backgroundColor: st.bg, color: st.color, fontSize: '0.7rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Icon size={10} /> {api.estado}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: '#6B7280' }}>{api.descripcion}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexShrink: 0 }}>
                    {api.latencia !== '—' && <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{api.latencia}</span>}
                    {api.uptime !== '—' && <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: '700' }}>{api.uptime}</span>}
                    {isExpanded ? <ChevronDown size={16} color="#9CA3AF" /> : <ChevronRight size={16} color="#9CA3AF" />}
                  </div>
                </div>

                {isExpanded && (
                  <div style={{ borderTop: '1px solid #F3F4F6', padding: '16px 20px', backgroundColor: '#FAFAFA' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div>
                        <label style={{ fontSize: '0.72rem', color: '#9CA3AF', fontWeight: '700', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Endpoint base</label>
                        <code style={{ display: 'block', padding: '8px 12px', backgroundColor: '#1A1A2E', color: '#A3E635', borderRadius: 8, fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {api.url}
                        </code>
                      </div>
                      <div>
                        <label style={{ fontSize: '0.72rem', color: '#9CA3AF', fontWeight: '700', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Versión de API</label>
                        <span style={{ padding: '6px 14px', borderRadius: 8, backgroundColor: '#EFF6FF', color: '#1D4ED8', fontSize: '0.82rem', fontWeight: '700' }}>{api.version}</span>
                      </div>
                    </div>

                    {api.apiKey && (
                      <div style={{ marginTop: 16 }}>
                        <label style={{ fontSize: '0.72rem', color: '#9CA3AF', fontWeight: '700', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>API Key</label>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <code style={{ flex: 1, padding: '8px 12px', backgroundColor: '#F3F4F6', borderRadius: 8, fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', border: '1px solid #E5E7EB' }}>
                            {showKey[api.id] ? api.apiKey : '•'.repeat(32)}
                          </code>
                          <button onClick={() => setShowKey(prev => ({ ...prev, [api.id]: !prev[api.id] }))}
                            style={{ padding: '8px', borderRadius: 8, border: '1px solid #E5E7EB', backgroundColor: '#fff', cursor: 'pointer' }}>
                            {showKey[api.id] ? <EyeOff size={14} color="#6B7280" /> : <Eye size={14} color="#6B7280" />}
                          </button>
                        </div>
                      </div>
                    )}

                    <div style={{ marginTop: 16, display: 'flex', gap: 10, alignItems: 'center' }}>
                      <button onClick={() => probarConexion(api.id)} disabled={testing[api.id]}
                        style={{ padding: '8px 16px', borderRadius: 9, border: 'none', backgroundColor: testing[api.id] ? '#E5E7EB' : ORANGE, color: testing[api.id] ? '#9CA3AF' : '#fff', fontWeight: '700', fontSize: '0.82rem', cursor: testing[api.id] ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Zap size={13} /> {testing[api.id] ? 'Probando...' : 'Test conexión'}
                      </button>
                      {testResult[api.id] && (
                        <span style={{ fontSize: '0.82rem', fontWeight: '700', color: testResult[api.id].startsWith('✅') ? '#059669' : '#DC2626' }}>
                          {testResult[api.id]}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
