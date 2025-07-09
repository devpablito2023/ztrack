// Este archivo contiene los datos reales del menú
// Usa los tipos definidos en types/navigation.ts

import {
  LayoutDashboard,
  Settings,
  RotateCcw,
  BarChart3,
  Database,
  Zap,
} from "lucide-react";
import { NavigationGroup } from "$/types/navigation";

export const navigationConfig: NavigationGroup[] = [
  {
    id: "main",
    label: "Principal",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    id: "control",
    label: "Control",
    items: [
      {
        id: "manual-control",
        label: "Manual Control",
        href: "/manual-control",
        icon: Settings,
      },
      {
        id: "cycle-control",
        label: "Cycle Control",
        href: "/cycle-control",
        icon: RotateCcw,
      },
      {
        id: "control-automatico",
        label: "Control Automático",
        href: "/control-automatico",
        icon: Zap,
      },
    ],
  },
  {
    id: "data",
    label: "Datos",
    items: [
      {
        id: "graph",
        label: "Graph",
        href: "/graph",
        icon: BarChart3,
      },
      {
        id: "data",
        label: "Data",
        href: "/data",
        icon: Database,
      },
    ],
  },
];
