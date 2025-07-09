"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import type { ToastData } from "$/contexts/ToastContext";

interface ToastProps extends ToastData {
  onClose: () => void;
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-800",
    iconColor: "text-green-600 dark:text-green-400",
    titleColor: "text-green-900 dark:text-green-100",
    messageColor: "text-green-700 dark:text-green-200",
    progressColor: "bg-green-500",
  },
  error: {
    icon: XCircle,
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-800",
    iconColor: "text-red-600 dark:text-red-400",
    titleColor: "text-red-900 dark:text-red-100",
    messageColor: "text-red-700 dark:text-red-200",
    progressColor: "bg-red-500",
  },
  warning: {
    icon: AlertTriangle,
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    borderColor: "border-yellow-200 dark:border-yellow-800",
    iconColor: "text-yellow-600 dark:text-yellow-400",
    titleColor: "text-yellow-900 dark:text-yellow-100",
    messageColor: "text-yellow-700 dark:text-yellow-200",
    progressColor: "bg-yellow-500",
  },
  info: {
    icon: Info,
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    iconColor: "text-blue-600 dark:text-blue-400",
    titleColor: "text-blue-900 dark:text-blue-100",
    messageColor: "text-blue-700 dark:text-blue-200",
    progressColor: "bg-blue-500",
  },
};

export default function Toast({
  type,
  title,
  message,
  duration = 5000,
  action,
  onClose,
}: ToastProps) {
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const config = toastConfig[type];
  const IconComponent = config.icon;

  // ✅ Manejar el progreso y auto-close de forma más segura
  useEffect(() => {
    if (duration <= 0) return;

    const startProgress = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(() => {
        if (!isPaused) {
          setProgress((prev) => {
            const newProgress = prev - 100 / (duration / 100);
            if (newProgress <= 0) {
              // ✅ Usar setTimeout para evitar setState durante render
              timeoutRef.current = setTimeout(() => {
                onClose();
              }, 0);
              return 0;
            }
            return newProgress;
          });
        }
      }, 100);
    };

    startProgress();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [duration, onClose, isPaused]);

  // ✅ Función para manejar el clic del botón cerrar
  const handleCloseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // ✅ Usar setTimeout para evitar setState durante render
    setTimeout(() => {
      onClose();
    }, 0);
  };

  // ✅ Función para manejar el clic del botón de acción
  const handleActionClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (action?.onClick) {
      setTimeout(() => {
        action.onClick();
      }, 0);
    }
  };

  // Función para prevenir que los clics en el toast se propaguen
  const handleToastClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`
        ${config.bgColor} ${config.borderColor}
        border rounded-xl shadow-lg overflow-hidden backdrop-blur-sm
        pointer-events-auto cursor-default
      `}
      onClick={handleToastClick}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Progress bar */}
      {duration > 0 && (
        <div className="h-1 bg-gray-200 dark:bg-gray-700">
          <motion.div
            className={`h-full ${config.progressColor}`}
            initial={{ width: "100%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start space-x-3">
          {/* Icon */}
          <div className="flex-shrink-0">
            <IconComponent className={`w-5 h-5 ${config.iconColor}`} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className={`text-sm font-semibold ${config.titleColor}`}>
              {title}
            </h4>
            {message && (
              <p className={`text-sm mt-1 ${config.messageColor}`}>{message}</p>
            )}

            {/* Action button */}
            {action && (
              <button
                onClick={handleActionClick}
                className={`
                  text-sm font-medium ${config.iconColor}
                  hover:underline mt-2 cursor-pointer
                  pointer-events-auto
                `}
              >
                {action.label}
              </button>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={handleCloseClick}
            className={`
              flex-shrink-0 p-1 rounded-lg
              ${config.iconColor}
              hover:bg-black/5 dark:hover:bg-white/5
              transition-colors cursor-pointer
              pointer-events-auto
            `}
            type="button"
            aria-label="Cerrar notificación"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
