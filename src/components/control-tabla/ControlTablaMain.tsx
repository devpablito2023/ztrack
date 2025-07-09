"use client";

import { useState, useCallback, useEffect } from "react";
import { useTheme } from "$/contexts/ThemeContext";
import useControlTable from "$/hooks/useControlTable";
import TableControls from "./TableControls";
import ControlTable from "./ControlTable";
import type { TemperatureUnit } from "$/types/controlTable";

const ControlTableMain: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // ✅ Hook para manejar datos de la tabla
  const { data, loading, error, loadInitialData, fetchData, clearData } =
    useControlTable();

  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>("C");

  // ✅ Cargar datos iniciales al montar el componente
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Manejar búsqueda con filtros
  const handleSearch = useCallback(
    (fechaI: string, fechaF: string, ultima: string) => {
      fetchData(fechaI, fechaF, ultima);
    },
    [fetchData]
  );

  // Manejar limpieza
  const handleClear = useCallback(() => {
    clearData();
  }, [clearData]);

  // ✅ Toggle de unidad de temperatura
  const handleToggleTemperatureUnit = useCallback(() => {
    setTemperatureUnit((prev: TemperatureUnit) => (prev === "C" ? "F" : "C"));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              📋 Tabla de Monitoreo
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Datos históricos del contenedor en formato tabular
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>En línea</span>
            </span>
          </div>
        </div>
      </div>

      {/* Controles de filtros */}
      <TableControls
        onSearch={handleSearch}
        loading={loading}
        onClear={handleClear}
      />

      {/* ✅ Tabla principal con toggle de temperatura incluido */}
      <ControlTable
        data={data}
        loading={loading}
        error={error}
        temperatureUnit={temperatureUnit}
        onToggleTemperatureUnit={handleToggleTemperatureUnit}
      />

      {/* Información adicional */}
      {data && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            📊 Información de la Consulta
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <span className="text-blue-600 dark:text-blue-400">📋</span>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total de registros
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {data.data.table.length.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <span className="text-green-600 dark:text-green-400">📅</span>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Rango de fechas
                  </p>
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">
                    {data.data.date[0]} - {data.data.date[1]}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <span className="text-purple-600 dark:text-purple-400">🌡️</span>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Unidad temperatura
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {temperatureUnit === "C" ? "Celsius" : "Fahrenheit"} (°
                    {temperatureUnit})
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <span className="text-orange-600 dark:text-orange-400">⚡</span>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Temperatura base
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {data.data.temperature}°C
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ayuda y consejos */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
          <span>💡</span>
          <span>Consejos de Uso de la Tabla</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="space-y-2">
            <p className="flex items-start space-x-2">
              <span className="text-blue-500 mt-0.5">🔍</span>
              <span>
                Usa los filtros de fecha para consultar períodos específicos
              </span>
            </p>
            <p className="flex items-start space-x-2">
              <span className="text-green-500 mt-0.5">📊</span>
              <span>Los datos se muestran del más reciente al más antiguo</span>
            </p>
            <p className="flex items-start space-x-2">
              <span className="text-purple-500 mt-0.5">🌡️</span>
              <span>
                Cambia entre Celsius y Fahrenheit con el toggle en la tabla
              </span>
            </p>
            <p className="flex items-start space-x-2">
              <span className="text-orange-500 mt-0.5">📥</span>
              <span>
                Descarga los datos en Excel, PDF o imprime directamente
              </span>
            </p>
          </div>
          <div className="space-y-2">
            <p className="flex items-start space-x-2">
              <span className="text-red-500 mt-0.5">⚡</span>
              <span>Los valores null se muestran como "N/A" en la tabla</span>
            </p>
            <p className="flex items-start space-x-2">
              <span className="text-teal-500 mt-0.5">🔄</span>
              <span>Usa "Limpiar" para resetear todos los filtros</span>
            </p>
            <p className="flex items-start space-x-2">
              <span className="text-indigo-500 mt-0.5">📋</span>
              <span>Haz scroll horizontal para ver todas las columnas</span>
            </p>
            <p className="flex items-start space-x-2">
              <span className="text-pink-500 mt-0.5">🖨️</span>
              <span>
                Usa las opciones de exportación en la parte superior de la tabla
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlTableMain;
