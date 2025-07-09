// Control Único
export interface EtapaUnica {
  id: string;
  nombreEtapa: string;
  fechaHoraInicio: string;
  temperatura: string;
  humedad: string;
}

export interface FormularioUnicoData {
  nombreProceso: string;
  fechaHoraFin: string;
  etapas: EtapaUnica[];
}

// Control Cíclico
export interface EtapaCiclica {
  id: string;
  nombreEtapa: string;
  temperatura: string;
  humedad: string;
  duracionMinutos: string;
}

export interface FormularioCiclicoData {
  nombreProceso: string;
  numeroCiclos: string;
  fechaHoraInicio: string;
  pausaEntreCiclos?: string;
  etapas: EtapaCiclica[];
}

// Control Periódico
export interface EtapaPeriodica {
  id: string;
  nombreEtapa: string;
  temperatura: string;
  humedad: string;
  duracion: string;
}

export interface FormularioPeriodicoData {
  nombreProceso: string;
  horasProceso: string;
  fechaHoraInicio: string;
  etapas: EtapaPeriodica[];
}

// Tipos para la API
export interface EtapaControl {
  duracion: number;
  hora_inicio_etapa: string;
  nombre_etapa: string;
  temperatura_etapa: number;
  humedad: number;
}

export interface ControlTemperaturaRequest {
  hora_fin_control_temperatura: string;
  hora_proceso_control_temperatura: number;
  imei_control_temperatura: string;
  lista_control_temperatura: EtapaControl[];
  proceso_control_temperatura: string;
  tipo_control_temperatura: number;
  total_control_temperatura: number;
  user_c: number;
}

export interface ControlTemperaturaResponse {
  data: {
    id_control_temperatura: number;
    imei_control_temperatura: string;
  };
  code: number;
  message: string;
}
