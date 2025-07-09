"use client";

import { useState, useCallback, useRef } from "react";
import type {
  ControlTableRequest,
  ControlTableResponse,
  UseControlTableReturn,
} from "$/types/controlTable";

const useControlTable = (): UseControlTableReturn => {
  const [data, setData] = useState<ControlTableResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRequest, setLastRequest] =
    useState<Partial<ControlTableRequest> | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  // ✅ CORREGIDO: Función para calcular UTC dinámico
  const calculateDynamicUTC = (): number => {
    const now = new Date();
    const userTimezoneOffset = now.getTimezoneOffset(); // En minutos, negativo para GMT+
    const userGMT = -userTimezoneOffset / 60; // Convertir a horas GMT

    const dynamicUTC = 300 - (5 + userGMT) * 60;

    console.log("🌍 Información de zona horaria tabla:", {
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

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    const localDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

    console.log("🕐 Fecha/hora actual tabla:", {
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

    if (dateTimeLocal.includes("T")) {
      return dateTimeLocal.length === 16
        ? `${dateTimeLocal}:00`
        : dateTimeLocal;
    }

    return `${dateTimeLocal}T00:00:00`;
  };

  // ✅ Función base para hacer requests (DRY)
  const makeRequest = useCallback(async (requestBody: ControlTableRequest) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    console.log("🚀 Enviando request tabla:", requestBody);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APIMONGODB_URL}/maduradores/DatosPollitosTabla/`,
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

    const result: ControlTableResponse = await response.json();
    console.log("✅ Datos tabla recibidos:", result);

    return result;
  }, []);

  // ✅ Función para cargar datos iniciales
  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const currentDateTime = getCurrentDateTime();
      const dynamicUTC = calculateDynamicUTC();

      const requestBody: ControlTableRequest = {
        device: "15681",
        ultima: currentDateTime,
        utc: dynamicUTC,
      };

      console.log("📤 Request body tabla final:", requestBody);

      const result = await makeRequest(requestBody);

      setData(result);
      setLastRequest(requestBody);
      setError(null);
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("🚫 Request inicial tabla cancelado");
        return;
      }
      console.error("❌ Error cargando datos iniciales tabla:", err);
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

        const requestBody: ControlTableRequest = {
          device: "15681",
          ultima: formatDateTimeForAPI(ultima),
          fechaI: formatDateTimeForAPI(fechaI),
          fechaF: formatDateTimeForAPI(fechaF),
          utc: calculateDynamicUTC(),
        };

        console.log("📤 Request body tabla filtro:", requestBody);

        const result = await makeRequest(requestBody);

        setData(result);
        setLastRequest(requestBody);
        setError(null);
      } catch (err: any) {
        if (err.name === "AbortError") {
          console.log("🚫 Request de filtro tabla cancelado");
          return;
        }
        console.error("❌ Error filtrando datos tabla:", err);
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
    console.log("🧹 Datos tabla limpiados");
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

export default useControlTable;
