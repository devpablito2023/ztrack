"use client";
import { motion } from "framer-motion";
import { useSidebar } from "$/contexts/SidebarContext";
import { useEffect, useState } from "react";

interface MainContentProps {
  children: React.ReactNode;
}

export default function MainContent({ children }: MainContentProps) {
  const { isCollapsed } = useSidebar();
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <motion.main
      initial={false}
      animate={{
        // Solo aplicar marginLeft en desktop, en móvil siempre 0
        marginLeft: isMobile ? 0 : isCollapsed ? 80 : 280,
        transition: { duration: 0.3, ease: "easeInOut" },
      }}
      className="min-h-screen pt-16 pb-12"
    >
      {/* Container principal */}
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Animación de entrada para el contenido */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full"
        >
          {children}
        </motion.div>
      </div>
      {/* Espaciador para evitar que el contenido se oculte detrás del footer */}
      <div className="h-12" />
    </motion.main>
  );
}
