import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decryptData } from "./lib/crypto";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas públicas que no necesitan autenticación
  const publicRoutes = ["/login", "/"];

  // ✅ NUEVO: Rutas en desarrollo
  const developmentRoutes = ["/manual-control", "/cycle-control"];

  // Si es una ruta pública, permitir acceso
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // ✅ NUEVO: Manejar rutas en desarrollo ANTES de verificar autenticación
  if (developmentRoutes.includes(pathname)) {
    // Verificar autenticación primero
    const encryptedToken = request.cookies.get("auth-token")?.value;

    if (!encryptedToken) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const token = decryptData(encryptedToken);
      if (!token) {
        const loginUrl = new URL("/login", request.url);
        return NextResponse.redirect(loginUrl);
      }
    } catch {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Si está autenticado, redirigir al dashboard con mensaje
    const dashboardUrl = new URL("/dashboard", request.url);
    dashboardUrl.searchParams.set(
      "dev-message",
      `La página ${pathname} está en desarrollo`
    );
    return NextResponse.redirect(dashboardUrl);
  }

  // Verificar si hay token en las cookies
  const encryptedToken = request.cookies.get("auth-token")?.value;

  // Si no hay token, redireccionar al login
  if (!encryptedToken) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Verificar si el token se puede desencriptar (validación básica)
  try {
    const token = decryptData(encryptedToken);
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  } catch {
    // Si no se puede desencriptar, redireccionar al login
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Si hay token válido, permitir acceso
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Proteger todas las rutas excepto:
     * - api (API routes)
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico
     * - login (página de login)
     * - / (página principal)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|login|^/$).*)",
  ],
};
