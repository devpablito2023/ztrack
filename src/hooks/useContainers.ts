"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { Container, ContainerResponse } from "$/types/container";

export function useContainers(empresaId: number = 85) {
  const [containers, setContainers] = useState<Container[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Refs para controlar el comportamiento
  const isInitialLoad = useRef(true);
  const lastUpdateTime = useRef<number>(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // Asegurar que siempre usamos el ID correcto
  const targetEmpresaId = empresaId === 87 ? 85 : empresaId;

  const fetchContainers = useCallback(
    async (isManualRefresh = false) => {
      try {
        // Solo mostrar loading en la carga inicial
        if (isInitialLoad.current) {
          setLoading(true);
        } else if (isManualRefresh) {
          setIsRefreshing(true);
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/contenedores/ListaDispositivoEmpresa/${targetEmpresaId}`,
          {
            cache: "no-store",
            headers: {
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data: ContainerResponse = await response.json();

        // Verificar si el componente sigue montado antes de actualizar
        if (!isMountedRef.current) return;

        // Actualizar datos de forma optimizada
        setContainers((prevContainers) => {
          const newContainers = data.data || [];

          // Si es la primera carga, establecer los datos
          if (isInitialLoad.current) {
            return newContainers;
          }

          // Para actualizaciones posteriores, solo actualizar si hay cambios reales
          const hasChanges =
            JSON.stringify(prevContainers) !== JSON.stringify(newContainers);

          return hasChanges ? newContainers : prevContainers;
        });

        setError(null);
        lastUpdateTime.current = Date.now();
      } catch (err) {
        // Solo mostrar errores en carga inicial o refresh manual
        if (isInitialLoad.current || isManualRefresh) {
          setError(err instanceof Error ? err.message : "Error desconocido");
          if (isInitialLoad.current) {
            setContainers([]);
          }
        }
        // Para actualizaciones automáticas, ignorar errores silenciosamente
      } finally {
        if (isInitialLoad.current) {
          setLoading(false);
          isInitialLoad.current = false;
        } else if (isManualRefresh) {
          setIsRefreshing(false);
        }
      }
    },
    [targetEmpresaId]
  );

  // Función para refresh manual
  const refetch = useCallback(() => {
    fetchContainers(true);
  }, [fetchContainers]);

  // Función para pausar/reanudar actualizaciones automáticas
  const pauseAutoUpdate = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resumeAutoUpdate = useCallback(() => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        if (isMountedRef.current) {
          fetchContainers(false);
        }
      }, 30000);
    }
  }, [fetchContainers]);

  useEffect(() => {
    isMountedRef.current = true;

    // Carga inicial
    fetchContainers(false);

    // Configurar actualización automática cada 30 segundos
    intervalRef.current = setInterval(() => {
      if (isMountedRef.current) {
        fetchContainers(false);
      }
    }, 30000);

    // Pausar actualizaciones cuando la pestaña no está visible
    const handleVisibilityChange = () => {
      if (document.hidden) {
        pauseAutoUpdate();
      } else {
        resumeAutoUpdate();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchContainers, pauseAutoUpdate, resumeAutoUpdate]);

  return {
    containers,
    loading,
    error,
    isRefreshing,
    refetch,
    lastUpdate: lastUpdateTime.current,
    pauseAutoUpdate,
    resumeAutoUpdate,
  };
}
