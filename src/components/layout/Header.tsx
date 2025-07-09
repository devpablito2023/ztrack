"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Sun,
  Moon,
  Monitor,
  LogOut,
  User,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "$/hooks/useAuth";
import { useTheme } from "$/contexts/ThemeContext";
import { useSidebar } from "$/contexts/SidebarContext";
import Tooltip from "$/components/ui/Tooltip";

export default function Header() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toggleSidebar, setMobileOpen } = useSidebar();

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  const themeOptions = [
    { value: "light", label: "Claro", icon: Sun },
    { value: "dark", label: "Oscuro", icon: Moon },
    { value: "system", label: "Sistema", icon: Monitor },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Left side - Menu button */}
        <div className="flex items-center space-x-4">
          <Tooltip content="Alternar menú">
            <button
              onClick={() => {
                toggleSidebar();
                setMobileOpen(false);
              }}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors hidden md:block"
            >
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </Tooltip>

          <Tooltip content="Abrir menú móvil">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors md:hidden"
            >
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </Tooltip>

          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            ZGROUP
          </h1>
        </div>

        {/* Right side - User menu and theme selector */}
        <div className="flex items-center space-x-4">
          {/* Theme Selector */}
          <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {themeOptions.map((option) => {
              const Icon = option.icon;
              return (
                <Tooltip key={option.value} content={option.label}>
                  <button
                    onClick={() => setTheme(option.value as any)}
                    className={`p-2 rounded-md transition-colors ${
                      theme === option.value
                        ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                </Tooltip>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="relative">
            <Tooltip content="Menú de usuario" disabled={isUserMenuOpen}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
                  {user?.username || "Usuario"}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform ${
                    isUserMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </Tooltip>

            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1"
                >
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.username || "Usuario"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.email || "usuario@ejemplo.com"}
                    </p>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Cerrar Sesión</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isUserMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/20 md:hidden"
            onClick={() => setIsUserMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </header>
  );
}
