"use client";

import { useState, useCallback } from "react";
import { useControlAutomatico } from "$/hooks/useControlAutomatico";
import ControlAutomaticoHeader from "./ControlAutomaticoHeader";
import ControlFormularios from "./ControlFormularios";
import ControlTablaActivos from "./ControlTablaActivos";
import ControlTablaHistorico from "./ControlTablaHistorico";

export default function ControlAutomaticoMain() {
  // TODO: Obtener estos valores del contexto de usuario/auth
  const id_usuario = 87; // Temporal - reemplazar con el usuario real
  const tipo_usuario = 1; // Temporal - reemplazar con el tipo real

  const { controles, loading, error, isRefreshing, refetch, lastUpdate } =
    useControlAutomatico({ id_usuario, tipo_usuario });

  const [tipoControl, setTipoControl] = useState<
    "unico" | "ciclico" | "periodico"
  >("unico");

  // Callback para refrescar cuando se crea un control
  const handleControlCreated = useCallback(() => {
    console.log("Refrescando lista de controles...");
    refetch();
  }, [refetch]);

  // Separar controles activos y histórico
  const controlesActivos = controles.filter(
    (c) => c.estado_control_temperatura === 1
  );
  const controlesHistorico = controles.filter(
    (c) => c.estado_control_temperatura === 0
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                Control Automático
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                Cargando datos de control...
              </p>
            </div>
          </div>
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            </div>
            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                Control Automático
              </h1>
              <p className="text-sm sm:text-base text-red-600 dark:text-red-400 mt-1">
                Error: {error}
              </p>
            </div>
            <button
              onClick={refetch}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
            >
              <span>Reintentar</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <ControlAutomaticoHeader
          controlesCount={controles.length}
          controlesActivos={controlesActivos.length}
          isRefreshing={isRefreshing}
          lastUpdate={lastUpdate}
          onRefresh={refetch}
        />

        {/* Layout Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Izquierda: Formularios de Control */}
          <div className="space-y-6">
            <ControlFormularios
              tipoControl={tipoControl}
              onTipoControlChange={setTipoControl}
              onControlCreated={handleControlCreated}
            />
          </div>

          {/* Derecha: Tabla de Controles Activos */}
          <div className="space-y-6">
            <ControlTablaActivos
              controles={controlesActivos}
              loading={loading}
              onRefresh={refetch}
            />
          </div>
        </div>

        {/* Abajo: Tabla de Histórico */}
        <div className="space-y-6">
          <ControlTablaHistorico
            controles={controlesHistorico}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
