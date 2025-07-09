"use client";
import { History, Calendar, CheckCircle, XCircle } from "lucide-react";

interface ControlTemperatura {
  id: number; // ID del proceso
  imei_control_temperatura: string;
  proceso_control_temperatura: string;
  tipo_control_temperatura: number;
  total_control_temperatura: number;
  condicion_control_temperatura: number;
  estado_control_temperatura: number;
}

interface ControlTablaHistoricoProps {
  controles: ControlTemperatura[];
  loading: boolean;
}

export default function ControlTablaHistorico({
  controles,
  loading,
}: ControlTablaHistoricoProps) {
  const getTipoTexto = (tipo: number) => {
    const tipos = { 0: "Único", 1: "Cíclico", 2: "Periódico" };
    return tipos[tipo as keyof typeof tipos] || "Desconocido";
  };

  const getEstadoIcon = (condicion: number) => {
    return condicion === 0 ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    );
  };

  const getEstadoTexto = (condicion: number) => {
    return condicion === 0 ? "Completado" : "Interrumpido";
  };

  const getEstadoColor = (condicion: number) => {
    return condicion === 0
      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              Histórico de Controles
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {controles.length} proceso{controles.length !== 1 ? "s" : ""}{" "}
              completado{controles.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        {controles.length === 0 ? (
          <div className="p-8 text-center">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  No hay histórico disponible
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Los procesos completados aparecerán aquí
                </p>
              </div>
            </div>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  IMEI
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Proceso
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Estado Final
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Completado
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Fecha
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {controles.map((control, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {control.imei_control_temperatura}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {control.proceso_control_temperatura}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                      {getTipoTexto(control.tipo_control_temperatura)}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getEstadoIcon(control.condicion_control_temperatura)}
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(
                          control.condicion_control_temperatura
                        )}`}
                      >
                        {getEstadoTexto(control.condicion_control_temperatura)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 max-w-[100px]">
                        <div
                          className="bg-gray-400 h-2 rounded-full"
                          style={{ width: "100%" }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {control.total_control_temperatura}/
                        {control.total_control_temperatura}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {/* Extraer fecha del nombre del proceso */}
                      {control.proceso_control_temperatura.match(
                        /\d{2}\/\d{2}\/\d{4}/
                      )?.[0] || "N/A"}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
