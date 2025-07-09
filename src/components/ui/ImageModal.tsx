"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  alt: string;
  title?: string;
}

export default function ImageModal({
  isOpen,
  onClose,
  src,
  alt,
  title,
}: ImageModalProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      // Guardar el scroll actual
      const scrollY = window.scrollY;

      // Aplicar estilos para prevenir scroll
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      return () => {
        // Restaurar scroll cuando se cierre
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Zoom con scroll del mouse - SOLO dentro del modal
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale((prev) => {
      const newScale = Math.min(Math.max(prev + delta, 0.5), 5);
      return newScale;
    });
  }, []);

  // Zoom con botones
  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 5));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  };

  // Arrastrar con mouse
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch events para móvil
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches.length === 1) {
      e.preventDefault();
      const touch = e.touches[0];
      setPosition({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y,
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black/90 flex flex-col"
          onClick={handleBackdropClick}
        >
          {/* Header - Responsive */}
          <div className="flex items-center justify-between p-3 sm:p-4 bg-white/10 backdrop-blur-sm border-b border-white/20">
            <h3 className="text-sm sm:text-lg font-semibold text-white truncate mr-4">
              {title || alt}
            </h3>

            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
              {/* Zoom Level Display */}
              <span className="text-xs sm:text-sm text-white/80 min-w-[50px] sm:min-w-[60px] text-center">
                {Math.round(scale * 100)}%
              </span>

              {/* Zoom Controls - Solo en desktop */}
              <div className="hidden sm:flex items-center space-x-1">
                <button
                  onClick={handleZoomOut}
                  className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                  title="Alejar"
                >
                  <ZoomOut className="w-4 h-4 text-white" />
                </button>

                <button
                  onClick={handleZoomIn}
                  className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                  title="Acercar"
                >
                  <ZoomIn className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Reset Button */}
              <button
                onClick={handleReset}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-white/20 transition-colors"
                title="Restablecer vista"
              >
                <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </button>

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-white/20 transition-colors"
                title="Cerrar"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Image Container - Responsive */}
          <div
            className={`flex-1 relative overflow-hidden ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="relative w-full h-full flex items-center justify-center"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transition: isDragging ? "none" : "transform 0.2s ease-out",
              }}
            >
              <Image
                src={src}
                alt={alt}
                fill
                className="object-contain select-none pointer-events-none"
                sizes="100vw"
                priority
              />
            </div>
          </div>

          {/* Footer - Responsive */}
          <div className="p-2 sm:p-4 bg-white/10 backdrop-blur-sm border-t border-white/20">
            <div className="flex items-center justify-center space-x-2 sm:space-x-4 text-xs sm:text-sm text-white/80">
              {/* Desktop instructions */}
              <div className="hidden sm:flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <span>🖱️</span>
                  <span>Scroll para zoom</span>
                </div>
                <div className="w-px h-4 bg-white/30"></div>
                <div className="flex items-center space-x-1">
                  <span>👆</span>
                  <span>Click y arrastra para mover</span>
                </div>
              </div>

              {/* Mobile instructions */}
              <div className="flex sm:hidden items-center justify-center space-x-2">
                <div className="flex items-center space-x-1">
                  <span>👆</span>
                  <span>Toca y arrastra para mover</span>
                </div>
              </div>

              {/* Mobile zoom controls */}
              <div className="flex sm:hidden items-center space-x-2 ml-4">
                <button
                  onClick={handleZoomOut}
                  className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                  title="Alejar"
                >
                  <ZoomOut className="w-4 h-4 text-white" />
                </button>

                <button
                  onClick={handleZoomIn}
                  className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                  title="Acercar"
                >
                  <ZoomIn className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
