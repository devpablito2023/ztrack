"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Activity,
  Thermometer,
  Droplets,
  Zap,
  Wifi,
  WifiOff,
  Target,
  Wind,
  ArrowUp,
  ArrowDown,
  Gauge,
  Snowflake,
  Flame,
  Settings,
  RotateCcw,
} from "lucide-react";
import { Container } from "$/types/container";

interface ContainerDataProps {
  container: Container;
}

type TemperatureUnit = "C" | "F";

export default function ContainerData({ container }: ContainerDataProps) {
  // ✅ NUEVO: Estado para la unidad de temperatura
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>("F");

  // ✅ NUEVO: Función para convertir temperatura
  const convertTemperature = (
    temp: number,
    fromUnit: TemperatureUnit,
    toUnit: TemperatureUnit
  ): number => {
    if (fromUnit === toUnit) return temp;

    if (fromUnit === "F" && toUnit === "C") {
      return ((temp - 32) * 5) / 9;
    } else if (fromUnit === "C" && toUnit === "F") {
      return (temp * 9) / 5 + 32;
    }

    return temp;
  };

  const formatTemp = (temp: number | null) => {
    if (temp === null) return "NA";

    // Los datos vienen en Celsius desde la API, convertir según la unidad seleccionada
    const convertedTemp = convertTemperature(temp, "C", temperatureUnit);
    return `${convertedTemp.toFixed(1)}°${temperatureUnit}`;
  };
  // ✅ NUEVO: Función para toggle de unidad de temperatura
  const toggleTemperatureUnit = () => {
    setTemperatureUnit((prev) => (prev === "C" ? "F" : "C"));
  };

  return (
    <div className="p-4 sm:p-6 h-full overflow-y-auto">
      {/* ✅ NUEVO: Header con botón de cambio de unidad */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Datos del Contenedor
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Información en tiempo real
          </p>
        </div>

        {/* ✅ NUEVO: Botón para cambiar unidad de temperatura */}
        <motion.button
          onClick={toggleTemperatureUnit}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            temperatureUnit === "C"
              ? "bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 focus:ring-blue-500"
              : "bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/30 dark:hover:bg-orange-900/50 text-orange-700 dark:text-orange-300 focus:ring-orange-500"
          }`}
          title={`Cambiar a ${
            temperatureUnit === "C" ? "Fahrenheit" : "Celsius"
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span className="text-sm">
            {temperatureUnit === "C" ? "°F" : "°C"}
          </span>
          <div className="flex items-center space-x-1">
            <span className="text-xs opacity-75">
              {temperatureUnit === "C" ? "Celsius" : "Fahrenheit"}
            </span>
          </div>
        </motion.button>
      </div>

      {/* ✅ NUEVO: Indicador de unidad actual */}
      <div className="mb-4 p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg">
        <div className="flex items-center justify-center space-x-2">
          <Thermometer
            className={`w-4 h-4 ${
              temperatureUnit === "C" ? "text-blue-500" : "text-orange-500"
            }`}
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Temperaturas mostradas en:
            <span
              className={`ml-1 font-bold ${
                temperatureUnit === "C"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-orange-600 dark:text-orange-400"
              }`}
            >
              {temperatureUnit === "C" ? "Celsius (°C)" : "Fahrenheit (°F)"}
            </span>
          </span>
        </div>
      </div>

      {/* Primary Data Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Return Air */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <ArrowDown className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Return Air
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatTemp(container?.return_air)}
          </p>
        </div>

        {/* Supply Air */}
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <ArrowUp className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Supply Air
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatTemp(container?.temp_supply_1)}
          </p>
        </div>

        {/* Set Point */}
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Set Point
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatTemp(container?.set_point)}
          </p>
        </div>

        {/* Capacity Load */}
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Gauge className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Capacity Load
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {container?.capacity_load}%
          </p>
        </div>

        {/* Set Humidity */}
        <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Droplets className="w-5 h-5 text-cyan-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Set Humidity
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {container?.humidity_set_point}%
          </p>
        </div>

        {/* Current Humidity */}
        <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Droplets className="w-5 h-5 text-teal-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Humidity
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {container?.relative_humidity || "NA"}%
          </p>
        </div>

        {/* Power Status */}
        <div
          className={`rounded-xl p-4 ${
            container?.power_state === 1
              ? "bg-green-50 dark:bg-green-900/20"
              : "bg-red-50 dark:bg-red-900/20"
          }`}
        >
          <div className="flex items-center space-x-2 mb-2">
            <Zap
              className={`w-5 h-5 ${
                container?.power_state === 1 ? "text-green-500" : "text-red-500"
              }`}
            />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Power Status
            </span>
          </div>
          <p
            className={`text-2xl font-bold ${
              container?.power_state === 1
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {container?.power_state === 1 ? "ON" : "OFF"}
          </p>
        </div>

        {/* Connection Status */}
        <div
          className={`rounded-xl p-4 ${
            container?.power_state === 1
              ? "bg-green-50 dark:bg-green-900/20"
              : "bg-red-50 dark:bg-red-900/20"
          }`}
        >
          <div className="flex items-center space-x-2 mb-2">
            {container?.power_state === 1 ? (
              <Wifi className="w-5 h-5 text-green-500" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-500" />
            )}
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Connection
            </span>
          </div>
          <p
            className={`text-2xl font-bold ${
              container?.power_state === 1
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {container?.power_state === 1 ? "ONLINE" : "OFFLINE"}
          </p>
        </div>
      </div>

      {/* Expandable Sections */}
      <div className="space-y-4">
        {/* USDA Temperatures */}
        <details className="group">
          <summary className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <div className="flex items-center space-x-3">
              <Thermometer className="w-5 h-5 text-red-500" />
              <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Temperaturas USDA
              </span>
              {/* ✅ NUEVO: Indicador de unidad en la sección */}
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  temperatureUnit === "C"
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                    : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                }`}
              >
                °{temperatureUnit}
              </span>
            </div>
            <svg
              className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </summary>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 grid grid-cols-2 gap-4"
          >
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Thermometer className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  USDA 1
                </span>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {formatTemp(container?.cargo_1_temp)}
              </p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Thermometer className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  USDA 2
                </span>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {formatTemp(container?.cargo_2_temp)}
              </p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Thermometer className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  USDA 3
                </span>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {formatTemp(container?.cargo_3_temp)}
              </p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Thermometer className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  USDA 4
                </span>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {formatTemp(container?.cargo_4_temp)}
              </p>
            </div>
          </motion.div>
        </details>

        {/* System Temperatures */}
        <details className="group">
          <summary className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <div className="flex items-center space-x-3">
              <Settings className="w-5 h-5 text-gray-500" />
              <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Temperaturas del Sistema
              </span>
              {/* ✅ NUEVO: Indicador de unidad en la sección */}
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  temperatureUnit === "C"
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                    : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                }`}
              >
                °{temperatureUnit}
              </span>
            </div>
            <svg
              className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </summary>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 grid grid-cols-1 gap-4"
          >
            <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Snowflake className="w-4 h-4 text-cyan-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Evaporator
                </span>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {formatTemp(container?.evaporation_coil)}
              </p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Compressor
                </span>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {formatTemp(container?.compress_coil_1)}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Wind className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Ambient Air
                </span>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {formatTemp(container?.ambient_air)}
              </p>
            </div>
          </motion.div>
        </details>

        {/* Alarm Status */}
        {container?.alarm_present === 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4"
          >
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-red-500 animate-pulse" />
              <div>
                <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">
                  Alarma Activa
                </h3>
                <p className="text-sm text-red-600 dark:text-red-300">
                  Este contenedor tiene una alarma presente. Revise el sistema
                  inmediatamente.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Process Status */}
        {container?.stateProcess !== "0" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Activity className="w-6 h-6 text-blue-500" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400">
                    Proceso Activo
                  </h3>
                  <p className="text-sm text-blue-600 dark:text-blue-300">
                    Estado: {container?.stateProcess}
                  </p>
                </div>
              </div>
              {container?.timerOfProcess && (
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                    {container.timerOfProcess}h
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-300">
                    Tiempo de proceso
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ✅ NUEVO: Información adicional sobre conversión de temperatura */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-2">
            <Thermometer className="w-4 h-4" />
            <span>Información de Temperatura</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-400">
            <div className="space-y-1">
              <p className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>
                  Unidad actual:{" "}
                  <strong>
                    {temperatureUnit === "C"
                      ? "Celsius (°C)"
                      : "Fahrenheit (°F)"}
                  </strong>
                </span>
              </p>
              <p className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Conversión automática desde datos originales</span>
              </p>
            </div>
            <div className="space-y-1">
              <p className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                <span>Haz clic en el botón superior para cambiar unidad</span>
              </p>
              <p className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                <span>
                  Todas las temperaturas se actualizan automáticamente
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
