"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  disabled?: boolean;
}

export default function Tooltip({
  content,
  children,
  position = "right",
  disabled = false,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  if (disabled) {
    return <>{children}</>;
  }

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTargetRect(rect);
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
    setTargetRect(null);
  };

  const getTooltipPosition = () => {
    if (!targetRect) return {};

    const offset = 8;
    const verticalAdjust = -12; // Mover tooltips más arriba

    switch (position) {
      case "right":
        return {
          left: targetRect.right + offset,
          top: targetRect.top + targetRect.height / 2 + verticalAdjust,
          transform: "translateY(-50%)",
        };
      case "left":
        return {
          right: window.innerWidth - targetRect.left + offset,
          top: targetRect.top + targetRect.height / 2 + verticalAdjust,
          transform: "translateY(-50%)",
        };
      case "top":
        return {
          left: targetRect.left + targetRect.width / 2,
          bottom:
            window.innerHeight -
            targetRect.top +
            offset +
            Math.abs(verticalAdjust),
          transform: "translateX(-50%)",
        };
      case "bottom":
        return {
          left: targetRect.left + targetRect.width / 2,
          top: targetRect.bottom + offset - Math.abs(verticalAdjust),
          transform: "translateX(-50%)",
        };
      default:
        return {};
    }
  };

  const getArrowPosition = () => {
    switch (position) {
      case "right":
        return "left-[-4px] top-1/2 -translate-y-1/2";
      case "left":
        return "right-[-4px] top-1/2 -translate-y-1/2";
      case "top":
        return "top-full left-1/2 -translate-x-1/2 -mt-1";
      case "bottom":
        return "bottom-full left-1/2 -translate-x-1/2 -mb-1";
      default:
        return "";
    }
  };

  return (
    <>
      <div
        className="relative inline-block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>

      {/* Portal para renderizar el tooltip fuera del sidebar */}
      {typeof window !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isVisible && targetRect && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="fixed z-[100] px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md shadow-lg dark:bg-gray-700 whitespace-nowrap pointer-events-none"
                style={getTooltipPosition()}
              >
                {content}
                <div
                  className={`absolute w-2 h-2 bg-gray-900 dark:bg-gray-700 transform rotate-45 ${getArrowPosition()}`}
                />
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
