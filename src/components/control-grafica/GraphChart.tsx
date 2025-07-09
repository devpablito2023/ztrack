"use client";

import React, { useMemo, useState, useCallback, useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "chartjs-adapter-date-fns";
import { format, parseISO, isValid } from "date-fns";
import { es } from "date-fns/locale";
import { useTheme } from "$/contexts/ThemeContext";
import type { LegendItem } from "$/types/controlGrafica";
import type { ControlGraficaResponse } from "$/types/controlGrafica";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  zoomPlugin,
  ChartDataLabels
);

interface GraphChartProps {
  data: ControlGraficaResponse | null;
  legends: LegendItem[];
  temperatureUnit: "C" | "F";
  loading: boolean;
  error: string | null;
}

const GraphChart: React.FC<GraphChartProps> = ({
  data,
  legends,
  temperatureUnit,
  loading,
  error,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // ✅ NUEVO: Estados para controlar zoom y visualización dinámica
  const [dataLabelsVisibility, setDataLabelsVisibility] = useState<
    Record<string, boolean>
  >({});
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [visibleDataPoints, setVisibleDataPoints] = useState<number>(0);
  const [autoLabelsEnabled, setAutoLabelsEnabled] = useState<boolean>(true);
  const chartRef = useRef<any>(null);

  const convertTemperature = (temp: number): number => {
    if (temperatureUnit === "F") {
      return (temp * 9) / 5 + 32;
    }
    return temp;
  };

  const formatDataLabel = (value: any, legend: LegendItem): string => {
    if (value === null || value === undefined) return "";
    switch (legend.type) {
      case "temperature":
        return `${value.toFixed(1)}°${temperatureUnit}`;
      case "percentage":
        return `${value.toFixed(1)}%`;
      case "gas":
        return `${value.toFixed(2)}`;
      case "state":
        const stateLabels: Record<number, string> = {
          0: "Off",
          1: "On",
          2: "Proc",
          3: "Alarm",
        };
        return stateLabels[value] || value.toString();
      default:
        return value.toString();
    }
  };

  // ✅ NUEVO: Función para calcular la densidad de etiquetas según el zoom
  const calculateLabelDensity = useCallback(
    (totalPoints: number, zoomLevel: number): number => {
      const effectivePoints = Math.round(totalPoints / zoomLevel);

      if (effectivePoints <= 20) {
        return 1; // Mostrar todas las etiquetas
      } else if (effectivePoints <= 50) {
        return 2; // Mostrar cada 2 puntos
      } else if (effectivePoints <= 100) {
        return 3; // Mostrar cada 3 puntos
      } else if (effectivePoints <= 200) {
        return 5; // Mostrar cada 5 puntos
      } else if (effectivePoints <= 500) {
        return 10; // Mostrar cada 10 puntos
      } else {
        return 20; // Mostrar cada 20 puntos
      }
    },
    []
  );

  // ✅ NUEVO: Callback para manejar eventos de zoom
  const handleZoom = useCallback(
    (chart: any) => {
      if (!chart || !chart.scales || !chart.scales.x) return;

      const xScale = chart.scales.x;
      const totalDataPoints = chart.data.labels?.length || 0;

      // Calcular el nivel de zoom basado en el rango visible
      const visibleRange = xScale.max - xScale.min;
      const totalRange =
        Math.max(...chart.data.labels.map((label: Date) => label.getTime())) -
        Math.min(...chart.data.labels.map((label: Date) => label.getTime()));

      const currentZoomLevel = totalRange / visibleRange;
      const visiblePoints = Math.round(totalDataPoints / currentZoomLevel);

      setZoomLevel(currentZoomLevel);
      setVisibleDataPoints(visiblePoints);

      // Si el modo automático está habilitado, actualizar la visibilidad de etiquetas
      if (autoLabelsEnabled) {
        const activeLegends = legends.filter(
          (l) => l.visible && data?.data?.graph?.[l.key]
        );
        const shouldShowLabels = visiblePoints <= 100; // Mostrar etiquetas solo si hay menos de 100 puntos visibles

        const newVisibility: Record<string, boolean> = {};
        activeLegends.forEach((legend) => {
          newVisibility[legend.key] = shouldShowLabels;
        });

        setDataLabelsVisibility((prev) => ({
          ...prev,
          ...newVisibility,
        }));
      }
    },
    [legends, data, autoLabelsEnabled]
  );

  // ✅ NUEVO: Función para toggle del modo automático
  const toggleAutoLabels = () => {
    setAutoLabelsEnabled((prev) => !prev);
    if (!autoLabelsEnabled) {
      // Si se activa el modo automático, aplicar la lógica actual
      handleZoom(chartRef.current);
    }
  };

  // Función para toggle individual de etiquetas (solo funciona si el modo automático está desactivado)
  const toggleDataLabels = (legendKey: string) => {
    if (autoLabelsEnabled) return; // No permitir cambios manuales en modo automático

    setDataLabelsVisibility((prev) => ({
      ...prev,
      [legendKey]: !prev[legendKey],
    }));
  };

  // Obtener leyendas activas
  const activeLegends = useMemo(() => {
    return legends.filter((l) => l.visible && data?.data?.graph?.[l.key]);
  }, [legends, data]);

  // Función para mostrar/ocultar todas las etiquetas (solo funciona si el modo automático está desactivado)
  const toggleAllDataLabels = () => {
    if (autoLabelsEnabled) return; // No permitir cambios manuales en modo automático

    const allVisible = activeLegends.every((l) => dataLabelsVisibility[l.key]);

    const newVisibility: Record<string, boolean> = {};
    activeLegends.forEach((legend) => {
      newVisibility[legend.key] = !allVisible;
    });

    setDataLabelsVisibility((prev) => ({
      ...prev,
      ...newVisibility,
    }));
  };

  // Procesar datos para Chart.js
  const chartData = useMemo(() => {
    if (!data?.data?.graph) {
      return {
        labels: [],
        datasets: [],
      };
    }

    const graphData = data.data.graph;
    const timestamps = graphData.created_at?.data || [];

    const labels = timestamps.map((timestamp: string | number | null) => {
      try {
        const timestampStr = timestamp?.toString() || "";
        if (!timestampStr) {
          return new Date();
        }
        const date = parseISO(timestampStr);
        return isValid(date) ? date : new Date();
      } catch {
        return new Date();
      }
    });

    const datasets = activeLegends.map((legend) => {
      const dataPoints = graphData[legend.key].data;

      const processedData = dataPoints.map((value: any) => {
        if (value === null || value === undefined) return null;
        if (legend.type === "temperature" && typeof value === "number") {
          return convertTemperature(value);
        }
        return typeof value === "number" ? value : null;
      });

      return {
        label: legend.label,
        data: processedData,
        borderColor: legend.color,
        backgroundColor: legend.color + "20",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 6,
        fill: false,
        tension: 0.1,
        yAxisID: legend.yAxisID,
        spanGaps: true,
        datalabels: {
          display: function (context: any) {
            const isEnabled = dataLabelsVisibility[legend.key];
            if (!isEnabled) return false;

            const datasetLength = context.dataset.data.length;
            const index = context.dataIndex;

            // ✅ NUEVO: Usar la densidad calculada dinámicamente
            const density = calculateLabelDensity(datasetLength, zoomLevel);
            return index % density === 0;
          },
          align: function (context: any) {
            const yAxisID = context.dataset.yAxisID;
            if (yAxisID === "y") {
              return "top";
            } else if (yAxisID === "y1") {
              return "bottom";
            } else if (yAxisID === "y2") {
              return "left";
            } else {
              return "top";
            }
          },
          anchor: "center",
          color: legend.color,
          backgroundColor: isDark ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.9)",
          borderColor: legend.color,
          borderWidth: 1,
          borderRadius: 3,
          padding: {
            top: 1,
            bottom: 1,
            left: 3,
            right: 3,
          },
          font: {
            size: Math.max(8, Math.min(11, 8 + zoomLevel * 0.5)), // ✅ NUEVO: Tamaño dinámico según zoom
            weight: "normal" as const,
          },
          formatter: (value: any) => {
            if (value === null || value === undefined) return "";
            return formatDataLabel(value, legend);
          },
          clip: true,
          offset: function (context: any) {
            const yAxisID = context.dataset.yAxisID;
            if (yAxisID === "y") {
              return 8;
            } else if (yAxisID === "y1") {
              return -8;
            } else if (yAxisID === "y2") {
              return 0;
            }
            return 5;
          },
        },
      };
    });

    return {
      labels,
      datasets,
    };
  }, [
    data,
    activeLegends,
    temperatureUnit,
    isDark,
    dataLabelsVisibility,
    zoomLevel,
    calculateLabelDensity,
  ]);

  // Configuración de escalas dinámicas
  const scales = useMemo(() => {
    const hasTemperature = activeLegends.some((l) => l.type === "temperature");
    const hasPercentage = activeLegends.some((l) => l.type === "percentage");
    const hasGas = activeLegends.some((l) => l.type === "gas");
    const hasState = activeLegends.some((l) => l.type === "state");

    const scaleConfig: any = {
      x: {
        type: "time",
        time: {
          displayFormats: {
            minute: "HH:mm",
            hour: "HH:mm",
            day: "dd/MM",
          },
          tooltipFormat: "dd/MM/yyyy HH:mm:ss",
        },
        title: {
          display: true,
          text: "Tiempo",
          color: isDark ? "#e5e7eb" : "#374151",
        },
        grid: {
          color: isDark ? "#374151" : "#e5e7eb",
        },
        ticks: {
          color: isDark ? "#9ca3af" : "#6b7280",
        },
      },
    };

    if (hasTemperature) {
      scaleConfig.y = {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: `Temperatura (°${temperatureUnit})`,
          color: isDark ? "#e5e7eb" : "#374151",
        },
        grid: {
          color: isDark ? "#374151" : "#e5e7eb",
        },
        ticks: {
          color: isDark ? "#9ca3af" : "#6b7280",
          callback: function (value: any) {
            return `${value}°${temperatureUnit}`;
          },
        },
      };
    }

    if (hasGas) {
      scaleConfig.y1 = {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "Gases (ppm)",
          color: isDark ? "#e5e7eb" : "#374151",
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: isDark ? "#9ca3af" : "#6b7280",
          callback: function (value: any) {
            return `${value} ppm`;
          },
        },
      };
    }

    if (hasPercentage || hasState) {
      scaleConfig.y2 = {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: hasPercentage ? "Humedad (%)" : "Estados",
          color: isDark ? "#e5e7eb" : "#374151",
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: isDark ? "#9ca3af" : "#6b7280",
          callback: function (value: any) {
            if (hasPercentage) {
              return `${value}%`;
            } else {
              const stateLabels: Record<number, string> = {
                0: "Inactivo",
                1: "Activo",
                2: "Proceso",
                3: "Alarma",
              };
              return stateLabels[value] || value;
            }
          },
        },
        min: hasPercentage ? 0 : undefined,
        max: hasPercentage ? 100 : undefined,
        stepSize: hasState ? 1 : undefined,
      };
    }

    return scaleConfig;
  }, [activeLegends, temperatureUnit, isDark]);

  // Verificar si hay etiquetas activas para ajustar layout
  const activeLabelsCount = activeLegends.filter(
    (l) => dataLabelsVisibility[l.key]
  ).length;
  const hasActiveLabels = activeLabelsCount > 0;
  // Opciones del gráfico
  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index" as const,
        intersect: false,
      },
      plugins: {
        title: {
          display: true,
          text: "Monitoreo de Contenedor - Datos en Tiempo Real",
          color: isDark ? "#e5e7eb" : "#374151",
          font: {
            size: 16,
            weight: "bold" as const,
          },
        },
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: isDark ? "#1f2937" : "#ffffff",
          titleColor: isDark ? "#e5e7eb" : "#374151",
          bodyColor: isDark ? "#d1d5db" : "#6b7280",
          borderColor: isDark ? "#374151" : "#e5e7eb",
          borderWidth: 1,
          callbacks: {
            title: function (context: any) {
              const date = new Date(context[0].parsed.x);
              return format(date, "dd/MM/yyyy HH:mm:ss", { locale: es });
            },
            label: function (context: any) {
              const legend = activeLegends.find(
                (l) => l.label === context.dataset.label
              );
              let value = context.parsed.y;
              if (value === null || value === undefined)
                return `${context.dataset.label}: Sin datos`;
              return `${context.dataset.label}: ${formatDataLabel(
                value,
                legend!
              )}`;
            },
          },
        },
        zoom: {
          zoom: {
            wheel: {
              enabled: true,
            },
            pinch: {
              enabled: true,
            },
            mode: "x" as const,
            // ✅ NUEVO: Callback para manejar eventos de zoom
            onZoom: function (chart: any) {
              handleZoom(chart.chart);
            },
          },
          pan: {
            enabled: true,
            mode: "x" as const,
            // ✅ NUEVO: Callback para manejar eventos de pan
            onPan: function (chart: any) {
              handleZoom(chart.chart);
            },
          },
        },
        datalabels: {
          display: true,
          clip: true,
        },
      },
      scales,
      elements: {
        point: {
          radius: 0,
          hoverRadius: 4,
        },
      },
      layout: {
        padding: {
          top: hasActiveLabels ? 40 : 20,
          right: hasActiveLabels ? 60 : 20,
          bottom: 20,
          left: 20,
        },
      },
      // ✅ NUEVO: Callback para obtener referencia del chart
      onHover: (event: any, elements: any, chart: any) => {
        if (chartRef.current !== chart) {
          chartRef.current = chart;
        }
      },
    }),
    [
      scales,
      isDark,
      temperatureUnit,
      activeLegends,
      hasActiveLabels,
      handleZoom,
    ]
  );

  // Estados de carga y error
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Cargando datos del gráfico...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Error al cargar los datos
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data || chartData.datasets.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Sin datos para mostrar
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Selecciona un rango de fechas y presiona "Buscar" para ver los
              datos
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      {/* ✅ NUEVO: Panel de información de zoom y controles */}
      <div className="mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-blue-600 dark:text-blue-400">🔍</span>
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  Zoom: {zoomLevel.toFixed(1)}x
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {visibleDataPoints} puntos visibles
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-green-600 dark:text-green-400">🏷️</span>
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  Etiquetas: {activeLabelsCount} activas
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Densidad: 1 cada{" "}
                  {calculateLabelDensity(chartData.labels.length, zoomLevel)}{" "}
                  puntos
                </div>
              </div>
            </div>
          </div>

          {/* ✅ NUEVO: Toggle para modo automático */}
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleAutoLabels}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                autoLabelsEnabled
                  ? "bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300"
                  : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
              }`}
            >
              <span>{autoLabelsEnabled ? "🤖" : "👤"}</span>
              <span className="text-sm font-medium">
                {autoLabelsEnabled ? "Modo Automático" : "Modo Manual"}
              </span>
            </button>
          </div>
        </div>

        {/* ✅ NUEVO: Información del modo actual */}
        <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {autoLabelsEnabled ? (
              <span>
                🤖 <strong>Modo Automático:</strong> Las etiquetas se
                muestran/ocultan automáticamente según el nivel de zoom. Haz
                zoom para ver más detalles.
              </span>
            ) : (
              <span>
                👤 <strong>Modo Manual:</strong> Controla manualmente qué
                etiquetas mostrar usando los botones de abajo.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ✅ MODIFICADO: Controles manuales solo si el modo automático está desactivado */}
      {activeLegends.length > 0 && !autoLabelsEnabled && (
        <div className="mb-4 space-y-3">
          {/* Control general */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleAllDataLabels}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeLabelsCount === activeLegends.length &&
                  activeLabelsCount > 0
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                <span>
                  {activeLabelsCount === activeLegends.length &&
                  activeLabelsCount > 0
                    ? "🚫"
                    : "🏷️"}
                </span>
                <span className="text-sm font-medium">
                  {activeLabelsCount === activeLegends.length &&
                  activeLabelsCount > 0
                    ? "Ocultar todos los valores"
                    : "Mostrar todos los valores"}
                </span>
              </button>

              <div className="text-sm text-gray-600 dark:text-gray-400">
                {activeLabelsCount} de {activeLegends.length} parámetros activos
                con valores visibles
              </div>
            </div>
          </div>

          {/* Controles individuales */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Control individual de valores (modo manual):
            </div>
            <div className="flex flex-wrap gap-2">
              {activeLegends.map((legend) => (
                <button
                  key={legend.key}
                  onClick={() => toggleDataLabels(legend.key)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs transition-colors ${
                    dataLabelsVisibility[legend.key]
                      ? "bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-800 dark:text-green-300 border border-green-300 dark:border-green-700"
                      : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                  }`}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: legend.color }}
                  ></div>
                  <span>{legend.label}</span>
                  <span>{dataLabelsVisibility[legend.key] ? "🏷️" : "👁️"}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ✅ NUEVO: Mensaje informativo para modo automático */}
      {autoLabelsEnabled && (
        <div className="mb-4 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
          <div className="flex items-center space-x-2">
            <span>🔍</span>
            <span>
              <strong>Modo Automático Activo:</strong> Haz zoom en el gráfico
              para ver más etiquetas de valores. Las etiquetas aparecen
              automáticamente cuando hay menos de 100 puntos visibles.
            </span>
          </div>
        </div>
      )}

      <div className="h-96 md:h-[500px]">
        <Line
          ref={chartRef}
          id="modern-chart-canvas"
          data={chartData}
          options={options}
        />
      </div>

      {/* Información adicional */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <span>📊 {activeLegends.length} series activas</span>
            <span>📅 {chartData.labels.length} puntos de datos</span>
            <span>🔍 Zoom: {zoomLevel.toFixed(1)}x</span>
            <span>
              {activeLabelsCount > 0
                ? `🏷️ ${activeLabelsCount} parámetro${
                    activeLabelsCount !== 1 ? "s" : ""
                  } con valores`
                : "📈 Solo líneas visibles"}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs">
              💡 Usa la rueda del mouse para hacer zoom y ver más detalles
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphChart;
