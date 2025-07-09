import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // --- AÑADE ESTE BLOQUE ---
  eslint: {
    // ADVERTENCIA: Esto permite que las compilaciones de producción se completen
    // con éxito incluso si tu proyecto tiene errores de ESLint.
    ignoreDuringBuilds: true,
  },
  // ✅ Desactivar StrictMode para ver las animaciones claramente
  reactStrictMode: false,

  webpack: (config, { dev, isServer }) => {
    
    if (dev && !isServer) {
      // Resolver conflictos de case-sensitivity en Windows
      config.resolve.symlinks = false;
      // Configuración adicional para Windows
      config.resolve.cacheWithContext = false;
    }
    return config;
  },

  // Configuración de imágenes optimizada para tus contenedores
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [360, 600, 720, 800, 1080, 1280, 1920],
    // Formatos optimizados
    formats: ["image/webp", "image/avif"],
    // Configuración de caché
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 días
    // Dominios externos para futuro escalamiento
    domains: [],
    // Patrones remotos para CDN futuro
    remotePatterns: [],
    // No deshabilitar optimización
    unoptimized: false,
  },

  // Configuración experimental
  experimental: {
    caseSensitiveRoutes: false,
    optimizePackageImports: ["lucide-react"],
  },

  // Configuración para desarrollo
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },

  // Headers para caché de imágenes
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Compresión habilitada
  compress: true,
};

export default nextConfig;
