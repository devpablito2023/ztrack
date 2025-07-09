"use client";

import { useState, useCallback } from "react";
import { useAuth } from "$/hooks/useAuth";

interface VerControlRequest {
  especifico: number; // ✅ ID del proceso seleccionado
  id_usuario: number; // ✅ ID del usuario logueado
  tipo_usuario: number; // ✅ Permiso del usuario logueado
}

interface VerControlResponse {
  data: any;
  code: number;
  message: string;
}

export function useVerControl() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const verControl = useCallback(
    async (especifico: number) => {
      if (!user) {
        setError("Usuario no autenticado");
        return { success: false, error: "Usuario no autenticado" };
      }

      try {
        setLoading(true);
        setError(null);

        // ✅ CORREGIDO: Enviando el especifico correctamente
        const requestData: VerControlRequest = {
          especifico: especifico, // ✅ ID del proceso seleccionado de la tabla
          id_usuario: user.id, // ✅ ID del usuario logueado
          tipo_usuario: user.permiso, // ✅ Permiso del usuario logueado
        };

        console.log("🔍 Enviando request Ver Control:", requestData);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APICONTROL_URL}/Control/ver`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
          }
        );

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const result: VerControlResponse = await response.json();
        console.log("📥 Response Ver Control:", result);

        if (result.code === 200) {
          setData(result.data);
          return { success: true, data: result.data };
        } else {
          throw new Error(result.message || "Error al obtener el control");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        setError(errorMessage);
        console.error("❌ Error al ver control:", err);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const clearData = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    verControl,
    clearData,
  };
}
