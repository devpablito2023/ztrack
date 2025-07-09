"use client";

import { useState } from "react";
import { Zap, RotateCcw, Calendar, Plus } from "lucide-react";
import Modal from "$/components/ui/Modal";
import FormularioUnico from "./formularios-control/FormularioUnico";
import FormularioCiclico from "./formularios-control/FormularioCiclico";
import FormularioPeriodico from "./formularios-control/FormularioPeriodico";

type TipoFormulario = "unico" | "ciclico" | "periodico" | null;

interface ControlFormulariosProps {
  tipoControl: "unico" | "ciclico" | "periodico";
  onTipoControlChange: (tipo: "unico" | "ciclico" | "periodico") => void;
  onControlCreated?: () => void;
}

export default function ControlFormularios({
  tipoControl,
  onTipoControlChange,
  onControlCreated,
}: ControlFormulariosProps) {
  const [modalAbierto, setModalAbierto] = useState<TipoFormulario>(null);

  const abrirModal = (tipo: TipoFormulario) => {
    setModalAbierto(tipo);
  };

  const cerrarModal = () => {
    setModalAbierto(null);
  };

  const handleSuccess = () => {
    console.log("Control creado exitosamente");
    cerrarModal();
    onControlCreated?.();
  };

  const handleCancel = () => {
    console.log("Formulario cancelado");
    cerrarModal();
  };

  const formularios = [
    {
      id: "unico",
      titulo: "Control Único",
      descripcion: "Proceso de control único con múltiples etapas secuenciales",
      icono: Zap,
      color: "blue",
      gradiente: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      textColor: "text-blue-900 dark:text-blue-100",
      hoverColor: "hover:bg-blue-100 dark:hover:bg-blue-900/30",
    },
    {
      id: "ciclico",
      titulo: "Control Cíclico",
      descripcion: "Proceso de control cíclico con etapas que se repiten",
      icono: RotateCcw,
      color: "orange",
      gradiente: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      borderColor: "border-orange-200 dark:border-orange-800",
      textColor: "text-orange-900 dark:text-orange-100",
      hoverColor: "hover:bg-orange-100 dark:hover:bg-orange-900/30",
    },
    {
      id: "periodico",
      titulo: "Control Periódico",
      descripcion: "Proceso de control periódico con horarios específicos",
      icono: Calendar,
      color: "purple",
      gradiente: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-200 dark:border-purple-800",
      textColor: "text-purple-900 dark:text-purple-100",
      hoverColor: "hover:bg-purple-100 dark:hover:bg-purple-900/30",
    },
  ];

  const obtenerTituloModal = (tipo: TipoFormulario) => {
    switch (tipo) {
      case "unico":
        return "Configurar Control Único";
      case "ciclico":
        return "Configurar Control Cíclico";
      case "periodico":
        return "Configurar Control Periódico";
      default:
        return "";
    }
  };

  const renderFormulario = (tipo: TipoFormulario) => {
    switch (tipo) {
      case "unico":
        return (
          <FormularioUnico onSuccess={handleSuccess} onCancel={handleCancel} />
        );
      case "ciclico":
        return (
          <FormularioCiclico
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        );
      case "periodico":
        return (
          <FormularioPeriodico
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Tipos de Control Automático
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Selecciona el tipo de control que deseas configurar para tus
            contenedores
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formularios.map((formulario) => {
            const IconoComponente = formulario.icono;
            return (
              <div
                key={formulario.id}
                className={`${formulario.bgColor} ${formulario.borderColor} ${formulario.hoverColor} border-2 rounded-2xl p-6 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-lg flex flex-col h-full`}
                onClick={() => abrirModal(formulario.id as TipoFormulario)}
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${formulario.gradiente} rounded-xl flex items-center justify-center mb-4 mx-auto`}
                >
                  <IconoComponente className="w-8 h-8 text-white" />
                </div>

                <div className="text-center flex-1 flex flex-col justify-between">
                  <div>
                    <h4
                      className={`text-lg font-semibold ${formulario.textColor} mb-2`}
                    >
                      {formulario.titulo}
                    </h4>
                  </div>

                  <div className="mt-auto flex justify-center">
                    <div
                      className={`inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r ${formulario.gradiente} text-white rounded-lg text-sm font-medium shadow-sm`}
                    >
                      <Plus className="w-4 h-4" />
                      <span>Configurar</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                ¿Cómo elegir el tipo de control?
              </h4>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p>
                  <strong>Control Único:</strong> Para procesos que se ejecutan
                  una sola vez con etapas secuenciales.
                </p>
                <p>
                  <strong>Control Cíclico:</strong> Para procesos que se repiten
                  continuamente en ciclos.
                </p>
                <p>
                  <strong>Control Periódico:</strong> Para procesos que se
                  ejecutan en horarios específicos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalAbierto !== null}
        onClose={cerrarModal}
        title={obtenerTituloModal(modalAbierto)}
        size="full"
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-hidden">
            {renderFormulario(modalAbierto)}
          </div>
        </div>
      </Modal>
    </>
  );
}
