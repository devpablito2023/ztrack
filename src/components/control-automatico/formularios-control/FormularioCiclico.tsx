"use client";

import { useState } from "react";
import { Plus, Trash2, RotateCcw, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useControlFormularios } from "$/hooks/useControlFormularios";
import { useToast } from "$/contexts/ToastContext";
import { useModals } from "$/hooks/useModals";
import ConfirmModal from "$/components/ui/ConfirmModal";
import SaveModal from "$/components/ui/SaveModal";

interface EtapaCiclica {
  id: string;
  nombreEtapa: string;
  temperatura: string;
  humedad: string;
  duracion: string;
}

interface FormularioCiclicoProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function FormularioCiclico({
  onSuccess,
  onCancel,
}: FormularioCiclicoProps) {
  const { enviarControl, isLoading, error } = useControlFormularios();
  const { showSuccess, showError, showWarning } = useToast();
  const {
    isConfirmOpen,
    confirmData,
    showConfirm,
    hideConfirm,
    isSaveOpen,
    saveData,
    showSave,
    hideSave,
    isConfirmLoading,
    isSaveLoading,
    setConfirmLoading,
    setSaveLoading,
  } = useModals();

  const [nombreProceso, setNombreProceso] = useState("");
  const [ciclos, setCiclos] = useState("");
  const [etapas, setEtapas] = useState<EtapaCiclica[]>([
    {
      id: "1",
      nombreEtapa: "",
      temperatura: "",
      humedad: "",
      duracion: "",
    },
    {
      id: "2",
      nombreEtapa: "",
      temperatura: "",
      humedad: "",
      duracion: "",
    },
  ]);

  const agregarEtapa = () => {
    const nuevaEtapa: EtapaCiclica = {
      id: Date.now().toString(),
      nombreEtapa: "",
      temperatura: "",
      humedad: "",
      duracion: "",
    };
    setEtapas([...etapas, nuevaEtapa]);
    showSuccess("Etapa agregada", "Se ha agregado una nueva etapa al proceso");
  };

  const eliminarEtapa = (id: string) => {
    if (etapas.length > 2) {
      showConfirm({
        title: "¿Eliminar etapa?",
        message:
          "¿Estás seguro de que quieres eliminar esta etapa? Esta acción no se puede deshacer.",
        type: "danger",
        confirmText: "Sí, eliminar",
        cancelText: "Cancelar",
        onConfirm: () => {
          setEtapas(etapas.filter((etapa) => etapa.id !== id));
          hideConfirm();
          showSuccess(
            "Etapa eliminada",
            "La etapa ha sido eliminada del proceso"
          );
        },
      });
    } else {
      showWarning(
        "No se puede eliminar",
        "Debe mantener al menos 2 etapas en el proceso cíclico"
      );
    }
  };

  const actualizarEtapa = (
    id: string,
    campo: keyof EtapaCiclica,
    valor: string
  ) => {
    setEtapas(
      etapas.map((etapa) =>
        etapa.id === id ? { ...etapa, [campo]: valor } : etapa
      )
    );
  };

  const validarFormulario = (): string | null => {
    if (!nombreProceso.trim()) {
      return "Por favor ingrese el nombre del proceso";
    }
    if (!ciclos || parseInt(ciclos) <= 0) {
      return "Por favor ingrese el número de ciclos (mayor a 0)";
    }

    // Validar que todas las etapas tengan datos completos
    for (let i = 0; i < etapas.length; i++) {
      const etapa = etapas[i];
      if (!etapa.nombreEtapa.trim()) {
        return `Por favor ingrese el nombre de la etapa ${i + 1}`;
      }
      if (!etapa.temperatura || isNaN(parseFloat(etapa.temperatura))) {
        return `Por favor ingrese una temperatura válida para la etapa ${
          i + 1
        }`;
      }
      if (!etapa.humedad || isNaN(parseFloat(etapa.humedad))) {
        return `Por favor ingrese una humedad válida para la etapa ${i + 1}`;
      }
      if (parseFloat(etapa.humedad) < 0 || parseFloat(etapa.humedad) > 100) {
        return `La humedad de la etapa ${i + 1} debe estar entre 0 y 100%`;
      }
      if (!etapa.duracion || parseFloat(etapa.duracion) <= 0) {
        return `Por favor ingrese una duración válida para la etapa ${
          i + 1
        } (mayor a 0)`;
      }
    }

    return null;
  };

  const handleSubmit = async () => {
    const errorValidacion = validarFormulario();
    if (errorValidacion) {
      showError("Error de validación", errorValidacion);
      return;
    }

    // Calcular duración total del proceso
    const duracionTotalCiclo = etapas.reduce((total, etapa) => {
      return total + parseFloat(etapa.duracion || "0");
    }, 0);
    const duracionTotalProceso = duracionTotalCiclo * parseInt(ciclos);

    showSave({
      title: "Crear Control Cíclico",
      message: `¿Estás seguro de que quieres crear el control cíclico "${nombreProceso}" con ${etapas.length} etapas que se repetirán ${ciclos} veces? (Duración total: ${duracionTotalProceso}h)`,
      type: "create",
      confirmText: "Crear Control",
      onConfirm: async () => {
        try {
          setSaveLoading(true);

          const resultado = await enviarControl("ciclico", {
            nombreProceso,
            ciclos,
            etapas,
          });

          if (resultado.success) {
            hideSave();
            showSuccess(
              "Control creado exitosamente",
              `El control cíclico "${nombreProceso}" ha sido configurado correctamente`
            );
            onSuccess?.();
          } else {
            setSaveLoading(false);
            showError(
              "Error al crear control",
              resultado.error || "Ocurrió un error inesperado"
            );
          }
        } catch (error) {
          setSaveLoading(false);
          showError(
            "Error al crear control",
            "No se pudo conectar con el servidor"
          );
        }
      },
    });
  };

  const handleCancel = () => {
    const hayDatos =
      nombreProceso.trim() ||
      ciclos ||
      etapas.some(
        (etapa) =>
          etapa.nombreEtapa.trim() ||
          etapa.temperatura ||
          etapa.humedad ||
          etapa.duracion
      );

    if (hayDatos) {
      showConfirm({
        title: "¿Cancelar proceso?",
        message:
          "Tienes cambios sin guardar. ¿Estás seguro de que quieres cancelar? Se perderán todos los datos ingresados.",
        type: "warning",
        confirmText: "Sí, cancelar",
        cancelText: "Continuar editando",
        onConfirm: () => {
          hideConfirm();
          showWarning(
            "Proceso cancelado",
            "Se han descartado los cambios realizados"
          );
          onCancel?.();
        },
      });
    } else {
      onCancel?.();
    }
  };

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <p className="text-red-800 dark:text-red-200 text-sm font-medium">
                Error: {error}
              </p>
            </div>
          )}

          <div className="bg-orange-50 dark:bg-orange-900/20 p-8 rounded-xl border border-orange-200 dark:border-orange-800">
            <h4 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-8">
              Información del Proceso
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium text-orange-800 dark:text-orange-200 mb-4">
                  Nombre del Proceso *
                </label>
                <input
                  type="text"
                  value={nombreProceso}
                  onChange={(e) => setNombreProceso(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-5 py-4 border border-orange-300 dark:border-orange-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Ingrese nombre del proceso"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-orange-800 dark:text-orange-200 mb-4">
                  <RotateCcw className="w-4 h-4 inline mr-2" />
                  Número de Ciclos *
                </label>
                <input
                  type="number"
                  min="1"
                  value={ciclos}
                  onChange={(e) => setCiclos(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-5 py-4 border border-orange-300 dark:border-orange-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Etapas del Proceso Cíclico
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Define las etapas de tu proceso cíclico (mínimo 2 etapas)
                </p>
              </div>
              <button
                onClick={agregarEtapa}
                disabled={isLoading}
                className="flex items-center space-x-3 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition-colors shadow-sm text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-5 h-5" />
                <span>Agregar Etapa</span>
              </button>
            </div>

            <div className="space-y-8">
              <AnimatePresence>
                {etapas.map((etapa, index) => (
                  <motion.div
                    key={etapa.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-gray-50 dark:bg-gray-700/50 p-8 rounded-xl border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex justify-between items-center mb-8">
                      <h5 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Control Cíclico {index + 1}
                      </h5>
                      {etapas.length > 2 && (
                        <button
                          onClick={() => eliminarEtapa(etapa.id)}
                          disabled={isLoading}
                          className="p-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Eliminar etapa"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                            Nombre de la Etapa *
                          </label>
                          <input
                            type="text"
                            value={etapa.nombreEtapa}
                            onChange={(e) =>
                              actualizarEtapa(
                                etapa.id,
                                "nombreEtapa",
                                e.target.value
                              )
                            }
                            disabled={isLoading}
                            className="w-full px-5 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors text-base disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="Nombre de la etapa"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                            Temperatura (°C) *
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            value={etapa.temperatura}
                            onChange={(e) =>
                              actualizarEtapa(
                                etapa.id,
                                "temperatura",
                                e.target.value
                              )
                            }
                            disabled={isLoading}
                            className="w-full px-5 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors text-base disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="0.0"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                            Humedad (%) *
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={etapa.humedad}
                            onChange={(e) =>
                              actualizarEtapa(
                                etapa.id,
                                "humedad",
                                e.target.value
                              )
                            }
                            disabled={isLoading}
                            className="w-full px-5 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors text-base disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                            <Clock className="w-4 h-4 inline mr-2" />
                            Duración (horas) *
                          </label>
                          <input
                            type="number"
                            min="0.1"
                            step="0.1"
                            value={etapa.duracion}
                            onChange={(e) =>
                              actualizarEtapa(
                                etapa.id,
                                "duracion",
                                e.target.value
                              )
                            }
                            disabled={isLoading}
                            className="w-full px-5 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors text-base disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="0.0"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6">
            <h5 className="text-sm font-semibold text-orange-900 dark:text-orange-100 mb-3">
              ℹ️ Información del Proceso Cíclico
            </h5>
            <div className="text-sm text-orange-800 dark:text-orange-200 space-y-2">
              <p>
                • Las etapas se ejecutarán en secuencia el número de ciclos
                especificado
              </p>
              <p>• Cada ciclo completo ejecutará todas las etapas en orden</p>
              <p>• Ejemplo: 3 etapas con 5 ciclos = 15 ejecuciones totales</p>
              {ciclos && etapas.length > 0 && (
                <div className="mt-4 p-3 bg-orange-100 dark:bg-orange-800/30 rounded-lg">
                  <p className="font-medium">
                    Resumen: {etapas.length} etapas × {ciclos} ciclos ={" "}
                    {etapas.length * parseInt(ciclos || "0")} ejecuciones
                    totales
                    {etapas.reduce(
                      (total, etapa) =>
                        total + parseFloat(etapa.duracion || "0"),
                      0
                    ) > 0 &&
                      ` (${(
                        etapas.reduce(
                          (total, etapa) =>
                            total + parseFloat(etapa.duracion || "0"),
                          0
                        ) * parseInt(ciclos || "0")
                      ).toFixed(1)}h total)`}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="h-20"></div>
        </div>

        <div className="flex-shrink-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-end space-x-4">
            <button
              onClick={handleCancel}
              disabled={isLoading || isSaveLoading}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || isSaveLoading}
              className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {(isLoading || isSaveLoading) && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              <span>
                {isLoading || isSaveLoading
                  ? "Creando..."
                  : "Crear Control Cíclico"}
              </span>
            </button>
          </div>
        </div>
      </div>

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

      {saveData && (
        <SaveModal
          isOpen={isSaveOpen}
          onClose={hideSave}
          onConfirm={saveData.onConfirm}
          title={saveData.title}
          message={saveData.message}
          type={saveData.type}
          confirmText={saveData.confirmText}
          cancelText={saveData.cancelText}
          isLoading={isSaveLoading}
        />
      )}
    </>
  );
}
