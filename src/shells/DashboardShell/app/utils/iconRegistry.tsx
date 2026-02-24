/**
 * iconRegistry.tsx
 * Mapa de íconos disponibles para los módulos del dashboard.
 *
 * Para agregar nuevos íconos:
 *   1. Importar el ícono deseado de lucide-react
 *   2. Añadirlo al objeto `iconMap` con su nombre exacto como clave
 */

import {
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  Settings,
  User,
  Bell,
  BarChart2,
  Package,
  Truck,
  CreditCard,
  MessageSquare,
  HelpCircle,
  ChevronRight,
  Home,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/** Registro de íconos accesibles por nombre de string */
const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  Settings,
  User,
  Bell,
  BarChart2,
  Package,
  Truck,
  CreditCard,
  MessageSquare,
  HelpCircle,
  ChevronRight,
  Home,
};

/**
 * Devuelve el componente LucideIcon correspondiente al nombre dado.
 * Si el nombre no existe en el registro, retorna `LayoutDashboard` como fallback.
 */
export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? LayoutDashboard;
}
