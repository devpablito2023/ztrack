"use client";

import { useState, useCallback } from "react";
import { Calendar, Search, RotateCcw, Clock, Globe } from "lucide-react";

interface TableControlsProps {
  onSearch: (fechaI: string, fechaF: string, ultima: string) => void;
  loading: boolean;
  onClear: () => void;
}

const TableControls: React.FC<TableControlsProps> = ({
  onSearch,
  loading,
  onClear,
}) => {
  const [fechaInicial, setFechaInicial] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");

  // ✅ CORREGIDO: Calcular UTC dinámico (igual que en el hook)
  const calculateDynamicUTC = (): number => {
    const now = new Date();
    const userTimezoneOffset = now.getTimezoneOffset();
    const userGMT = -userTimezoneOffset / 60;
    const dynamicUTC = 300 - (5 + userGMT) * 60;
    return dynamicUTC;
  };

  // ✅ CORREGIDO: Obtener información de zona horaria del usuario
  const getUserTimezoneInfo = () => {
    const now = new Date();
    const userTimezoneOffset = now.getTimezoneOffset();
    const userGMT = -userTimezoneOffset / 60;
    const dynamicUTC = calculateDynamicUTC();

    return {
      userGMT,
      userTimezoneOffset,
      dynamicUTC,
      timezoneName: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  };

  // ✅ CORREGIDO: Obtener fecha/hora local real del usuario
  const getLocalDateTime = (): string => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  // ✅ CORREGIDO: Formatear fecha para la API
  const formatLocalDateTime = (dateTimeLocal: string): string => {
    if (!dateTimeLocal) return "";
    return dateTimeLocal.includes("T")
      ? dateTimeLocal.length === 16
        ? `${dateTimeLocal}:00`
        : dateTimeLocal
      : `${dateTimeLocal}T00:00:00`;
  };

  // ✅ CORREGIDO: Obtener fecha/hora por defecto para inputs (formato datetime-local)
  const getDefaultDateTime = (isStart: boolean = false): string => {
    const now = new Date();

    if (isStart) {
      now.setHours(0, 0, 0, 0);
    }

    // Para inputs datetime-local necesitamos formato YYYY-MM-DDTHH:MM
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // ✅ CORREGIDO: Manejar búsqueda
  const handleSearch = useCallback(() => {
    if (!fechaInicial || !fechaFinal) {
      alert("⚠️ Por favor selecciona ambas fechas");
      return;
    }

    if (new Date(fechaInicial) >= new Date(fechaFinal)) {
      alert("⚠️ La fecha inicial debe ser menor que la fecha final");
      return;
    }

    const fechaI = formatLocalDateTime(fechaInicial);
    const fechaF = formatLocalDateTime(fechaFinal);
    const ultima = getLocalDateTime();
    const dynamicUTC = calculateDynamicUTC();

    console.log("🔍 Enviando filtro tabla con UTC dinámico:", {
      fechaI,
      fechaF,
      ultima,
      device: "15681",
      utc: dynamicUTC,
      userTimezone: getUserTimezoneInfo(),
    });

    onSearch(fechaI, fechaF, ultima);
  }, [fechaInicial, fechaFinal, onSearch]);

  // ✅ CORREGIDO: Filtros rápidos
  const handleQuickFilter = useCallback(
    (hours: number) => {
      const now = new Date();
      const past = new Date(now.getTime() - hours * 60 * 60 * 1000);

      // Para inputs datetime-local (formato YYYY-MM-DDTHH:MM)
      const fechaI = `${past.getFullYear()}-${String(
        past.getMonth() + 1
      ).padStart(2, "0")}-${String(past.getDate()).padStart(2, "0")}T${String(
        past.getHours()
      ).padStart(2, "0")}:${String(past.getMinutes()).padStart(2, "0")}`;

      const fechaF = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}T${String(
        now.getHours()
      ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

      setFechaInicial(fechaI);
      setFechaFinal(fechaF);

      // Para la API (formato YYYY-MM-DDTHH:MM:SS)
      const fechaIFormatted = formatLocalDateTime(fechaI);
      const fechaFFormatted = formatLocalDateTime(fechaF);
      const ultima = getLocalDateTime();

      console.log("⚡ Filtro rápido aplicado:", {
        hours,
        fechaI: fechaIFormatted,
        fechaF: fechaFFormatted,
        ultima,
        userTime: now.toLocaleString(),
      });

      onSearch(fechaIFormatted, fechaFFormatted, ultima);
    },
    [onSearch]
  );

  const handleClear = useCallback(() => {
    setFechaInicial("");
    setFechaFinal("");
    onClear();
  }, [onClear]);

  // ✅ Obtener info de timezone para mostrar
  const timezoneInfo = getUserTimezoneInfo();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
        <Calendar className="w-5 h-5" />
        <span>Filtros de Fecha y Hora</span>
      </h2>

      {/* Filtros rápidos */}
      <div className="mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Filtros rápidos:
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Última hora", hours: 1 },
            { label: "Últimas 6h", hours: 6 },
            { label: "Últimas 12h", hours: 12 },
            { label: "Último día", hours: 24 },
            { label: "Últimos 3 días", hours: 72 },
            { label: "Última semana", hours: 168 },
          ].map(({ label, hours }) => (
            <button
              key={hours}
              onClick={() => handleQuickFilter(hours)}
              disabled={loading}
              className="px-3 py-1.5 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Filtros personalizados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Clock className="w-4 h-4 inline mr-1" />
            Fecha y Hora Inicial
          </label>
          <input
            type="datetime-local"
            placeholder="YYYY-MM-DDTHH:MM"
            value={fechaInicial}
            onChange={(e) => setFechaInicial(e.target.value)}
            max={getDefaultDateTime()}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Clock className="w-4 h-4 inline mr-1" />
            Fecha y Hora Final
          </label>
          <input
            type="datetime-local"
            placeholder="YYYY-MM-DDTHH:MM"
            value={fechaFinal}
            onChange={(e) => setFechaFinal(e.target.value)}
            min={fechaInicial}
            max={getDefaultDateTime()}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            disabled={loading}
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={handleSearch}
            disabled={loading || !fechaInicial || !fechaFinal}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? "Buscando..." : "Buscar"}</span>
          </button>
        </div>

        <div className="flex items-end">
          <button
            onClick={handleClear}
            disabled={loading}
            className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Limpiar</span>
          </button>
        </div>
      </div>

      {/* ✅ NUEVO: Información de zona horaria dinámica */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          <Globe className="w-4 h-4 inline mr-1" />
          <strong>Tu zona horaria:</strong> GMT
          {timezoneInfo.userGMT >= 0 ? "+" : ""}
          {timezoneInfo.userGMT} ({timezoneInfo.timezoneName})
        </p>
        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
          Hora actual: {new Date().toLocaleString()} | UTC calculado:{" "}
          {timezoneInfo.dynamicUTC}
        </p>
      </div>
    </div>
  );
};

export default TableControls;
