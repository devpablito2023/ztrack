"use client";
import { useState, useEffect, useCallback } from "react";
import { Container } from "$/types/container";

export function useDashboard() {
  const [containers, setContainers] = useState<Container[]>([]);
  const [currentContainerIndex, setCurrentContainerIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [autoUpdatePaused, setAutoUpdatePaused] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContainers = useCallback(
    async (isManualRefresh = false) => {
      try {
        if (isManualRefresh) {
          setIsRefreshing(true);
        } else if (containers.length === 0) {
          setIsLoading(true);
        }

        const response = await fetch("/api/containers");
        if (!response.ok) {
          throw new Error("Error al cargar los contenedores");
        }

        const data = await response.json();
        setContainers(data.data || []);
        setLastUpdate(new Date().toISOString());
        setError(null);
      } catch (err) {
        console.error("Error fetching containers:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [containers.length]
  );

  const handleRefresh = useCallback(() => {
    fetchContainers(true);
  }, [fetchContainers]);

  const toggleAutoUpdate = useCallback(() => {
    setAutoUpdatePaused((prev) => !prev);
  }, []);

  const selectContainer = useCallback((index: number) => {
    setCurrentContainerIndex(index);
  }, []);

  const navigateContainer = useCallback(
    (direction: "next" | "prev") => {
      if (containers.length === 0) return;

      setCurrentContainerIndex((prevIndex) => {
        if (direction === "next") {
          return prevIndex >= containers.length - 1 ? 0 : prevIndex + 1;
        } else {
          return prevIndex <= 0 ? containers.length - 1 : prevIndex - 1;
        }
      });
    },
    [containers.length]
  );

  // Auto-update effect
  useEffect(() => {
    if (!autoUpdatePaused) {
      const interval = setInterval(() => {
        fetchContainers(false);
      }, 30000); // 30 segundos

      return () => clearInterval(interval);
    }
  }, [autoUpdatePaused, fetchContainers]);

  // Initial load
  useEffect(() => {
    fetchContainers(false);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        navigateContainer("prev");
      } else if (event.key === "ArrowRight") {
        navigateContainer("next");
      } else if (event.key === "r" || event.key === "R") {
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          handleRefresh();
        }
      } else if (event.key === " ") {
        event.preventDefault();
        toggleAutoUpdate();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [navigateContainer, handleRefresh, toggleAutoUpdate]);

  // Calculate stats
  const stats = {
    alarms: containers.filter((c) => c.alarm_present === 1).length,
    process: containers.filter((c) => c.stateProcess !== "0").length,
    hours: containers.reduce((acc, c) => acc + (c.timerOfProcess || 0), 0),
  };

  const currentContainer = containers[currentContainerIndex] || null;

  return {
    containers,
    currentContainer,
    currentContainerIndex,
    isLoading,
    isRefreshing,
    lastUpdate,
    autoUpdatePaused,
    error,
    stats,
    handleRefresh,
    toggleAutoUpdate,
    selectContainer,
    navigateContainer,
  };
}
