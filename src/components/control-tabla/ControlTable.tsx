"use client";

import React, { useMemo, useState } from "react";
import { format, parseISO, isValid } from "date-fns";
import { es } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Settings,
  Eye,
  EyeOff,
} from "lucide-react";
import { useTheme } from "$/contexts/ThemeContext";
import ExportActions from "./ExportActions";
import type {
  ControlTableResponse,
  TableRecord,
  TemperatureUnit,
  TableColumn,
} from "$/types/controlTable";

interface ControlTableProps {
  data: ControlTableResponse | null;
  loading: boolean;
  error: string | null;
  temperatureUnit: TemperatureUnit;
  onToggleTemperatureUnit: () => void;
}

const ControlTable: React.FC<ControlTableProps> = ({
  data,
  loading,
  error,
  temperatureUnit,
  onToggleTemperatureUnit,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // ✅ Estado para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ✅ NUEVO: Estado para controlar visibilidad de columnas
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >({
    created_at: true,
    temp_supply_1: true,
    return_air: true,
    ambient_air: true,
    evaporation_coil: false,
    compress_coil_1: false,
    set_point: true,
    cargo_1_temp: false,
    cargo_2_temp: false,
    cargo_3_temp: false,
    cargo_4_temp: false,
    relative_humidity: true,
    humidity_set_point: false,
    consumption_ph_1: false,
    consumption_ph_2: false,
    consumption_ph_3: false,
    co2_reading: false,
    power_kwh: false,
    power_state: true,
    sp_ethyleno: false,
    stateProcess: false,
    ethylene: false,
    longitud: false,
    latitud: false,
    ripener_prueba: false,
    defrost_prueba: false,
  });

  // ✅ NUEVO: Estado para mostrar/ocultar el panel de columnas
  const [showColumnPanel, setShowColumnPanel] = useState(false);

  // ✅ Configuración completa de columnas usando el tipo definido
  const columns: TableColumn[] = [
    {
      key: "created_at",
      label: "Fecha/Hora",
      type: "datetime",
      visible: columnVisibility.created_at,
      sortable: true,
      filterable: true,
    },
    {
      key: "temp_supply_1",
      label: "Temp. Suministro",
      type: "temperature",
      unit: `°${temperatureUnit}`,
      visible: columnVisibility.temp_supply_1,
      sortable: true,
      filterable: true,
    },
    {
      key: "return_air",
      label: "Temp. Retorno",
      type: "temperature",
      unit: `°${temperatureUnit}`,
      visible: columnVisibility.return_air,
      sortable: true,
      filterable: true,
    },
    {
      key: "ambient_air",
      label: "Temp. Ambiente",
      type: "temperature",
      unit: `°${temperatureUnit}`,
      visible: columnVisibility.ambient_air,
      sortable: true,
      filterable: true,
    },
    {
      key: "evaporation_coil",
      label: "Temp. Evaporador",
      type: "temperature",
      unit: `°${temperatureUnit}`,
      visible: columnVisibility.evaporation_coil,
      sortable: true,
      filterable: true,
    },
    {
      key: "compress_coil_1",
      label: "Compresor",
      type: "temperature",
      unit: `°${temperatureUnit}`,
      visible: columnVisibility.compress_coil_1,
      sortable: true,
      filterable: true,
    },
    {
      key: "set_point",
      label: "Set Point",
      type: "temperature",
      unit: `°${temperatureUnit}`,
      visible: columnVisibility.set_point,
      sortable: true,
      filterable: true,
    },
    {
      key: "cargo_1_temp",
      label: "Cargo 1",
      type: "temperature",
      unit: `°${temperatureUnit}`,
      visible: columnVisibility.cargo_1_temp,
      sortable: true,
      filterable: true,
    },
    {
      key: "cargo_2_temp",
      label: "Cargo 2",
      type: "temperature",
      unit: `°${temperatureUnit}`,
      visible: columnVisibility.cargo_2_temp,
      sortable: true,
      filterable: true,
    },
    {
      key: "cargo_3_temp",
      label: "Cargo 3",
      type: "temperature",
      unit: `°${temperatureUnit}`,
      visible: columnVisibility.cargo_3_temp,
      sortable: true,
      filterable: true,
    },
    {
      key: "cargo_4_temp",
      label: "Cargo 4",
      type: "temperature",
      unit: `°${temperatureUnit}`,
      visible: columnVisibility.cargo_4_temp,
      sortable: true,
      filterable: true,
    },
    {
      key: "relative_humidity",
      label: "Humedad",
      type: "percentage",
      unit: "%",
      visible: columnVisibility.relative_humidity,
      sortable: true,
      filterable: true,
    },
    {
      key: "humidity_set_point",
      label: "SP Humedad",
      type: "percentage",
      unit: "%",
      visible: columnVisibility.humidity_set_point,
      sortable: true,
      filterable: true,
    },
    {
      key: "consumption_ph_1",
      label: "Consumo F1",
      type: "power",
      unit: "A",
      visible: columnVisibility.consumption_ph_1,
      sortable: true,
      filterable: true,
    },
    {
      key: "consumption_ph_2",
      label: "Consumo F2",
      type: "power",
      unit: "A",
      visible: columnVisibility.consumption_ph_2,
      sortable: true,
      filterable: true,
    },
    {
      key: "consumption_ph_3",
      label: "Consumo F3",
      type: "power",
      unit: "A",
      visible: columnVisibility.consumption_ph_3,
      sortable: true,
      filterable: true,
    },
    {
      key: "co2_reading",
      label: "CO₂",
      type: "gas",
      unit: "ppm",
      visible: columnVisibility.co2_reading,
      sortable: true,
      filterable: true,
    },
    {
      key: "power_kwh",
      label: "Consumo",
      type: "power",
      unit: "kWh",
      visible: columnVisibility.power_kwh,
      sortable: true,
      filterable: true,
    },
    {
      key: "power_state",
      label: "Estado",
      type: "state",
      visible: columnVisibility.power_state,
      sortable: true,
      filterable: true,
    },
    {
      key: "sp_ethyleno",
      label: "SP Etileno",
      type: "gas",
      unit: "ppm",
      visible: columnVisibility.sp_ethyleno,
      sortable: true,
      filterable: true,
    },
    {
      key: "stateProcess",
      label: "Estado Proceso",
      type: "state",
      visible: columnVisibility.stateProcess,
      sortable: true,
      filterable: true,
    },
    {
      key: "ethylene",
      label: "Etileno",
      type: "gas",
      unit: "ppm",
      visible: columnVisibility.ethylene,
      sortable: true,
      filterable: true,
    },
    {
      key: "longitud",
      label: "Longitud",
      type: "coordinate",
      visible: columnVisibility.longitud,
      sortable: true,
      filterable: true,
    },
    {
      key: "latitud",
      label: "Latitud",
      type: "coordinate",
      visible: columnVisibility.latitud,
      sortable: true,
      filterable: true,
    },
    {
      key: "ripener_prueba",
      label: "Ripener Prueba",
      type: "number",
      visible: columnVisibility.ripener_prueba,
      sortable: true,
      filterable: true,
    },
    {
      key: "defrost_prueba",
      label: "Defrost Prueba",
      type: "number",
      visible: columnVisibility.defrost_prueba,
      sortable: true,
      filterable: true,
    },
  ];

  // ✅ NUEVO: Función para toggle de columnas
  const toggleColumn = (columnKey: string) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnKey]: !prev[columnKey],
    }));
  };

  // ✅ NUEVO: Función para mostrar/ocultar todas las columnas
  const toggleAllColumns = (show: boolean) => {
    const newVisibility: Record<string, boolean> = {};
    columns.forEach((col) => {
      newVisibility[col.key as string] = show;
    });
    setColumnVisibility(newVisibility);
  };

  // ✅ Convertir temperatura
  const convertTemperature = (temp: number): number => {
    if (temperatureUnit === "F") {
      return (temp * 9) / 5 + 32;
    }
    return temp;
  };

  // ✅ Usar directamente data.data.table ya que viene como array
  const tableData = useMemo(() => {
    if (!data?.data?.table || !Array.isArray(data.data.table)) {
      console.log("❌ No hay datos de tabla o no es un array");
      return [];
    }
    console.log(
      "✅ Datos de tabla recibidos:",
      data.data.table.length,
      "registros"
    );
    return data.data.table;
  }, [data]);

  // ✅ Función para formatear valores
  const formatValue = (value: any, column: TableColumn): string => {
    if (value === null || value === undefined || value === "") {
      return "N/A";
    }

    switch (column.type) {
      case "datetime":
        try {
          const date = parseISO(value.toString());
          return isValid(date)
            ? format(date, "dd/MM/yyyy HH:mm:ss", { locale: es })
            : "Fecha inválida";
        } catch {
          return "Fecha inválida";
        }

      case "temperature":
        const tempValue = typeof value === "string" ? parseFloat(value) : value;
        if (typeof tempValue === "number" && !isNaN(tempValue)) {
          const convertedTemp = convertTemperature(tempValue);
          return `${convertedTemp.toFixed(1)}${column.unit}`;
        }
        return "N/A";

      case "percentage":
        const percentValue =
          typeof value === "string" ? parseFloat(value) : value;
        if (typeof percentValue === "number" && !isNaN(percentValue)) {
          return `${percentValue.toFixed(1)}${column.unit}`;
        }
        return "N/A";

      case "power":
        const powerValue =
          typeof value === "string" ? parseFloat(value) : value;
        if (typeof powerValue === "number" && !isNaN(powerValue)) {
          return `${powerValue.toFixed(2)} ${column.unit}`;
        }
        return "N/A";

      case "gas":
        const gasValue = typeof value === "string" ? parseFloat(value) : value;
        if (typeof gasValue === "number" && !isNaN(gasValue)) {
          return `${gasValue.toFixed(3)} ${column.unit}`;
        }
        return "N/A";

      case "state":
        if (column.key === "power_state") {
          const stateValue =
            typeof value === "string" ? parseInt(value) : value;
          const stateLabels: Record<number, string> = {
            0: "Apagado",
            1: "Encendido",
          };
          return stateLabels[stateValue] || value.toString();
        }
        return value.toString();

      case "coordinate":
        const coordValue =
          typeof value === "string" ? parseFloat(value) : value;
        if (typeof coordValue === "number" && !isNaN(coordValue)) {
          return coordValue.toFixed(6);
        }
        return "N/A";

      case "number":
        const numValue = typeof value === "string" ? parseFloat(value) : value;
        if (typeof numValue === "number" && !isNaN(numValue)) {
          return numValue.toFixed(2);
        }
        return "N/A";

      default:
        return value.toString();
    }
  };

  // ✅ Filtrar columnas visibles
  const visibleColumns = columns.filter((col) => col.visible);

  // ✅ Lógica de paginación
  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = tableData.slice(startIndex, endIndex);

  // ✅ Funciones de navegación
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToNextPage = () => goToPage(currentPage + 1);
  const goToPreviousPage = () => goToPage(currentPage - 1);
  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);

  // Estados de carga y error
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Cargando datos de la tabla...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
        <div className="flex items-center justify-center h-64">
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

  if (!data || tableData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              📋 Datos Tabulares
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Visualización detallada de los registros históricos
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {/* ✅ NUEVO: Toggle de temperatura */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Temperatura:
              </span>
              <button
                onClick={onToggleTemperatureUnit}
                className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  temperatureUnit === "C" ? "bg-blue-600" : "bg-orange-600"
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    temperatureUnit === "C" ? "translate-x-1" : "translate-x-9"
                  }`}
                />
                <span className="absolute left-1.5 text-xs font-medium text-white">
                  °C
                </span>
                <span className="absolute right-1.5 text-xs font-medium text-white">
                  °F
                </span>
              </button>
            </div>

            {/* ✅ NUEVO: Botón para mostrar panel de columnas */}
            <div className="relative">
              <button
                onClick={() => setShowColumnPanel(!showColumnPanel)}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                title="Configurar columnas"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm">Columnas</span>
                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full">
                  {visibleColumns.length}
                </span>
              </button>

              {/* ✅ NUEVO: Panel de configuración de columnas */}
              {showColumnPanel && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Configurar Columnas
                      </h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleAllColumns(true)}
                          className="text-xs px-2 py-1 bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 text-green-800 dark:text-green-200 rounded"
                        >
                          Todas
                        </button>
                        <button
                          onClick={() => toggleAllColumns(false)}
                          className="text-xs px-2 py-1 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-800 dark:text-red-200 rounded"
                        >
                          Ninguna
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {columns.map((column) => (
                        <div
                          key={column.key as string}
                          className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
                        >
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => toggleColumn(column.key as string)}
                              className={`p-1 rounded ${
                                column.visible
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-gray-400 dark:text-gray-600"
                              }`}
                            >
                              {column.visible ? (
                                <Eye className="w-4 h-4" />
                              ) : (
                                <EyeOff className="w-4 h-4" />
                              )}
                            </button>
                            <span className="text-sm text-gray-900 dark:text-white">
                              {column.label}
                            </span>
                            {column.unit && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                ({column.unit})
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-1">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                column.type === "temperature"
                                  ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                                  : column.type === "percentage"
                                  ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                                  : column.type === "gas"
                                  ? "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200"
                                  : column.type === "power"
                                  ? "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200"
                                  : column.type === "state"
                                  ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                                  : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                              }`}
                            >
                              {column.type}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        <p>
                          <strong>{visibleColumns.length}</strong> de{" "}
                          <strong>{columns.length}</strong> columnas visibles
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ✅ Acciones de exportación */}
            <ExportActions
              data={data}
              filteredData={tableData}
              temperatureUnit={temperatureUnit}
              visibleColumns={visibleColumns.map((col) => col.key as string)}
              loading={loading}
            />

            <div className="text-sm text-gray-500 dark:text-gray-400">
              <span>📊 {tableData.length} registros</span>
              <span className="mx-2">•</span>
              <span>📅 {visibleColumns.length} columnas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {visibleColumns.map((column) => (
                <th
                  key={column.key as string}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  {column.label}
                  {column.unit && (
                    <span className="ml-1 text-gray-400">({column.unit})</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {currentData.map((row, index) => (
              <tr
                key={`${row.created_at}-${index}`}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {visibleColumns.map((column) => (
                  <td
                    key={column.key as string}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                  >
                    {formatValue(row[column.key], column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <span>
                Mostrando {startIndex + 1} -{" "}
                {Math.min(endIndex, tableData.length)} de {tableData.length}{" "}
                registros
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={goToFirstPage}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Primera página"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Página anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Página
                </span>
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => {
                    const page = parseInt(e.target.value);
                    if (!isNaN(page)) {
                      goToPage(page);
                    }
                  }}
                  className="w-16 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  de {totalPages}
                </span>
              </div>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Página siguiente"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={goToLastPage}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Última página"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer con información adicional */}
      <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <span>
              🌡️ Temperatura en{" "}
              {temperatureUnit === "C" ? "Celsius" : "Fahrenheit"}
            </span>
            <span>📊 {itemsPerPage} registros por página</span>
            <span>👁️ {visibleColumns.length} columnas visibles</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs">
              💡 Usa las flechas para navegar entre páginas
            </span>
          </div>
        </div>
      </div>

      {/* ✅ NUEVO: Overlay para cerrar el panel de columnas */}
      {showColumnPanel && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowColumnPanel(false)}
        />
      )}
    </div>
  );
};

export default ControlTable;
