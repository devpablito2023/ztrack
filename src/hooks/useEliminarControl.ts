"use client";

import { useState, useCallback } from "react";
import { useAuth } from "$/hooks/useAuth";

interface EliminarControlRequest {
  especifico: number; // ✅ ID del proceso seleccionado
  id_usuario: number; // ✅ ID del usuario logueado
  tipo_usuario: number; // ✅ Permiso del usuario logueado
}

interface EliminarControlResponse {
  data: any;
  code: number;
  message: string;
}

export function useEliminarControl() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const eliminarControl = useCallback(
    async (especifico: number) => {
      if (!user) {
        setError("Usuario no autenticado");
        return { success: false, error: "Usuario no autenticado" };
      }

      try {
        setLoading(true);
        setError(null);

        // ✅ CORREGIDO: Enviando el especifico correctamente
        const requestData: EliminarControlRequest = {
          especifico: especifico, // ✅ ID del proceso seleccionado de la tabla
          id_usuario: user.id, // ✅ ID del usuario logueado
          tipo_usuario: user.permiso, // ✅ Permiso del usuario logueado
        };

        console.log("🗑️ Enviando request Eliminar Control:", requestData);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APICONTROL_URL}/Control/eliminar`,
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

        const result: EliminarControlResponse = await response.json();
        console.log("📥 Response Eliminar Control:", result);

        if (result.code === 200) {
          return { success: true, data: result.data, message: result.message };
        } else {
          throw new Error(result.message || "Error al eliminar el control");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        setError(errorMessage);
        console.error("❌ Error al eliminar control:", err);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  return {
    loading,
    error,
    eliminarControl,
  };
}
