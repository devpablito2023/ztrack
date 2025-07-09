"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useContainers } from "$/hooks/useContainers";
import { useToast } from "$/contexts/ToastContext";
import DashboardHeader from "./DashboardHeader";
import DashboardStats from "./DashboardStats";
import ContainerCarousel from "./ContainerCarousel";
import ContainerNavigation from "./ContainerNavigation";

export default function DashboardMain() {
  const searchParams = useSearchParams();
  const { showInfo } = useToast();

  const {
    containers,
    loading,
    error,
    isRefreshing,
    refetch,
    lastUpdate,
    pauseAutoUpdate,
    resumeAutoUpdate,
  } = useContainers(87);

  const [autoUpdatePaused, setAutoUpdatePaused] = useState(false);
  const [currentContainerIndex, setCurrentContainerIndex] = useState(0);

  // Manejar mensaje de desarrollo
  useEffect(() => {
    const devMessage = searchParams.get("dev-message");
    if (devMessage) {
      showInfo("Página en desarrollo", devMessage);

      // Limpiar la URL sin recargar la página
      const url = new URL(window.location.href);
      url.searchParams.delete("dev-message");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams, showInfo]);

  const stats = {
    alarms: containers.filter((c) => c.alarm_present === 1).length,
    process: containers.filter((c) => c.stateProcess !== "0").length,
    hours: containers.reduce((acc, c) => acc + (c.timerOfProcess || 0), 0),
  };

  const handleToggleAutoUpdate = () => {
    if (autoUpdatePaused) {
      resumeAutoUpdate();
      setAutoUpdatePaused(false);
    } else {
      pauseAutoUpdate();
      setAutoUpdatePaused(true);
    }
  };

  const nextContainer = () => {
    setCurrentContainerIndex((prev) =>
      prev < containers.length - 1 ? prev + 1 : 0
    );
  };

  const prevContainer = () => {
    setCurrentContainerIndex((prev) =>
      prev > 0 ? prev - 1 : containers.length - 1
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                Dashboard
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                Cargando datos del sistema...
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6"
              >
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                Dashboard
              </h1>
              <p className="text-sm sm:text-base text-red-600 dark:text-red-400 mt-1">
                Error: {error}
              </p>
            </div>
            <button
              onClick={refetch}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
            >
              <span>Reintentar</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (containers.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          <div className="text-center py-12">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📦</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No hay contenedores disponibles
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No se encontraron contenedores en el sistema.
                  </p>
                </div>
                <button
                  onClick={refetch}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <span>Actualizar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
        <DashboardHeader
          containersCount={containers.length}
          isRefreshing={isRefreshing}
          lastUpdate={lastUpdate ? new Date(lastUpdate).toISOString() : null}
          autoUpdatePaused={autoUpdatePaused}
          onToggleAutoUpdate={handleToggleAutoUpdate}
          onRefresh={refetch}
        />
        <DashboardStats stats={stats} />
        <ContainerCarousel
          containers={containers}
          currentIndex={currentContainerIndex}
          onNext={nextContainer}
          onPrev={prevContainer}
        />
        <ContainerNavigation
          containers={containers}
          currentIndex={currentContainerIndex}
          onSelectContainer={setCurrentContainerIndex}
        />
      </div>
    </div>
  );
}
