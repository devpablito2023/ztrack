"use client";
import { useState, useCallback, useEffect } from "react";
import bcrypt from "bcryptjs";
import { secureStorage } from "$/lib/secure-storage";
import type {
  LoginRequest,
  LoginResponse,
  LoginError,
  AuthState,
} from "$/types/auth";

const BASE_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://161.132.206.104:9010";

interface ApiPasswordResponse {
  data: {
    password: string;
  };
  code: number;
  message: string;
}

interface ApiUserResponse {
  data: {
    id: number;
    usuario: string;
    apellidos: string;
    nombres: string;
    estado: number;
    permiso: number;
    correo: string;
    password: string;
    ultimo_acceso: string;
    created_at: string;
    updated_at: string;
    c_f: number;
    user_crea: number;
    empresa_id: number;
  };
  code: number;
  message: string;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    error: null,
  });

  // Cargar datos almacenados al inicializar
  useEffect(() => {
    const loadStoredAuth = () => {
      try {
        const userData = secureStorage.getUserData();
        const hasActiveSession = secureStorage.hasActiveSession();

        setAuthState((prev) => ({
          ...prev,
          user: userData,
          token: hasActiveSession ? "authenticated" : null,
          isLoading: false,
        }));
      } catch (error) {
        setAuthState((prev) => ({
          ...prev,
          user: null,
          token: null,
          isLoading: false,
          error: "Error al cargar sesión",
        }));
      }
    };

    loadStoredAuth();
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // 1. Extraer contraseña hasheada de la API
      const passwordResponse = await fetch(
        `${BASE_API_URL}/usuarios/extraerPass/${username}`
      );

      if (!passwordResponse.ok) {
        throw new Error("Usuario no encontrado");
      }

      const passwordData: ApiPasswordResponse = await passwordResponse.json();

      // 2. Extraer datos del usuario
      const userResponse = await fetch(`${BASE_API_URL}/usuarios/${username}`);

      if (!userResponse.ok) {
        throw new Error("Error al obtener datos del usuario");
      }

      const userData: ApiUserResponse = await userResponse.json();

      // 3. Comparar contraseña usando bcrypt
      const isPasswordValid = await bcrypt.compare(
        password,
        passwordData.data.password
      );

      if (!isPasswordValid) {
        throw new Error("Contraseña incorrecta");
      }

      // 4. Verificar estado del usuario
      if (userData.data.estado !== 1) {
        throw new Error("Usuario inactivo");
      }

      // 5. Preparar datos del usuario
      const userToStore = {
        id: userData.data.id,
        username: userData.data.usuario,
        email: userData.data.correo,
        nombres: userData.data.nombres,
        apellidos: userData.data.apellidos,
        permiso: userData.data.permiso,
        empresa_id: userData.data.empresa_id,
      };

      // 6. Guardar usando secureStorage (maneja sessionStorage + cookies)
      secureStorage.setUserData(userToStore);
      secureStorage.setAuthToken("authenticated");

      // 7. Actualizar estado
      setAuthState({
        user: userToStore,
        token: "authenticated",
        isLoading: false,
        error: null,
      });

      // 8. Pequeña pausa para asegurar que todo se guarde
      await new Promise((resolve) => setTimeout(resolve, 100));

      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";

      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));

      return { success: false, error: errorMessage };
    }
  }, []);

  const logout = useCallback(() => {
    // Limpiar todo usando secureStorage
    secureStorage.clearAll();

    // Actualizar estado
    setAuthState({
      user: null,
      token: null,
      isLoading: false,
      error: null,
    });
  }, []);

  const isAuthenticated = authState.user !== null && authState.token !== null;

  return {
    ...authState,
    login,
    logout,
    isAuthenticated,
  };
}
