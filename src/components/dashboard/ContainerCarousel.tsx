"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "$/types/container";
import ContainerImage from "./ContainerImage";
import ContainerData from "./ContainerData";

interface ContainerCarouselProps {
  containers: Container[];
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
}

export default function ContainerCarousel({
  containers,
  currentIndex,
  onNext,
  onPrev,
}: ContainerCarouselProps) {
  const currentContainer = containers[currentIndex];

  if (!currentContainer) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
              {currentContainer.nombre_contenedor.trim()}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {currentContainer.tipo} • ID: {currentContainer.id} • Modelo:{" "}
              {currentContainer.modelo || "N/A"}
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center space-x-1">
            <button
              onClick={onPrev}
              className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title="Contenedor anterior (←)"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-500 dark:text-gray-400 px-2 min-w-[4rem] text-center">
              {currentIndex + 1} / {containers.length}
            </span>
            <button
              onClick={onNext}
              className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title="Siguiente contenedor (→)"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentContainer.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Container Image - Top */}
          <div className="h-[50vh] sm:h-[60vh] border-b border-gray-200 dark:border-gray-700 overflow-hidden">
            <ContainerImage container={currentContainer} />
          </div>

          {/* Container Data - Bottom */}
          <div className="min-h-[400px]">
            <ContainerData container={currentContainer} />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
