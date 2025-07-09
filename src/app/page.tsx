"use client";

import { useEffect } from "react";
import { useAuth } from "$/hooks/useAuth";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }
  }, [isAuthenticated, isLoading, router]);

  // Mostrar loading mientras se determina la redirección
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
          <motion.span
            className="text-white font-bold text-2xl"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            Z
          </motion.span>
        </div>
        <h1 className="text-2xl font-bold mb-4">ZGROUP LinkControl</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {isLoading ? "Verificando autenticación..." : "Redirigiendo..."}
        </p>
      </motion.div>
    </div>
  );
}
