/**
 * theme.default.ts
 * Definición del tema por defecto del DashboardShell.
 *
 * Las variables aquí definidas se aplican como propiedades CSS personalizadas
 * en el elemento :root a través del ThemeProvider.
 *
 * Para crear un tema alternativo:
 *   1. Clonar este archivo como `theme.[nombre].ts`
 *   2. Actualizar las variables según la nueva marca
 *   3. Cambiar `theme` en dashboardConfig.ts al nombre del nuevo tema
 */

export interface ThemeDefinition {
  /** Nombre identificador del tema */
  name: string;
  /** Descripción del tema */
  description: string;
  /** Variables CSS que se inyectarán en :root */
  variables: Record<string, string>;
}

export const defaultTheme: ThemeDefinition = {
  name: 'default',
  description: 'Tema genérico del DashboardShell — índigo neutro sobre blancos limpios',
  variables: {
    /* ── Colores principales ── */
    '--shell-primary':        '#6366F1',
    '--shell-primary-dark':   '#4F46E5',
    '--shell-primary-light':  '#818CF8',
    '--shell-primary-subtle': '#EEF2FF',

    /* ── Colores secundarios ── */
    '--shell-secondary':      '#1E1B4B',
    '--shell-secondary-dark': '#0F0E2E',

    /* ── Fondo y superficies ── */
    '--shell-background':     '#F4F5F7',
    '--shell-surface':        '#FFFFFF',
    '--shell-surface-raised': '#FFFFFF',

    /* ── Texto ── */
    '--shell-text':           '#111827',
    '--shell-text-secondary': '#4B5563',
    '--shell-text-muted':     '#9CA3AF',

    /* ── Bordes ── */
    '--shell-border':         '#E5E7EB',
    '--shell-border-focus':   '#6366F1',

    /* ── Estado: éxito, advertencia, error ── */
    '--shell-success':        '#10B981',
    '--shell-warning':        '#F59E0B',
    '--shell-error':          '#EF4444',

    /* ── Tipografía ── */
    '--shell-font':           "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",

    /* ── Radios de borde ── */
    '--shell-radius-sm':      '8px',
    '--shell-radius-md':      '12px',
    '--shell-radius-lg':      '16px',
    '--shell-radius-xl':      '24px',

    /* ── Sombras ── */
    '--shell-shadow-sm':      '0 1px 3px rgba(0,0,0,0.08)',
    '--shell-shadow-md':      '0 4px 12px rgba(0,0,0,0.10)',
    '--shell-shadow-lg':      '0 8px 24px rgba(0,0,0,0.12)',

    /* ── Layout del shell ── */
    '--shell-header-height':     '60px',
    '--shell-bottom-nav-height': '70px',
  },
};

/** Mapa de temas disponibles — registra nuevos temas aquí */
export const themeRegistry: Record<string, ThemeDefinition> = {
  default: defaultTheme,
};
