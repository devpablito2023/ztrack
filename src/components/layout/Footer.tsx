"use client";

import { motion } from "framer-motion";
import { Heart, Code, Zap } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-20 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between h-12 px-4 text-sm">
        {/* Left side - Copyright */}
        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
          <span>© {currentYear} ZGROUP</span>
          <span className="hidden sm:inline">- Sistema de Control</span>
        </div>

        {/* Center - Made with love (hidden on mobile) */}
        <motion.div
          className="hidden md:flex items-center space-x-1 text-gray-500 dark:text-gray-500"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <span className="text-xs">Hecho con</span>
          <Heart className="w-3 h-3 text-red-500 fill-current" />
          <span className="text-xs">y</span>
          <Code className="w-3 h-3 text-blue-500" />
        </motion.div>

        {/* Right side - Status */}
        <div className="flex items-center space-x-2">
          <motion.div
            className="flex items-center space-x-1"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Zap className="w-3 h-3 text-green-500" />
            <span className="text-xs text-gray-600 dark:text-gray-400 hidden sm:inline">
              Sistema Activo
            </span>
          </motion.div>

          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        </div>
      </div>
    </footer>
  );
}
