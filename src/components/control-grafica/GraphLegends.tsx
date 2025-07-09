"use client";

import React from "react";
import type { GraphLegendsProps } from "$/types/controlGrafica";

const GraphLegends: React.FC<GraphLegendsProps> = ({
  legends,
  temperatureUnit,
  onToggleLegend,
  onToggleTemperatureUnit,
  onShowOnly,
  onShowAll,
  onHideAll,
}) => {
  // ✅ Usar configType correcto según ControlGraficaMain
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

  return (
    <div className="mb-8 space-y-6">
      {/* Temperatura (configType: 1) */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-blue-700 dark:text-blue-300 flex items-center gap-2">
            🌡️ Temperatura - {tempUnit}
            <span className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-semibold">
              {temperatureLegendsVisible} activas
            </span>
          </h3>
          <button
            onClick={onToggleTemperatureUnit}
            className="px-3 py-1 text-sm font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all duration-200"
            title={`Cambiar a ${
              temperatureUnit === "C" ? "Fahrenheit" : "Celsius"
            }`}
          >
            °{temperatureUnit === "C" ? "F" : "C"}
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-9 gap-3">
          {legends
            .filter((l) => l.configType === 1)
            .map((legend) => (
              <button
                key={legend.key}
                onClick={() => onToggleLegend(legend.key)}
                title={`${legend.visible ? "Ocultar" : "Mostrar"} serie ${
                  legend.label
                }`}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transform hover:scale-105 ${
                  legend.visible
                    ? "bg-white dark:bg-gray-800 border-2 border-blue-300 dark:border-blue-600 shadow-md"
                    : "bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 opacity-60"
                }`}
              >
                <div
                  className="w-4 h-4 rounded-full shadow-sm"
                  style={{ backgroundColor: legend.color }}
                />
                <span className="truncate text-gray-700 dark:text-gray-300">
                  {legend.label.length > 8
                    ? legend.label.substring(0, 8) + "..."
                    : legend.label}
                </span>
              </button>
            ))}
        </div>
      </div>

      {/* Porcentajes/Humedad (configType: 2) */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
        <h3 className="text-lg font-bold text-green-700 dark:text-green-300 mb-3 flex items-center gap-2">
          💧 Humedad y Porcentajes
          <span className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-semibold">
            {percentageLegendsVisible} activas
          </span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {legends
            .filter((l) => l.configType === 2)
            .map((legend) => (
              <button
                key={legend.key}
                onClick={() => onToggleLegend(legend.key)}
                title={`${legend.visible ? "Ocultar" : "Mostrar"} serie ${
                  legend.label
                }`}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 transform hover:scale-105 ${
                  legend.visible
                    ? "bg-white dark:bg-gray-800 border-2 border-green-300 dark:border-green-600 shadow-md"
                    : "bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 opacity-60"
                }`}
              >
                <div
                  className="w-4 h-4 rounded-full shadow-sm"
                  style={{ backgroundColor: legend.color }}
                />
                <span className="truncate text-gray-700 dark:text-gray-300">
                  {legend.label}
                </span>
              </button>
            ))}
        </div>
      </div>

      {/* Gases (configType: 3) */}
      <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
        <h3 className="text-lg font-bold text-purple-700 dark:text-purple-300 mb-3 flex items-center gap-2">
          💨 Gases - ppm
          <span className="bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-semibold">
            {gasLegendsVisible} activas
          </span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {legends
            .filter((l) => l.configType === 3)
            .map((legend) => (
              <button
                key={legend.key}
                onClick={() => onToggleLegend(legend.key)}
                title={`${legend.visible ? "Ocultar" : "Mostrar"} serie ${
                  legend.label
                }`}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transform hover:scale-105 ${
                  legend.visible
                    ? "bg-white dark:bg-gray-800 border-2 border-purple-300 dark:border-purple-600 shadow-md"
                    : "bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 opacity-60"
                }`}
              >
                <div
                  className="w-4 h-4 rounded-full shadow-sm"
                  style={{ backgroundColor: legend.color }}
                />
                <span className="truncate text-gray-700 dark:text-gray-300">
                  {legend.label}
                </span>
              </button>
            ))}
        </div>
      </div>

      {/* Estados (configType: 4) */}
      <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800">
        <h3 className="text-lg font-bold text-red-700 dark:text-red-300 mb-3 flex items-center gap-2">
          📊 Estados
          <span className="bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 px-3 py-1 rounded-full text-sm font-semibold">
            {stateLegendsVisible} activas
          </span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {legends
            .filter((l) => l.configType === 4)
            .map((legend) => (
              <button
                key={legend.key}
                onClick={() => onToggleLegend(legend.key)}
                title={`${legend.visible ? "Ocultar" : "Mostrar"} serie ${
                  legend.label
                }`}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 transform hover:scale-105 ${
                  legend.visible
                    ? "bg-white dark:bg-gray-800 border-2 border-red-300 dark:border-red-600 shadow-md"
                    : "bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 opacity-60"
                }`}
              >
                <div
                  className="w-4 h-4 rounded-full shadow-sm"
                  style={{ backgroundColor: legend.color }}
                />
                <span className="truncate text-gray-700 dark:text-gray-300">
                  {legend.label}
                </span>
              </button>
            ))}
        </div>
      </div>

      {/* Controles rápidos */}
      <div className="flex flex-wrap gap-3 justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        {onShowOnly && (
          <>
            <button
              onClick={() => onShowOnly(1)}
              className="px-4 py-2 text-sm font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transform hover:scale-105"
              title="Mostrar solo series de temperatura"
            >
              🌡️ Solo Temperatura
            </button>
            <button
              onClick={() => onShowOnly(2)}
              className="px-4 py-2 text-sm font-semibold bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 transform hover:scale-105"
              title="Mostrar solo series de humedad"
            >
              💧 Solo Humedad
            </button>
            <button
              onClick={() => onShowOnly(3)}
              className="px-4 py-2 text-sm font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transform hover:scale-105"
              title="Mostrar solo series de gases"
            >
              💨 Solo Gases
            </button>
            <button
              onClick={() => onShowOnly(4)}
              className="px-4 py-2 text-sm font-semibold bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 transform hover:scale-105"
              title="Mostrar solo series de estados"
            >
              📊 Solo Estados
            </button>
          </>
        )}
        {onShowAll && (
          <button
            onClick={onShowAll}
            className="px-4 py-2 text-sm font-semibold bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 transform hover:scale-105"
            title="Mostrar todas las series"
          >
            ✅ Mostrar Todas
          </button>
        )}
        {onHideAll && (
          <button
            onClick={onHideAll}
            className="px-4 py-2 text-sm font-semibold bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transform hover:scale-105"
            title="Ocultar todas las series"
          >
            ❌ Ocultar Todas
          </button>
        )}
      </div>
    </div>
  );
};

export default GraphLegends;
