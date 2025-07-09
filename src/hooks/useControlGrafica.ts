"use client";

import { useState, useCallback, useRef } from "react";
import type {
  ControlGraficaRequest,
  ControlGraficaResponse,
  UseControlGraficaReturn,
} from "$/types/controlGrafica";

const useControlGrafica = (): UseControlGraficaReturn => {
  const [data, setData] = useState<ControlGraficaResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRequest, setLastRequest] =
    useState<Partial<ControlGraficaRequest> | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  // ✅ CORREGIDO: Función para calcular UTC dinámico
  const calculateDynamicUTC = (): number => {
    const now = new Date();
    const userTimezoneOffset = now.getTimezoneOffset(); // En minutos, negativo para GMT+
    const userGMT = -userTimezoneOffset / 60; // Convertir a horas GMT

    // Si estás en GMT-5 (Colombia), userGMT será -5
    // El cálculo debería ser: 300 - (5 + (-5)) * 60 = 300 - 0 = 300
    const dynamicUTC = 300 - (5 + userGMT) * 60;

    console.log("🌍 Información de zona horaria:", {
      userTimezoneOffset,
      userGMT,
      dynamicUTC,
      timezoneName: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    return dynamicUTC;
  };

  // ✅ CORREGIDO: Función para obtener fecha/hora actual del usuario
  const getCurrentDateTime = (): string => {
    const now = new Date();

    // Obtener fecha y hora local sin modificaciones
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    const localDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

    console.log("🕐 Fecha/hora actual del usuario:", {
      original: now.toISOString(),
      local: localDateTime,
      timezone: now.getTimezoneOffset(),
      readable: now.toLocaleString(),
    });

    return localDateTime;
  };

  // ✅ CORREGIDO: Función para formatear fecha desde input datetime-local
  const formatDateTimeForAPI = (dateTimeLocal: string): string => {
    if (!dateTimeLocal) return getCurrentDateTime();

    // Si viene del input datetime-local, ya está en formato correcto
    if (dateTimeLocal.includes("T")) {
      // Si no tiene segundos, agregarlos
      return dateTimeLocal.length === 16
        ? `${dateTimeLocal}:00`
        : dateTimeLocal;
    }

    // Si solo viene la fecha, agregar hora
    return `${dateTimeLocal}T00:00:00`;
  };

  // ✅ Función para procesar y loggear configuración de la API
  const processApiResponse = useCallback(
    (result: ControlGraficaResponse): ControlGraficaResponse => {
      console.log("🎨 Procesando respuesta de la API...");

      if (result?.data?.graph) {
        Object.entries(result.data.graph).forEach(([key, value]) => {
          if (value?.config) {
            const [label, visible, color, configType] = value.config;
            console.log(`📊 ${key}:`, {
              label,
              visible,
              color,
              configType,
              dataPoints: value.data?.length || 0,
            });
          }
        });
      }

      return result;
    },
    []
  );

  // ✅ Función base para hacer requests (DRY)
  const makeRequest = useCallback(
    async (requestBody: ControlGraficaRequest) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      console.log("🚀 Enviando request gráfica:", requestBody);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APIMONGODB_URL}/maduradores/DatosPollitos/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
          signal: abortControllerRef.current.signal,
        }
      );

      if (!response.ok) {
        throw new Error(
          `Error HTTP: ${response.status} - ${response.statusText}`
        );
      }

      const result: ControlGraficaResponse = await response.json();
      const processedResult = processApiResponse(result);

      console.log("✅ Datos gráfica recibidos y procesados");
      return processedResult;
    },
    [processApiResponse]
  );

  // ✅ Función para cargar datos iniciales
  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const currentDateTime = getCurrentDateTime();
      const dynamicUTC = calculateDynamicUTC();

      const requestBody: ControlGraficaRequest = {
        device: "15681",
        ultima: currentDateTime,
        utc: dynamicUTC,
      };

      console.log("📤 Request body final:", requestBody);

      const result = await makeRequest(requestBody);

      setData(result);
      setLastRequest(requestBody);
      setError(null);
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("🚫 Request inicial cancelado");
        return;
      }
      console.error("❌ Error cargando datos iniciales:", err);
      setError(err.message || "Error al cargar los datos iniciales");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [makeRequest]);

  // ✅ Función para filtrar datos
  const fetchData = useCallback(
    async (fechaI: string, fechaF: string, ultima: string) => {
      try {
        setLoading(true);
        setError(null);

        const requestBody: ControlGraficaRequest = {
          device: "15681",
          ultima: formatDateTimeForAPI(ultima),
          fechaI: formatDateTimeForAPI(fechaI),
          fechaF: formatDateTimeForAPI(fechaF),
          utc: calculateDynamicUTC(),
        };

        console.log("📤 Request body filtro:", requestBody);

        const result = await makeRequest(requestBody);

        setData(result);
        setLastRequest(requestBody);
        setError(null);
      } catch (err: any) {
        if (err.name === "AbortError") {
          console.log("🚫 Request de filtro cancelado");
          return;
        }
        console.error("❌ Error filtrando datos:", err);
        setError(err.message || "Error al filtrar los datos");
        setData(null);
      } finally {
        setLoading(false);
      }
    },
    [makeRequest]
  );

  // ✅ Función para recargar con la última configuración
  const refetch = useCallback(() => {
    if (lastRequest) {
      if (lastRequest.fechaI && lastRequest.fechaF) {
        fetchData(
          lastRequest.fechaI,
          lastRequest.fechaF,
          lastRequest.ultima || getCurrentDateTime()
        );
      } else {
        loadInitialData();
      }
    } else {
      loadInitialData();
    }
  }, [lastRequest, fetchData, loadInitialData]);

  // ✅ Función para limpiar datos
  const clearData = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setData(null);
    setError(null);
    setLastRequest(null);
    setLoading(false);
    console.log("🧹 Datos gráfica limpiados");
  }, []);

  return {
    data,
    loading,
    error,
    loadInitialData,
    fetchData,
    refetch,
    clearData,
    lastRequest,
  };
};

export default useControlGrafica;
