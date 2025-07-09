"use client";

import { Fragment, useEffect } from "react";
import {
  X,
  Calendar,
  Clock,
  Thermometer,
  Droplets,
  User,
  Activity,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface EtapaControl {
  nombre_etapa: string;
  hora_inicio_etapa: string;
  temperatura_etapa: number;
  humedad_etapa: number | null;
}

interface ControlDetalleData {
  id_control_temperatura: number;
  imei_control_temperatura: string;
  proceso_control_temperatura: string;
  tipo_control_temperatura: number;
  total_control_temperatura: number;
  lista_control_temperatura: EtapaControl[];
  hora_fin_control_temperatura: string;
  hora_proceso_control_temperatura: number;
  condicion_control_temperatura: number;
  estado_control_temperatura: number;
  updated_at: string;
  created_at: string;
  user_c_nombre: string;
  user_m_nombre: string;
  user_c: number;
  user_m: number;
}

interface VerControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ControlDetalleData | null;
  loading: boolean;
}

export default function VerControlModal({
  isOpen,
  onClose,
  data,
  loading,
}: VerControlModalProps) {
  // ✅ Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Funciones helper
  const getTipoTexto = (tipo: number) => {
    const tipos = { 0: "Único", 1: "Cíclico", 2: "Periódico" };
    return tipos[tipo as keyof typeof tipos] || "Desconocido";
  };

  const getTipoColor = (tipo: number) => {
    const colores = {
      0: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      1: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      2: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
    };
    return (
      colores[tipo as keyof typeof colores] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    );
  };

  const getEstadoTexto = (condicion: number) => {
    const estados = { 1: "En Proceso", 2: "Completado" };
    return estados[condicion as keyof typeof estados] || "Desconocido";
  };

  const getEstadoColor = (condicion: number) => {
    const colores = {
      1: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      2: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    };
    return (
      colores[condicion as keyof typeof colores] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    );
  };

  const getActivoTexto = (estado: number) => {
    return estado === 1 ? "Activo" : "Inactivo";
  };

  const getActivoColor = (estado: number) => {
    return estado === 1
      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
  };

  const formatearFecha = (fechaString: string) => {
    try {
      if (fechaString.includes("_")) {
        const [fecha, hora] = fechaString.split("_");
        const [dia, mes, año] = fecha.split("-");
        const [horas, minutos] = hora.split("-");
        return `${dia}/${mes}/${año} ${horas}:${minutos}`;
      } else {
        const fecha = new Date(fechaString);
        return fecha.toLocaleString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      }
    } catch (error) {
      return fechaString;
    }
  };

  const formatearTemperatura = (temp: number) => {
    return temp > 0 ? `+${temp}°C` : `${temp}°C`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* ✅ Modal responsive con scroll */}
          <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl 
                         max-h-[95vh] sm:max-h-[90vh] md:max-h-[85vh] 
                         bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl 
                         shadow-xl border border-gray-200 dark:border-gray-700 
                         flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header - Fijo */}
              <div className="flex-shrink-0 flex items-center justify-between p-3 sm:p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                      Detalles del Control
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      {data ? data.proceso_control_temperatura : "Cargando..."}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Cerrar Modal"
                  className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* ✅ Content con scroll CORREGIDO */}
              <div className="flex-1 overflow-y-auto overscroll-contain">
                <div className="p-3 sm:p-4 md:p-6">
                  {loading ? (
                    /* Loading State */
                    <div className="flex items-center justify-center py-8 sm:py-12">
                      <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          Cargando detalles del control...
                        </p>
                      </div>
                    </div>
                  ) : !data ? (
                    /* Error State */
                    <div className="flex items-center justify-center py-8 sm:py-12">
                      <div className="text-center">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                          <X className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          No se pudieron cargar los datos
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Intenta nuevamente más tarde
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* Data Content */
                    <div className="space-y-4 sm:space-y-6 md:space-y-8">
                      {/* Información General */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                        {/* IMEI */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 sm:p-4 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 dark:text-gray-400" />
                            <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                              IMEI
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm font-mono text-gray-900 dark:text-white break-all">
                            {data.imei_control_temperatura}
                          </p>
                        </div>

                        {/* Proceso */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 sm:p-4 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                              Proceso
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                            {data.proceso_control_temperatura}
                          </p>
                        </div>

                        {/* Tipo */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 sm:p-4 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                              Tipo
                            </span>
                          </div>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTipoColor(
                              data.tipo_control_temperatura
                            )}`}
                          >
                            {getTipoTexto(data.tipo_control_temperatura)}
                          </span>
                        </div>

                        {/* Estado */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 sm:p-4 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                              Estado
                            </span>
                          </div>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(
                              data.condicion_control_temperatura
                            )}`}
                          >
                            {getEstadoTexto(data.condicion_control_temperatura)}
                          </span>
                        </div>

                        {/* Actividad */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 sm:p-4 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                              Actividad
                            </span>
                          </div>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getActivoColor(
                              data.estado_control_temperatura
                            )}`}
                          >
                            {getActivoTexto(data.estado_control_temperatura)}
                          </span>
                        </div>

                        {/* Duración */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 sm:p-4 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 dark:text-gray-400" />
                            <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                              Duración
                            </span>
                          </div>
                          <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                            {data.hora_proceso_control_temperatura}h
                          </p>
                        </div>
                      </div>

                      {/* Información Temporal */}
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 sm:p-6 rounded-lg sm:rounded-xl border border-blue-200 dark:border-blue-800">
                        <h3 className="text-sm sm:text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3 sm:mb-4">
                          <Clock className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" />
                          Información Temporal
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                          <div>
                            <span className="text-xs sm:text-sm font-medium text-blue-800 dark:text-blue-200">
                              Total Etapas
                            </span>
                            <p className="text-sm sm:text-lg font-semibold text-blue-900 dark:text-blue-100">
                              {data.total_control_temperatura} etapas
                            </p>
                          </div>
                          <div className="sm:col-span-2">
                            <span className="text-xs sm:text-sm font-medium text-blue-800 dark:text-blue-200">
                              Fin Programado
                            </span>
                            <p className="text-xs sm:text-sm font-semibold text-blue-900 dark:text-blue-100">
                              {formatearFecha(
                                data.hora_fin_control_temperatura
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Lista de Etapas */}
                      <div className="space-y-3 sm:space-y-4">
                        <h3 className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white">
                          <Thermometer className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" />
                          Etapas del Proceso (
                          {data.lista_control_temperatura.length})
                        </h3>

                        <div className="space-y-3 sm:space-y-4">
                          {data.lista_control_temperatura.map(
                            (etapa, index) => (
                              <div
                                key={index}
                                className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-600/50 p-3 sm:p-5 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-600"
                              >
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 sm:mb-4">
                                  <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-0">
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                                      <span className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400">
                                        {index + 1}
                                      </span>
                                    </div>
                                    <div>
                                      <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                                        {etapa.nombre_etapa}
                                      </h4>
                                      <p className="text-xs text-gray-600 dark:text-gray-400">
                                        Etapa {index + 1} de{" "}
                                        {data.lista_control_temperatura.length}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-left sm:text-right">
                                    <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                      <span className="break-all">
                                        {formatearFecha(
                                          etapa.hora_inicio_etapa
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                  {/* Temperatura */}
                                  <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-white dark:bg-gray-800 rounded-lg">
                                    <div
                                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                                        etapa.temperatura_etapa > 0
                                          ? "bg-red-100 dark:bg-red-900/20"
                                          : "bg-blue-100 dark:bg-blue-900/20"
                                      }`}
                                    >
                                      <Thermometer
                                        className={`w-4 h-4 sm:w-5 sm:h-5 ${
                                          etapa.temperatura_etapa > 0
                                            ? "text-red-600 dark:text-red-400"
                                            : "text-blue-600 dark:text-blue-400"
                                        }`}
                                      />
                                    </div>
                                    <div>
                                      <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Temperatura
                                      </p>
                                      <p
                                        className={`text-sm sm:text-lg font-bold ${
                                          etapa.temperatura_etapa > 0
                                            ? "text-red-600 dark:text-red-400"
                                            : "text-blue-600 dark:text-blue-400"
                                        }`}
                                      >
                                        {formatearTemperatura(
                                          etapa.temperatura_etapa
                                        )}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Humedad */}
                                  <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-white dark:bg-gray-800 rounded-lg">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                                      <Droplets className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                      <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Humedad
                                      </p>
                                      <p className="text-sm sm:text-lg font-bold text-green-600 dark:text-green-400">
                                        {etapa.humedad_etapa !== null
                                          ? `${etapa.humedad_etapa}%`
                                          : "No configurada"}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      {/* Información de Usuario */}
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 sm:p-6 rounded-lg sm:rounded-xl border border-purple-200 dark:border-purple-800">
                        <h3 className="text-sm sm:text-lg font-semibold text-purple-900 dark:text-purple-100 mb-3 sm:mb-4">
                          <User className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" />
                          Información de Usuario
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                          {/* Usuario Creador */}
                          <div className="space-y-2 sm:space-y-3">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                                <User className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-400" />
                              </div>
                              <span className="text-xs sm:text-sm font-medium text-purple-800 dark:text-purple-200">
                                Creado por
                              </span>
                            </div>
                            <div className="ml-8 sm:ml-10">
                              <p className="text-sm sm:text-base font-semibold text-purple-900 dark:text-purple-100">
                                {data.user_c_nombre}
                              </p>
                              <p className="text-xs text-purple-600 dark:text-purple-400">
                                {formatearFecha(data.created_at)}
                              </p>
                            </div>
                          </div>

                          {/* Usuario Modificador */}
                          <div className="space-y-2 sm:space-y-3">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                                <User className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-400" />
                              </div>
                              <span className="text-xs sm:text-sm font-medium text-purple-800 dark:text-purple-200">
                                Modificado por
                              </span>
                            </div>
                            <div className="ml-8 sm:ml-10">
                              <p className="text-sm sm:text-base font-semibold text-purple-900 dark:text-purple-100">
                                {data.user_m_nombre}
                              </p>
                              <p className="text-xs text-purple-600 dark:text-purple-400">
                                {formatearFecha(data.updated_at)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Datos Raw (para debug) - Solo en desarrollo */}
                      {process.env.NODE_ENV === "development" && (
                        <details className="bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-600">
                          <summary className="p-3 sm:p-4 cursor-pointer text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600/50 rounded-lg sm:rounded-xl transition-colors">
                            Ver datos completos de la API (Debug)
                          </summary>
                          <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-600">
                            <pre className="text-xs text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg overflow-x-auto">
                              {JSON.stringify(data, null, 2)}
                            </pre>
                          </div>
                        </details>
                      )}

                      {/* ✅ Espaciado adicional para el scroll */}
                      <div className="h-4"></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer - Fijo */}
              <div className="flex-shrink-0 flex justify-end p-3 sm:p-4 md:p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <button
                  onClick={onClose}
                  className="px-4 py-2 sm:px-6 sm:py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors font-medium text-sm"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
