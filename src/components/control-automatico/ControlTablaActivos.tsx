"use client";

import { useState } from "react";
import { Play, Eye, Trash2, Thermometer } from "lucide-react";
import { useVerControl } from "$/hooks/useVerControl";
import { useEliminarControl } from "$/hooks/useEliminarControl";
import { useToast } from "$/contexts/ToastContext";
import { useModals } from "$/hooks/useModals";
import ConfirmModal from "$/components/ui/ConfirmModal";
import VerControlModal from "$/components/ui/VerControlModal";

interface ControlTemperatura {
  id_control_temperatura: number;
  imei_control_temperatura: string;
  proceso_control_temperatura: string;
  tipo_control_temperatura: number;
  total_control_temperatura: number;
  condicion_control_temperatura: number;
  estado_control_temperatura: number;
}

interface ControlTablaActivosProps {
  controles: ControlTemperatura[];
  loading: boolean;
  onRefresh: () => void;
}

export default function ControlTablaActivos({
  controles,
  loading,
  onRefresh,
}: ControlTablaActivosProps) {
  const [controlSeleccionado, setControlSeleccionado] =
    useState<ControlTemperatura | null>(null);
  const [modalVerOpen, setModalVerOpen] = useState(false);

  const {
    data: controlDetalle,
    loading: loadingVer,
    verControl,
    clearData,
  } = useVerControl();
  const { loading: loadingEliminar, eliminarControl } = useEliminarControl();
  const { showSuccess, showError } = useToast();
  const {
    isConfirmOpen,
    confirmData,
    showConfirm,
    hideConfirm,
    isConfirmLoading,
    setConfirmLoading,
  } = useModals();

  const getEstadoColor = (condicion: number) => {
    return condicion === 1
      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
  };

  const getEstadoTexto = (condicion: number) => {
    return condicion === 1 ? "En Proceso" : "Completado";
  };

  const getTipoTexto = (tipo: number) => {
    const tipos = { 0: "Único", 1: "Cíclico", 2: "Periódico" };
    return tipos[tipo as keyof typeof tipos] || "Desconocido";
  };

  // En las funciones handleVerControl y handleEliminarControl:

  const handleVerControl = async (control: ControlTemperatura) => {
    setControlSeleccionado(control);
    setModalVerOpen(true);

    clearData();

    console.log(
      "🎯 Llamando verControl con ID:",
      control.id_control_temperatura
    ); // ✅ Debug

    // ✅ CORRECTO: Pasando control.id como especifico
    const resultado = await verControl(control.id_control_temperatura);

    if (!resultado.success) {
      showError(
        "Error al obtener detalles",
        resultado.error || "No se pudieron cargar los detalles del control"
      );
    }
  };

  const handleEliminarControl = (control: ControlTemperatura) => {
    showConfirm({
      title: "¿Eliminar control?",
      message: `¿Estás seguro de que quieres eliminar el control "${control.proceso_control_temperatura}"? Esta acción no se puede deshacer.`,
      type: "danger",
      confirmText: "Sí, eliminar",
      cancelText: "Cancelar",
      onConfirm: async () => {
        try {
          setConfirmLoading(true);

          console.log(
            "🎯 Llamando eliminarControl con ID:",
            control.id_control_temperatura
          ); // ✅ Debug

          // ✅ CORRECTO: Pasando control.id como especifico
          const resultado = await eliminarControl(
            control.id_control_temperatura
          );

          if (resultado.success) {
            hideConfirm();
            showSuccess(
              "Control eliminado",
              `El control "${control.proceso_control_temperatura}" ha sido eliminado exitosamente`
            );
            onRefresh();
          } else {
            setConfirmLoading(false);
            showError(
              "Error al eliminar",
              resultado.error || "No se pudo eliminar el control"
            );
          }
        } catch (error) {
          setConfirmLoading(false);
          showError(
            "Error al eliminar",
            "Ocurrió un error inesperado al eliminar el control"
          );
        }
      },
    });
  };

  const handleCloseModal = () => {
    setModalVerOpen(false);
    setControlSeleccionado(null);
    clearData();
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Controles Activos
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {controles.length} proceso{controles.length !== 1 ? "s" : ""}{" "}
                activo{controles.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Thermometer className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          {controles.length === 0 ? (
            <div className="p-8 text-center">
              <div className="flex flex-col items-center space-y-3">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <Play className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    No hay controles activos
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Los procesos activos aparecerán aquí
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    #
                  </th>
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
                    Condición
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Progreso
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {controles.map((control, index) => (
                  <tr
                    key={control.id_control_temperatura}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        #{index + 1}{" "}
                        {/* ✅ Usar índice + 1 para empezar desde 1 */}
                      </div>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {control.imei_control_temperatura}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {control.proceso_control_temperatura}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                        {getTipoTexto(control.tipo_control_temperatura)}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(
                          control.condicion_control_temperatura
                        )}`}
                      >
                        {getEstadoTexto(control.condicion_control_temperatura)}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${
                                (control.condicion_control_temperatura /
                                  control.total_control_temperatura) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {control.condicion_control_temperatura}/
                          {control.total_control_temperatura}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {/* Botón Ver */}
                        <button
                          onClick={() => handleVerControl(control)}
                          disabled={
                            loadingVer &&
                            controlSeleccionado?.id_control_temperatura ===
                              control.id_control_temperatura
                          }
                          className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Ver detalles"
                        >
                          {loadingVer &&
                          controlSeleccionado?.id_control_temperatura ===
                            control.id_control_temperatura ? (
                            <div className="w-3 h-3 border border-blue-600 border-t-transparent rounded-full animate-spin mr-1"></div>
                          ) : (
                            <Eye className="w-3 h-3 mr-1" />
                          )}
                          Ver
                        </button>

                        {/* Botón Eliminar */}
                        <button
                          onClick={() => handleEliminarControl(control)}
                          disabled={loadingEliminar}
                          className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Eliminar control"
                        >
                          {loadingEliminar ? (
                            <div className="w-3 h-3 border border-red-600 border-t-transparent rounded-full animate-spin mr-1"></div>
                          ) : (
                            <Trash2 className="w-3 h-3 mr-1" />
                          )}
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal de Ver Control */}
      <VerControlModal
        isOpen={modalVerOpen}
        onClose={handleCloseModal}
        data={controlDetalle}
        loading={loadingVer}
      />

      {/* Modal de Confirmación */}
      {confirmData && (
        <ConfirmModal
          isOpen={isConfirmOpen}
          onClose={hideConfirm}
          onConfirm={confirmData.onConfirm}
          title={confirmData.title}
          message={confirmData.message}
          type={confirmData.type}
          confirmText={confirmData.confirmText}
          cancelText={confirmData.cancelText}
          isLoading={isConfirmLoading}
        />
      )}
    </>
  );
}
