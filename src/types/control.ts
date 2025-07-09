// Agregar estos tipos para el modal

export interface EtapaControl {
  nombre_etapa: string;
  hora_inicio_etapa: string;
  temperatura_etapa: number;
  humedad_etapa: number | null;
}

export interface ControlDetalleData {
  id_control_temperatura: number;
  imei_control_temperatura: string;
  proceso_control_temperatura: string;
  tipo_control_temperatura: number; // 0=Único, 1=Cíclico, 2=Periódico
  total_control_temperatura: number; // Número de etapas
  lista_control_temperatura: EtapaControl[];
  hora_fin_control_temperatura: string;
  hora_proceso_control_temperatura: number; // Horas totales
  condicion_control_temperatura: number; // 1=En proceso, 2=Completado
  estado_control_temperatura: number; // 1=Activo, 0=Inactivo
  updated_at: string;
  created_at: string;
  user_c_nombre: string; // Nombre usuario creador
  user_m_nombre: string; // Nombre usuario modificador
  user_c: number; // ID usuario creador
  user_m: number; // ID usuario modificador
}
