"use client";
import Image from "next/image";
import { useState } from "react";

interface OptimizedContainerImageProps {
  containerName: string;
  containerType?: "reefer" | "dry" | "tank";
  className?: string;
  priority?: boolean;
  onClick?: () => void;
}

export default function OptimizedContainerImage({
  containerName,
  containerType = "reefer",
  className = "",
  priority = false,
  onClick,
}: OptimizedContainerImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Una sola imagen por tipo - Next.js se encarga de las resoluciones
  const imageMap = {
    reefer: "/images/reefer-container.png",
    dry: "/images/containers/dry-container.jpg",
    tank: "/images/containers/tank-container.jpg",
  };

  // Fallback si no existe la imagen específica
  const fallbackImage = "/images/reefer-container.png"; // Tu imagen actual
  const imageSrc = imageMap[containerType] || fallbackImage;

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  // Fallback component
  const ImageFallback = () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800">
      <div className="text-center p-4">
        <div className="w-12 h-12 mx-auto mb-3 bg-blue-500 rounded-lg flex items-center justify-center">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
        <p className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">
          Contenedor {containerType.toUpperCase()}
        </p>
        <p className="text-xs text-blue-600 dark:text-blue-400">
          {containerName}
        </p>
      </div>
    </div>
  );

  // Loading component
  const ImageLoading = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
      <div className="flex flex-col items-center space-y-2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="text-xs text-gray-500 dark:text-gray-400">Cargando...</p>
      </div>
    </div>
  );

  return (
    <div
      className={`relative overflow-hidden cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 group ${className}`}
      onClick={onClick}
    >
      {/* Loading State */}
      {imageLoading && <ImageLoading />}

      {/* Error State */}
      {imageError ? (
        <ImageFallback />
      ) : (
        <>
          <Image
            src={imageSrc}
            alt={`Contenedor ${containerType} ${containerName}`}
            fill
            className={`object-cover group-hover:scale-105 transition-all duration-200 ${
              imageLoading ? "opacity-0" : "opacity-100"
            }`}
            // Next.js optimiza automáticamente para estas resoluciones
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            onError={handleImageError}
            onLoad={handleImageLoad}
            quality={85} // Next.js optimiza la calidad automáticamente
          />

          {/* Overlay mejorado */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="bg-white/90 dark:bg-gray-900/90 rounded-full p-2 sm:p-3 backdrop-blur-sm">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Badge del tipo de contenedor */}
          <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium backdrop-blur-sm">
            {containerType.toUpperCase()}
          </div>

          {/* Badge del nombre */}
          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium backdrop-blur-sm">
            {containerName}
          </div>
        </>
      )}
    </div>
  );
}
