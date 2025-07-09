"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useSidebar } from "$/contexts/SidebarContext";
import { navigationConfig } from "$/config/navigation";
import Tooltip from "$/components/ui/Tooltip";
import { useEffect, useMemo, useCallback, memo } from "react";

// Componente memoizado para los items de navegación
const NavigationItem = memo(
  ({
    item,
    isActive,
    isCollapsed,
    onNavigate,
  }: {
    item: any;
    isActive: boolean;
    isCollapsed: boolean;
    onNavigate: () => void;
  }) => {
    const Icon = item.icon;
    const linkContent = (
      <Link
        href={item.href}
        className={`
        flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
        ${
          isActive
            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        }
        ${isCollapsed ? "justify-center" : ""}
      `}
        onClick={onNavigate}
      >
        <Icon
          className={`
          w-5 h-5 flex-shrink-0 transition-colors
          ${
            isActive
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
          }
        `}
        />
        <AnimatePresence>
          {!isCollapsed && (
            <motion.span
              key={`item-${item.id}`}
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="font-medium whitespace-nowrap overflow-hidden"
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>
        {/* Badge */}
        {!isCollapsed && item.badge && (
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="ml-auto bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs px-2 py-0.5 rounded-full"
          >
            {item.badge}
          </motion.span>
        )}
      </Link>
    );

    return (
      <li>
        {isCollapsed ? (
          <Tooltip content={item.label} position="right">
            {linkContent}
          </Tooltip>
        ) : (
          linkContent
        )}
      </li>
    );
  }
);

NavigationItem.displayName = "NavigationItem";

// Componente memoizado para los grupos de navegación
const NavigationGroup = memo(
  ({
    group,
    pathname,
    isCollapsed,
    onNavigate,
  }: {
    group: any;
    pathname: string;
    isCollapsed: boolean;
    onNavigate: () => void;
  }) => {
    return (
      <div key={group.id}>
        {/* Título del grupo */}
        <AnimatePresence>
          {!isCollapsed && group.label && (
            <motion.h3
              key={`group-${group.id}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 overflow-hidden"
            >
              {group.label}
            </motion.h3>
          )}
        </AnimatePresence>
        {/* Items del grupo */}
        <ul className="space-y-1">
          {group.items.map((item) => (
            <NavigationItem
              key={item.id}
              item={item}
              isActive={pathname === item.href}
              isCollapsed={isCollapsed}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      </div>
    );
  }
);

NavigationGroup.displayName = "NavigationGroup";

// Componente principal del Sidebar
const Sidebar = memo(() => {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar, isMobileOpen, setMobileOpen } =
    useSidebar();

  // Handlers memoizados
  const handleToggleSidebar = useCallback(() => {
    toggleSidebar();
  }, [toggleSidebar]);

  const handleCloseMobile = useCallback(() => {
    setMobileOpen(false);
  }, [setMobileOpen]);

  const handleOverlayClick = useCallback(() => {
    setMobileOpen(false);
  }, [setMobileOpen]);

  const handleNavigate = useCallback(() => {
    if (isMobileOpen) {
      setMobileOpen(false);
    }
  }, [isMobileOpen, setMobileOpen]);

  // Cerrar sidebar móvil al cambiar de ruta
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname, setMobileOpen]);

  // Cerrar sidebar móvil al hacer clic fuera
  useEffect(() => {
    if (!isMobileOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("mobile-sidebar");
      const target = event.target as Node;
      if (sidebar && !sidebar.contains(target)) {
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileOpen, setMobileOpen]);

  // Memoizar el contenido del sidebar
  const sidebarContent = useMemo(() => {
    return (
      <div className="flex flex-col h-full">
        {/* Header del Sidebar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                key="brand"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center space-x-2 overflow-hidden"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">Z</span>
                </div>
                <span className="font-bold text-lg text-gray-900 dark:text-white whitespace-nowrap">
                  ZGROUP
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Botón de colapsar - Solo desktop */}
          <Tooltip content={isCollapsed ? "Expandir menú" : "Colapsar menú"}>
            <button
              onClick={handleToggleSidebar}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors hidden md:flex"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </Tooltip>
          {/* Botón de cerrar - Solo móvil */}
          <button
            onClick={handleCloseMobile}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors md:hidden"
          >
            <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
        {/* Navegación */}
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto scrollbar-thin">
          {navigationConfig.map((group) => (
            <NavigationGroup
              key={group.id}
              group={group}
              pathname={pathname}
              isCollapsed={isCollapsed}
              onNavigate={handleNavigate}
            />
          ))}
        </nav>
        {/* Footer del Sidebar */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                key="footer"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="text-xs text-gray-500 dark:text-gray-400 text-center overflow-hidden"
              >
                © 2024 ZGROUP
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }, [
    isCollapsed,
    pathname,
    handleToggleSidebar,
    handleCloseMobile,
    handleNavigate,
  ]);

  return (
    <>
      {/* Sidebar Desktop */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 top-0 bottom-0 z-50 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-sm hidden md:block"
      >
        {sidebarContent}
      </motion.aside>
      {/* Overlay móvil */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={handleOverlayClick}
          />
        )}
      </AnimatePresence>
      {/* Sidebar Móvil */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.aside
            id="mobile-sidebar"
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed left-0 top-0 bottom-0 z-50 w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-lg md:hidden"
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
});

Sidebar.displayName = "Sidebar";

export default Sidebar;
