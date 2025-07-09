"use client";
import { useState, useEffect, useCallback } from "react";

interface ControlTemperatura {
  imei_control_temperatura: string;
  proceso_control_temperatura: string;
  tipo_control_temperatura: number;
  total_control_temperatura: number;
  condicion_control_temperatura: number; // 1 = en proceso, 0 = completado
  estado_control_temperatura: number; // 0 = inactivo, 1 = activo
}

interface ControlResponse {
  data: {
    fecha_inicio: string;
    fecha_fin: string;
    resultado: ControlTemperatura[];
  };
  code: number;
  message: string;
}

interface UseControlAutomaticoProps {
  id_usuario: number;
  tipo_usuario: number;
}

export function useControlAutomatico({
  id_usuario,
  tipo_usuario,
}: UseControlAutomaticoProps) {
  const [controles, setControles] = useState<ControlTemperatura[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  const fetchControles = useCallback(async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_APICONTROL_URL;
      if (!apiUrl) {
        throw new Error("URL de API de control no configurada");
      }

      const response = await fetch(`${apiUrl}/Control/listar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          especifico: 0, // 0 para obtener todos los controles
          id_usuario,
          tipo_usuario,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data: ControlResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Error en la respuesta del servidor");
      }

      setControles(data.data.resultado || []);
      setLastUpdate(new Date().toISOString());
      setError(null);
    } catch (err) {
      console.error("Error fetching controles:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [id_usuario, tipo_usuario]);

  const refetch = useCallback(async () => {
    setIsRefreshing(true);
    await fetchControles();
  }, [fetchControles]);

  useEffect(() => {
    fetchControles();
  }, [fetchControles]);

  return {
    controles,
    loading,
    error,
    isRefreshing,
    refetch,
    lastUpdate,
  };
}
