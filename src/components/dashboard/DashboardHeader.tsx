"use client";
import { RefreshCw, Clock, Pause, Play } from "lucide-react";

interface DashboardHeaderProps {
  containersCount: number;
  isRefreshing: boolean;
  lastUpdate: string | null;
  autoUpdatePaused: boolean;
  onToggleAutoUpdate: () => void;
  onRefresh: () => void;
}

export default function DashboardHeader({
  containersCount,
  isRefreshing,
  lastUpdate,
  autoUpdatePaused,
  onToggleAutoUpdate,
  onRefresh,
}: DashboardHeaderProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            {isRefreshing && (
              <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-xs hidden sm:inline">
                  Actualizando...
                </span>
              </div>
            )}
          </div>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-2">
            Sistema de Control ZGROUP - {containersCount} contenedores
          </p>
          <div className="flex flex-col space-y-1 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {lastUpdate && (
              <span className="flex items-center space-x-1">
                <Clock className="w-3 h-3 flex-shrink-0" />
                <span>
                  Última actualización:{" "}
                  {new Date(lastUpdate).toLocaleTimeString()}
                </span>
              </span>
            )}
            {autoUpdatePaused && (
              <span className="flex items-center space-x-1 text-orange-600 dark:text-orange-400">
                <Pause className="w-3 h-3 flex-shrink-0" />
                <span>Actualización pausada</span>
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
          <button
            onClick={onToggleAutoUpdate}
            className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
              autoUpdatePaused
                ? "bg-orange-600 hover:bg-orange-700 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {autoUpdatePaused ? (
              <Play className="w-4 h-4" />
            ) : (
              <Pause className="w-4 h-4" />
            )}
            <span>{autoUpdatePaused ? "Reanudar" : "Pausar"}</span>
          </button>
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm font-medium"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            <span>{isRefreshing ? "Actualizando..." : "Actualizar"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
