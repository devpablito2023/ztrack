"use client";

import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import MainContent from "./MainContent";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header fijo */}
      <Header />

      {/* Sidebar */}
      <Sidebar />

      {/* Contenido principal */}
      <MainContent>{children}</MainContent>

      {/* Footer fijo */}
      <Footer />
    </div>
  );
}
