"use client";
import { useState, useEffect } from "react";

interface ImageVariant {
  src: string;
  width: number;
  height: number;
  quality: number;
}

export function useContainerImages(containerType: string = "reefer") {
  const [availableImages, setAvailableImages] = useState<ImageVariant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkImageAvailability = async () => {
      const imageVariants: Record<string, ImageVariant[]> = {
        reefer: [
          {
            src: "/images/containers/reefer-hd.jpg",
            width: 1920,
            height: 1080,
            quality: 90,
          },
          {
            src: "/images/containers/reefer-md.jpg",
            width: 1280,
            height: 720,
            quality: 85,
          },
          {
            src: "/images/containers/reefer-sm.jpg",
            width: 640,
            height: 360,
            quality: 80,
          },
          {
            src: "/images/reefer-container.jpg",
            width: 800,
            height: 600,
            quality: 75,
          }, // Fallback
        ],
        dry: [
          {
            src: "/images/containers/dry-hd.jpg",
            width: 1920,
            height: 1080,
            quality: 90,
          },
          {
            src: "/images/containers/dry-md.jpg",
            width: 1280,
            height: 720,
            quality: 85,
          },
          {
            src: "/images/containers/dry-sm.jpg",
            width: 640,
            height: 360,
            quality: 80,
          },
        ],
        tank: [
          {
            src: "/images/containers/tank-hd.jpg",
            width: 1920,
            height: 1080,
            quality: 90,
          },
          {
            src: "/images/containers/tank-md.jpg",
            width: 1280,
            height: 720,
            quality: 85,
          },
          {
            src: "/images/containers/tank-sm.jpg",
            width: 640,
            height: 360,
            quality: 80,
          },
        ],
      };

      const variants = imageVariants[containerType] || imageVariants.reefer;
      const available: ImageVariant[] = [];

      // Verificar qué imágenes están disponibles
      for (const variant of variants) {
        try {
          const response = await fetch(variant.src, { method: "HEAD" });
          if (response.ok) {
            available.push(variant);
          }
        } catch (error) {
          // Imagen no disponible, continuar con la siguiente
          continue;
        }
      }

      setAvailableImages(available);
      setIsLoading(false);
    };

    checkImageAvailability();
  }, [containerType]);

  return { availableImages, isLoading };
}
