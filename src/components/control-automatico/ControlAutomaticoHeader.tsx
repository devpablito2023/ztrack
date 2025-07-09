"use client";
import { RefreshCw, Activity, Clock, CheckCircle } from "lucide-react";

interface ControlAutomaticoHeaderProps {
  controlesCount: number;
  controlesActivos: number;
  isRefreshing: boolean;
  lastUpdate: string | null;
  onRefresh: () => void;
}

export default function ControlAutomaticoHeader({
  controlesCount,
  controlesActivos,
  isRefreshing,
  lastUpdate,
  onRefresh,
}: ControlAutomaticoHeaderProps) {
  const formatLastUpdate = (dateString: string | null) => {
    if (!dateString) return "Nunca";
    const date = new Date(dateString);
    return date.toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1 min-w-0">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
          Control Automático
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
          Gestión y monitoreo de procesos de control de temperatura
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
        {/* Stats */}
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400">
            <Activity className="w-4 h-4" />
            <span className="font-medium">{controlesActivos} Activos</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
            <CheckCircle className="w-4 h-4" />
            <span className="font-medium">{controlesCount} Total</span>
          </div>
        </div>

        {/* Last Update */}
        <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
          <Clock className="w-3 h-3" />
          <span>Actualizado: {formatLastUpdate(lastUpdate)}</span>
        </div>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
        >
          <RefreshCw
            className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          <span>{isRefreshing ? "Actualizando..." : "Actualizar"}</span>
        </button>
      </div>
    </div>
  );
}
