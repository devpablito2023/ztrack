"use client";

import { useState, useCallback } from "react";
import { useAuth } from "./useAuth";
import type {
  ControlTemperaturaRequest,
  ControlTemperaturaResponse,
  FormularioUnicoData,
  FormularioCiclicoData,
  FormularioPeriodicoData,
  EtapaControl,
  EtapaUnica,
} from "$/types/control-formularios";

const API_URL = process.env.NEXT_PUBLIC_APICONTROL_URL;
const IMEI_ESTATICO = "868428046606400";

export function useControlFormularios() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatearFecha = useCallback((fecha: Date): string => {
    const dia = fecha.getDate().toString().padStart(2, "0");
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
    const año = fecha.getFullYear();
    const horas = fecha.getHours().toString().padStart(2, "0");
    const minutos = fecha.getMinutes().toString().padStart(2, "0");
    return `${dia}-${mes}-${año}_${horas}-${minutos}`;
  }, []);

  const sumarHoras = useCallback((fecha: Date, horas: number): Date => {
    const nuevaFecha = new Date(fecha);
    nuevaFecha.setHours(nuevaFecha.getHours() + horas);
    return nuevaFecha;
  }, []);

  const calcularEtapasCiclicas = useCallback(
    (
      etapasBase: any[],
      fechaInicio: Date,
      horasTotales: number,
      pausaEntreCiclos: number = 0
    ): EtapaControl[] => {
      const etapasFinales: EtapaControl[] = [];
      let fechaActual = new Date(fechaInicio);
      let horasAcumuladas = 0;
      let contadorEtapa = 1;

      while (horasAcumuladas < horasTotales) {
        for (
          let i = 0;
          i < etapasBase.length && horasAcumuladas < horasTotales;
          i++
        ) {
          const etapaBase = etapasBase[i];
          const duracionHoras = parseFloat(etapaBase.duracionMinutos) / 60;

          const duracionFinal = Math.min(
            duracionHoras,
            horasTotales - horasAcumuladas
          );

          etapasFinales.push({
            duracion: duracionFinal,
            hora_inicio_etapa: formatearFecha(fechaActual),
            nombre_etapa: `${etapaBase.nombreEtapa} (Ciclo ${Math.ceil(
              contadorEtapa / etapasBase.length
            )})`,
            temperatura_etapa: parseFloat(etapaBase.temperatura),
            humedad: parseFloat(etapaBase.humedad),
          });

          fechaActual = sumarHoras(fechaActual, duracionFinal);
          horasAcumuladas += duracionFinal;
          contadorEtapa++;
        }

        if (pausaEntreCiclos > 0 && horasAcumuladas < horasTotales) {
          const pausaHoras = pausaEntreCiclos / 60;
          fechaActual = sumarHoras(fechaActual, pausaHoras);
        }
      }

      return etapasFinales;
    },
    [formatearFecha, sumarHoras]
  );

  const calcularEtapasPeriodicas = useCallback(
    (
      etapasBase: any[],
      fechaInicio: Date,
      horasTotales: number
    ): EtapaControl[] => {
      const etapasFinales: EtapaControl[] = [];
      let fechaActual = new Date(fechaInicio);
      let horasAcumuladas = 0;
      let contadorCiclo = 1;

      while (horasAcumuladas < horasTotales) {
        for (
          let i = 0;
          i < etapasBase.length && horasAcumuladas < horasTotales;
          i++
        ) {
          const etapaBase = etapasBase[i];
          const duracionHoras = parseFloat(etapaBase.duracion);

          const duracionFinal = Math.min(
            duracionHoras,
            horasTotales - horasAcumuladas
          );

          etapasFinales.push({
            duracion: duracionFinal,
            hora_inicio_etapa: formatearFecha(fechaActual),
            nombre_etapa: `${etapaBase.nombreEtapa} (Repetición ${contadorCiclo})`,
            temperatura_etapa: parseFloat(etapaBase.temperatura),
            humedad: parseFloat(etapaBase.humedad),
          });

          fechaActual = sumarHoras(fechaActual, duracionFinal);
          horasAcumuladas += duracionFinal;
        }
        contadorCiclo++;
      }

      return etapasFinales;
    },
    [formatearFecha, sumarHoras]
  );

  const procesarFormularioUnico = useCallback(
    (data: FormularioUnicoData): ControlTemperaturaRequest => {
      const fechaInicio = new Date(data.etapas[0]?.fechaHoraInicio);
      const fechaFin = new Date(data.fechaHoraFin);

      const horasTotales =
        (fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60);

      const etapasControl: EtapaControl[] = data.etapas.map(
        (etapa: EtapaUnica, index: number) => {
          const fechaEtapa = new Date(etapa.fechaHoraInicio);

          let duracionCalculada: number;

          if (index === data.etapas.length - 1) {
            duracionCalculada =
              (fechaFin.getTime() - fechaEtapa.getTime()) / (1000 * 60 * 60);
          } else {
            const siguienteEtapa = data.etapas[index + 1];
            const fechaSiguiente = new Date(siguienteEtapa.fechaHoraInicio);
            duracionCalculada =
              (fechaSiguiente.getTime() - fechaEtapa.getTime()) /
              (1000 * 60 * 60);
          }

          return {
            duracion: duracionCalculada,
            hora_inicio_etapa: formatearFecha(fechaEtapa),
            nombre_etapa: etapa.nombreEtapa,
            temperatura_etapa: parseFloat(etapa.temperatura),
            humedad: parseFloat(etapa.humedad),
          };
        }
      );

      return {
        hora_fin_control_temperatura: formatearFecha(fechaFin),
        hora_proceso_control_temperatura: horasTotales,
        imei_control_temperatura: IMEI_ESTATICO,
        lista_control_temperatura: etapasControl,
        proceso_control_temperatura: data.nombreProceso,
        tipo_control_temperatura: 0,
        total_control_temperatura: etapasControl.length,
        user_c: user?.id || 0,
      };
    },
    [formatearFecha, user]
  );

  const procesarFormularioCiclico = useCallback(
    (data: FormularioCiclicoData): ControlTemperaturaRequest => {
      const fechaInicio = new Date(data.fechaHoraInicio);
      const numeroCiclos = parseInt(data.numeroCiclos);
      const pausaMinutos = parseInt(data.pausaEntreCiclos || "0");

      const duracionCicloMinutos = data.etapas.reduce((total, etapa) => {
        return total + parseFloat(etapa.duracionMinutos);
      }, 0);

      const horasTotalesProceso = (duracionCicloMinutos * numeroCiclos) / 60;
      const horasTotalesConPausas =
        horasTotalesProceso + ((numeroCiclos - 1) * pausaMinutos) / 60;

      const fechaFin = sumarHoras(fechaInicio, horasTotalesConPausas);

      const etapasControl = calcularEtapasCiclicas(
        data.etapas,
        fechaInicio,
        horasTotalesProceso,
        pausaMinutos
      );

      return {
        hora_fin_control_temperatura: formatearFecha(fechaFin),
        hora_proceso_control_temperatura: horasTotalesProceso,
        imei_control_temperatura: IMEI_ESTATICO,
        lista_control_temperatura: etapasControl,
        proceso_control_temperatura: data.nombreProceso,
        tipo_control_temperatura: 1,
        total_control_temperatura: etapasControl.length,
        user_c: user?.id || 0,
      };
    },
    [calcularEtapasCiclicas, formatearFecha, sumarHoras, user]
  );

  const procesarFormularioPeriodico = useCallback(
    (data: FormularioPeriodicoData): ControlTemperaturaRequest => {
      const fechaInicio = new Date(data.fechaHoraInicio);
      const horasTotales = parseFloat(data.horasProceso);

      const fechaFin = sumarHoras(fechaInicio, horasTotales);

      const etapasControl = calcularEtapasPeriodicas(
        data.etapas,
        fechaInicio,
        horasTotales
      );

      return {
        hora_fin_control_temperatura: formatearFecha(fechaFin),
        hora_proceso_control_temperatura: horasTotales,
        imei_control_temperatura: IMEI_ESTATICO,
        lista_control_temperatura: etapasControl,
        proceso_control_temperatura: data.nombreProceso,
        tipo_control_temperatura: 0,
        total_control_temperatura: etapasControl.length,
        user_c: user?.id || 0,
      };
    },
    [calcularEtapasPeriodicas, formatearFecha, sumarHoras, user]
  );

  const enviarControl = useCallback(
    async (
      tipoFormulario: "unico" | "ciclico" | "periodico",
      data:
        | FormularioUnicoData
        | FormularioCiclicoData
        | FormularioPeriodicoData
    ): Promise<{ success: boolean; error?: string; data?: any }> => {
      if (!user) {
        return { success: false, error: "Usuario no autenticado" };
      }

      setIsLoading(true);
      setError(null);

      try {
        let requestData: ControlTemperaturaRequest;

        switch (tipoFormulario) {
          case "unico":
            requestData = procesarFormularioUnico(data as FormularioUnicoData);
            break;
          case "ciclico":
            requestData = procesarFormularioCiclico(
              data as FormularioCiclicoData
            );
            break;
          case "periodico":
            requestData = procesarFormularioPeriodico(
              data as FormularioPeriodicoData
            );
            break;
          default:
            throw new Error("Tipo de formulario no válido");
        }

        console.log("Enviando control:", requestData);

        const response = await fetch(`${API_URL}/Control/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const result = await response.json();

        if (result.code === 200) {
          return {
            success: true,
            data: result.data,
          };
        } else {
          return {
            success: false,
            error: result.message || "Error al crear el control",
          };
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        setError(errorMessage);
        console.error("Error al enviar control:", err);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [
      user,
      procesarFormularioUnico,
      procesarFormularioCiclico,
      procesarFormularioPeriodico,
    ]
  );

  return {
    enviarControl,
    isLoading,
    error,
  };
}
