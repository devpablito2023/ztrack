"use client";

import React from "react";
import { format, parseISO, isValid } from "date-fns";
import { es } from "date-fns/locale";
import type {
  LegendItem,
  ControlGraficaResponse,
} from "$/types/controlGrafica";

interface GraphInfoProps {
  data: ControlGraficaResponse | null;
  legends: LegendItem[];
  temperatureUnit: "C" | "F";
}

const GraphInfo: React.FC<GraphInfoProps> = ({
  data,
  legends,
  temperatureUnit,
}) => {
  const formatDateSafely = (dateValue: any): string => {
    try {
      if (!dateValue) return "N/A";
      if (typeof dateValue === "number") {
        const date = new Date(dateValue);
        return isValid(date)
          ? format(date, "dd/MM/yyyy HH:mm", { locale: es })
          : "N/A";
      }
      if (typeof dateValue === "string") {
        const date = parseISO(dateValue);
        return isValid(date)
          ? format(date, "dd/MM/yyyy HH:mm", { locale: es })
          : "N/A";
      }
      if (dateValue instanceof Date) {
        return isValid(dateValue)
          ? format(dateValue, "dd/MM/yyyy HH:mm", { locale: es })
          : "N/A";
      }
      return "N/A";
    } catch (error) {
      console.warn("Error formatting date:", error);
      return "N/A";
    }
  };

  const convertTemperature = (
    value: number,
    unit: "C" | "F" = temperatureUnit
  ): number => {
    if (unit === "F") {
      return (value * 9) / 5 + 32;
    }
    return value;
  };

  // ✅ Función para formatear temperatura de forma segura
  const formatTemperatureSafely = (
    tempValue: string | number | null | undefined
  ): string => {
    try {
      if (tempValue === null || tempValue === undefined) {
        return "N/A";
      }

      const tempNumber =
        typeof tempValue === "string"
          ? parseFloat(tempValue)
          : Number(tempValue);

      if (isNaN(tempNumber)) {
        return "N/A";
      }

      const finalTemp =
        temperatureUnit === "F"
          ? convertTemperature(tempNumber, "F")
          : tempNumber;

      return finalTemp.toFixed(1);
    } catch (error) {
      console.warn("Error formatting temperature:", error);
      return "N/A";
    }
  };

  if (!data) return null;

  // ✅ CORREGIR: Usar configType correcto
  const temperatureLegendsVisible = legends.filter(
    (l) => l.configType === 1 && l.visible
  ).length;

  const percentageLegendsVisible = legends.filter(
    (l) => l.configType === 2 && l.visible
  ).length;

  const gasLegendsVisible = legends.filter(
    (l) => l.configType === 3 && l.visible
  ).length;

  const stateLegendsVisible = legends.filter(
    (l) => l.configType === 4 && l.visible
  ).length;

  const tempUnit = temperatureUnit === "F" ? "°F" : "°C";
  const hasY1Data = legends.some((l) => l.yAxisID === "y1" && l.visible);
  const hasY2Data = legends.some((l) => l.yAxisID === "y2" && l.visible);

  return (
    <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-slate-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-xl">
      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              📊
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Puntos de datos
              </p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {data.data.graph.created_at.data.length.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              📅
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Rango temporal
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {formatDateSafely(data.data.date[0])}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {formatDateSafely(data.data.date[1])}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              🌡️
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Temperatura actual
              </p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {formatTemperatureSafely(data.data.temperature)}
                {tempUnit}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              📈
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Series activas
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-md text-xs font-semibold">
                  {temperatureLegendsVisible} temp
                </span>
                <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-1 rounded-md text-xs font-semibold">
                  {percentageLegendsVisible} %
                </span>
                <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-md text-xs font-semibold">
                  {gasLegendsVisible} gas
                </span>
                <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-2 py-1 rounded-md text-xs font-semibold">
                  {stateLegendsVisible} est
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Información de ejes activos */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
          📊 Configuración de Ejes Activos
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <div>
              <p className="font-semibold text-blue-800 dark:text-blue-200">
                Eje Izquierdo (Y)
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-300">
                Temperatura ({tempUnit})
              </p>
            </div>
          </div>
          {hasY1Data && (
            <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
              <div>
                <p className="font-semibold text-purple-800 dark:text-purple-200">
                  Eje Derecho (Y1)
                </p>
                <p className="text-sm text-purple-600 dark:text-purple-300">
                  Gases (ppm)
                </p>
              </div>
            </div>
          )}
          {hasY2Data && (
            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-semibold text-green-800 dark:text-green-200">
                  Eje Derecho (Y2)
                </p>
                <p className="text-sm text-green-600 dark:text-green-300">
                  Porcentajes (%) / Estados
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GraphInfo;
