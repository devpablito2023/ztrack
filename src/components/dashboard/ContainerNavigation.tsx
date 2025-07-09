"use client";
import { AlertTriangle, Wifi, WifiOff } from "lucide-react";
import { Container } from "$/types/container";

interface ContainerNavigationProps {
  containers: Container[];
  currentIndex: number;
  onSelectContainer: (index: number) => void;
}

export default function ContainerNavigation({
  containers,
  currentIndex,
  onSelectContainer,
}: ContainerNavigationProps) {
  const formatTemp = (temp: number | null) => {
    if (temp === null) return "NA";
    return `${temp.toFixed(1)}°F`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Lista de Contenedores ({containers.length})
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Haz clic en un contenedor para verlo en detalle
        </p>
      </div>

      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {containers.map((container, index) => (
            <button
              key={container.id}
              onClick={() => onSelectContainer(index)}
              className={`text-left p-4 rounded-lg transition-all duration-200 border-2 ${
                index === currentIndex
                  ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500 shadow-md"
                  : "bg-gray-50 dark:bg-gray-700/50 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-sm"
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {container.nombre_contenedor.trim()}
                  </h4>
                  {container.alarm_present === 1 && (
                    <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  {container.power_state === 1 ? (
                    <Wifi className="w-4 h-4 text-green-500" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-red-500" />
                  )}
                  <div
                    className={`w-2 h-2 rounded-full ${
                      container.power_state === 1
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  />
                </div>
              </div>

              {/* Temperature Data */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Set Point:
                  </span>
                  <span className="text-xs font-medium text-gray-900 dark:text-white">
                    {formatTemp(container.set_point)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Return Air:
                  </span>
                  <span className="text-xs font-medium text-gray-900 dark:text-white">
                    {formatTemp(container.return_air)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Supply Air:
                  </span>
                  <span className="text-xs font-medium text-gray-900 dark:text-white">
                    {formatTemp(container.temp_supply_1)}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {container.tipo}
                </span>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {container.capacity_load}%
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
