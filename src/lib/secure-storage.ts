// Storage seguro y oculto para datos sensibles
import { encryptData, decryptData } from "./crypto";

class SecureStorage {
  private readonly prefix = "_app_";
  private readonly keys = {
    userData: "ud_2024",
    authToken: "at_2024",
    sessionData: "sd_2024",
  };

  // Funciones auxiliares para cookies
  private setCookie(name: string, value: string, days: number = 1): void {
    if (typeof window === "undefined") return; // Verificar si estamos en el cliente

    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; secure; samesite=strict`;
  }

  private getCookie(name: string): string | null {
    if (typeof window === "undefined") return null; // Verificar si estamos en el cliente

    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  private deleteCookie(name: string): void {
    if (typeof window === "undefined") return;
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }

  // Guardar datos del usuario de forma segura
  setUserData(userData: any): void {
    const encrypted = encryptData(JSON.stringify(userData));
    if (typeof window !== "undefined") {
      sessionStorage.setItem(this.prefix + this.keys.userData, encrypted);
    }
  }

  // Obtener datos del usuario
  getUserData(): any | null {
    if (typeof window === "undefined") return null;

    const encrypted = sessionStorage.getItem(this.prefix + this.keys.userData);
    if (!encrypted) return null;

    try {
      const decrypted = decryptData(encrypted);
      return JSON.parse(decrypted);
    } catch {
      return null;
    }
  }

  // Guardar token de forma segura (sessionStorage + cookie)
  setAuthToken(token: string): void {
    const encrypted = encryptData(token);

    // Guardar en sessionStorage
    if (typeof window !== "undefined") {
      sessionStorage.setItem(this.prefix + this.keys.authToken, encrypted);
    }

    // También guardar en cookie para el middleware
    this.setCookie("auth-token", encrypted, 1); // Expira en 1 día
  }

  // Obtener token
  getAuthToken(): string | null {
    if (typeof window === "undefined") return null;

    const encrypted = sessionStorage.getItem(this.prefix + this.keys.authToken);
    if (!encrypted) return null;
    return decryptData(encrypted);
  }

  // Obtener token desde cookie (para verificaciones del lado servidor)
  getAuthTokenFromCookie(): string | null {
    const encrypted = this.getCookie("auth-token");
    if (!encrypted) return null;
    return decryptData(encrypted);
  }

  // Limpiar todos los datos (sessionStorage + cookies)
  clearAll(): void {
    // Limpiar sessionStorage
    if (typeof window !== "undefined") {
      Object.values(this.keys).forEach((key) => {
        sessionStorage.removeItem(this.prefix + key);
      });
    }

    // Limpiar cookies
    this.deleteCookie("auth-token");
  }

  // Verificar si hay sesión activa
  hasActiveSession(): boolean {
    return this.getUserData() !== null && this.getAuthToken() !== null;
  }

  // Verificar si hay sesión activa desde cookie (para middleware)
  hasActiveSessionFromCookie(): boolean {
    return this.getAuthTokenFromCookie() !== null;
  }
}

export const secureStorage = new SecureStorage();
