// Este archivo solo contiene las interfaces/tipos TypeScript
// Define la estructura de datos pero no los datos en sí

import { LucideIcon } from "lucide-react";

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  children?: NavigationItem[];
}

export interface NavigationGroup {
  id: string;
  label?: string;
  items: NavigationItem[];
}
