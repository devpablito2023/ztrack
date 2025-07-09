"use client";

import { useState, useCallback, useEffect } from "react";
import { useTheme } from "$/contexts/ThemeContext";
import useControlGrafica from "$/hooks/useControlGrafica";
import GraphControls from "./GraphControls";
import GraphLegend from "./GraphLegends";
import GraphChart from "./GraphChart";
import type { LegendItem, TemperatureUnit } from "$/types/controlGrafica";

const ControlGraficaMain: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { data, loading, error, loadInitialData, fetchData, clearData } =
    useControlGrafica();

  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>("C");

  // ✅ CAMBIO: Configuración base de leyendas (sin colores hardcodeados)
  const baseLegendConfig: Omit<LegendItem, "color" | "label" | "visible">[] = [
    // Temperaturas (configType: 1) → yAxisID: "y" (izquierda)
    {
      key: "temp_supply_1",
      type: "temperature",
      yAxisID: "y",
      configType: 1,
    },
    {
      key: "return_air",
      type: "temperature",
      yAxisID: "y",
      configType: 1,
    },
    {
      key: "ambient_air",
      type: "temperature",
      yAxisID: "y",
      configType: 1,
    },
    {
      key: "evaporation_coil",
      type: "temperature",
      yAxisID: "y",
      configType: 1,
    },
    {
      key: "set_point",
      type: "temperature",
      yAxisID: "y",
      configType: 1,
    },
    {
      key: "cargo_1_temp",
      type: "temperature",
      yAxisID: "y",
      configType: 1,
    },
    {
      key: "cargo_2_temp",
      type: "temperature",
      yAxisID: "y",
      configType: 1,
    },
    {
      key: "cargo_3_temp",
      type: "temperature",
      yAxisID: "y",
      configType: 1,
    },
    {
      key: "cargo_4_temp",
      type: "temperature",
      yAxisID: "y",
      configType: 1,
    },

    // Porcentajes/Humedad (configType: 2) → yAxisID: "y2" (derecha)
    {
      key: "relative_humidity",
      type: "percentage",
      yAxisID: "y2",
      configType: 2,
    },
    {
      key: "co2_reading",
      type: "percentage",
      yAxisID: "y2",
      configType: 2,
    },
    {
      key: "defrost_prueba",
      type: "percentage",
      yAxisID: "y2",
      configType: 2,
    },

    // Gases (configType: 3) → yAxisID: "y1" (derecha)
    {
      key: "ethylene",
      type: "gas",
      yAxisID: "y1",
      configType: 3,
    },
    {
      key: "sp_ethyleno",
      type: "gas",
      yAxisID: "y1",
      configType: 3,
    },

    // Estados (configType: 4) → yAxisID: "y2" (derecha, con porcentajes)
    {
      key: "power_state",
      type: "state",
      yAxisID: "y2",
      configType: 4,
    },
    {
      key: "stateProcess",
      type: "state",
      yAxisID: "y2",
      configType: 4,
    },
  ];

  // ✅ NUEVO: Estado para leyendas dinámicas
  const [legends, setLegends] = useState<LegendItem[]>([]);

  // ✅ NUEVO: Función para generar colores de fallback
  const generateFallbackColor = (index: number): string => {
    const colors = [
      "#ef4444",
      "#f97316",
      "#eab308",
      "#22c55e",
      "#06b6d4",
      "#8b5cf6",
      "#f59e0b",
      "#ec4899",
      "#14b8a6",
      "#3b82f6",
      "#10b981",
      "#f43f5e",
      "#dc2626",
      "#059669",
      "#7c3aed",
    ];
    return colors[index % colors.length];
  };

  // ✅ NUEVO: Función para generar label de fallback
  const generateFallbackLabel = (key: string): string => {
    const labelMap: Record<string, string> = {
      temp_supply_1: "Temp. Suministro",
      return_air: "Temp. Retorno",
      ambient_air: "Temp. Ambiente",
      evaporation_coil: "Temp. Evaporador",
      set_point: "Set Point",
      cargo_1_temp: "Cargo 1",
      cargo_2_temp: "Cargo 2",
      cargo_3_temp: "Cargo 3",
      cargo_4_temp: "Cargo 4",
      relative_humidity: "Humedad Relativa",
      co2_reading: "CO₂",
      defrost_prueba: "Defrost Prueba",
      ethylene: "Etileno",
      sp_ethyleno: "SP Etileno",
      power_state: "Estado Power",
      stateProcess: "Estado Proceso",
    };
    return (
      labelMap[key] ||
      key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    );
  };

  // ✅ NUEVO: Actualizar leyendas cuando lleguen nuevos datos
  useEffect(() => {
    if (data?.data?.graph) {
      console.log(
        "🎨 Actualizando leyendas con datos de la API:",
        data.data.graph
      );

      const updatedLegends: LegendItem[] = baseLegendConfig.map(
        (baseConfig, index) => {
          const apiData = data.data.graph[baseConfig.key];

          if (apiData?.config) {
            const [apiLabel, apiVisible, apiColor, apiConfigType] =
              apiData.config;

            console.log(`📊 ${baseConfig.key}:`, {
              apiLabel,
              apiVisible,
              apiColor,
              apiConfigType,
              baseConfigType: baseConfig.configType,
            });

            return {
              ...baseConfig,
              label: apiLabel || generateFallbackLabel(baseConfig.key),
              visible: apiVisible !== undefined ? apiVisible : index < 5, // Primeros 5 visibles por defecto
              color: apiColor || generateFallbackColor(index),
            };
          }

          // Fallback si no hay configuración en la API
          console.log(
            `⚠️ Sin config API para ${baseConfig.key}, usando fallback`
          );
          return {
            ...baseConfig,
            label: generateFallbackLabel(baseConfig.key),
            visible: index < 5, // Primeros 5 visibles por defecto
            color: generateFallbackColor(index),
          };
        }
      );

      setLegends(updatedLegends);
      console.log("✅ Leyendas actualizadas:", updatedLegends);
    }
  }, [data]);

  // Cargar datos iniciales al montar el componente
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
    setLegends([]); // ✅ Limpiar leyendas también
  }, [clearData]);

  // Toggle de leyenda (mantener estado local)
  const handleToggleLegend = useCallback((key: string) => {
    setLegends((prev) =>
      prev.map((legend) =>
        legend.key === key ? { ...legend, visible: !legend.visible } : legend
      )
    );
  }, []);

  // Toggle de unidad de temperatura
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
              📊 Gráficas de Monitoreo
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Visualización de datos históricos del contenedor en tiempo real
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
      <GraphControls
        onSearch={handleSearch}
        loading={loading}
        onClear={handleClear}
      />

      {/* Leyenda y controles */}
      <GraphLegend
        legends={legends}
        onToggleLegend={handleToggleLegend}
        temperatureUnit={temperatureUnit}
        onToggleTemperatureUnit={handleToggleTemperatureUnit}
      />

      {/* Gráfico principal */}
      <GraphChart
        data={data}
        loading={loading}
        error={error}
        legends={legends}
        temperatureUnit={temperatureUnit}
      />

      {/* Información adicional */}
      {data && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            📋 Información de la Consulta
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <span className="text-blue-600 dark:text-blue-400">📊</span>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total de registros
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {(
                      data?.data?.graph?.created_at?.data?.length || 0
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <span className="text-green-600 dark:text-green-400">📈</span>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Series visibles
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {legends.filter((l) => l.visible).length} / {legends.length}
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
                    Celsius (°{temperatureUnit})
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ayuda y consejos */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
          <span>💡</span>
          <span>Consejos de Uso</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="space-y-2">
            <p className="flex items-start space-x-2">
              <span className="text-blue-500 mt-0.5">🖱️</span>
              <span>
                Usa la rueda del mouse sobre el gráfico para hacer zoom
              </span>
            </p>
            <p className="flex items-start space-x-2">
              <span className="text-green-500 mt-0.5">👆</span>
              <span>Arrastra horizontalmente para navegar por el tiempo</span>
            </p>
            <p className="flex items-start space-x-2">
              <span className="text-purple-500 mt-0.5">👁️</span>
              <span>Haz clic en las leyendas para mostrar/ocultar series</span>
            </p>
          </div>
          <div className="space-y-2">
            <p className="flex items-start space-x-2">
              <span className="text-orange-500 mt-0.5">🕒</span>
              <span>
                Los filtros rápidos son ideales para análisis inmediato
              </span>
            </p>
            <p className="flex items-start space-x-2">
              <span className="text-red-500 mt-0.5">📅</span>
              <span>Usa rangos personalizados para análisis detallado</span>
            </p>
            <p className="flex items-start space-x-2">
              <span className="text-teal-500 mt-0.5">🌡️</span>
              <span>Cambia entre Celsius y Fahrenheit según necesites</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlGraficaMain;
