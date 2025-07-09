"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "$/hooks/useAuth";
import DashboardLayout from "$/components/layout/DashboardLayout";
import { motion } from "framer-motion";

const AUTH_ROUTES = ["/login"];
const PUBLIC_ROUTES = ["/"];

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  // Si es ruta de auth o pública, mostrar sin layout
  if (isAuthRoute || isPublicRoute) {
    return <>{children}</>;
  }

  // Si está cargando, mostrar loading
  if (isLoading) {
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
            Verificando autenticación...
          </p>
        </motion.div>
      </div>
    );
  }

  // Si no está autenticado, no mostrar nada
  if (!isAuthenticated) {
    return null;
  }

  // ✅ SOLO pasar children al DashboardLayout
  return <DashboardLayout>{children}</DashboardLayout>;
}
