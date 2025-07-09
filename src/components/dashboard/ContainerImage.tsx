"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { Power, AlertTriangle } from "lucide-react";
import { Container } from "$/types/container";

interface ContainerImageProps {
  container: Container;
}

export default function ContainerImage({ container }: ContainerImageProps) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({
    x: 0,
    y: 0,
    startX: 0,
    startY: 0,
  });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Bloquear scroll de la página cuando el mouse está sobre la imagen
  useEffect(() => {
    const preventScroll = (e: WheelEvent) => {
      if (isHovered) {
        e.preventDefault();
      }
    };
    document.addEventListener("wheel", preventScroll, { passive: false });
    return () => document.removeEventListener("wheel", preventScroll);
  }, [isHovered]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((prev) => Math.min(Math.max(prev + delta, 0.5), 3));
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setIsDragging(false);
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({
        x: e.clientX,
        y: e.clientY,
        startX: position.x,
        startY: position.y,
      });
    },
    [position]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        setPosition({
          x: dragStart.startX + deltaX,
          y: dragStart.startY + deltaY,
        });
      }
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDoubleClick = useCallback(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[200px]"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onDoubleClick={handleDoubleClick}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    >
      {/* Status Indicators */}
      <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
        <div
          className={`flex items-center space-x-2 px-2 py-1 rounded-full shadow-lg text-xs ${
            container.power_state === 1
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          <Power className="w-3 h-3" />
          <span className="font-medium">
            {container.power_state === 1 ? "ON" : "OFF"}
          </span>
        </div>
        {container.alarm_present === 1 && (
          <div className="flex items-center space-x-2 px-2 py-1 bg-red-600 text-white rounded-full shadow-lg animate-pulse text-xs">
            <AlertTriangle className="w-3 h-3" />
            <span className="font-medium">ALARMA</span>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="absolute top-4 right-4 z-10 bg-black/70 text-white px-2 py-1 rounded-lg text-xs">
        Scroll: Zoom • Doble click: Reset
      </div>

      {/* Zoom Level */}
      {zoom !== 1 && (
        <div className="absolute bottom-4 right-4 z-10 bg-black/70 text-white px-2 py-1 rounded-lg">
          <span className="text-xs font-medium">{Math.round(zoom * 100)}%</span>
        </div>
      )}

      {/* Container Info */}
      <div className="absolute bottom-4 left-4 z-10 bg-black/70 text-white px-3 py-1 rounded-lg backdrop-blur-sm">
        <div className="text-xs font-medium">
          {container.nombre_contenedor.trim()}
        </div>
        <div className="text-xs text-gray-300">{container.tipo}</div>
      </div>

      {/* Image Container - ✅ AGREGADO relative */}
      <div className="absolute inset-0">
        <div
          className="relative w-full h-full transition-transform duration-200 ease-out" // ✅ Agregué relative
          style={{
            transform: `scale(${zoom}) translate(${position.x / zoom}px, ${
              position.y / zoom
            }px)`,
          }}
        >
          <Image
            src={`/images/reefer-container.png?v=${Date.now()}`}
            alt={`Contenedor ${container.tipo}`}
            fill
            className="object-contain select-none"
            priority
            draggable={false}
            sizes="100vw"
          />
        </div>
      </div>
    </div>
  );
}
