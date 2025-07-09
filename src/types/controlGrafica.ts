export interface ControlGraficaRequest {
  device: string;
  empresa?: number;
  page?: number;
  size?: number;
  utc: number;
  fechaF?: string;
  fechaI?: string;
  ultima: string;
}

export interface GraphDataPoint {
  data: (string | number | null)[];
  config: [string, boolean, string, number]; // [label, visible, color, configType]
}

export interface GraphData {
  // Temperaturas (configType: 1)
  set_point: GraphDataPoint;
  return_air: GraphDataPoint;
  cargo_1_temp: GraphDataPoint;
  cargo_2_temp: GraphDataPoint;
  cargo_3_temp: GraphDataPoint;
  cargo_4_temp: GraphDataPoint;
  temp_supply_1: GraphDataPoint;
  ambient_air: GraphDataPoint;
  evaporation_coil: GraphDataPoint;

  // Porcentajes/Humedad (configType: 2)
  relative_humidity: GraphDataPoint;
  co2_reading: GraphDataPoint;
  defrost_prueba: GraphDataPoint;

  // Gases (configType: 3)
  ethylene: GraphDataPoint;
  sp_ethyleno: GraphDataPoint;

  // Estados (configType: 4)
  power_state: GraphDataPoint;
  stateProcess: GraphDataPoint;

  // Fechas (configType: 0)
  created_at: GraphDataPoint;

  // Índice dinámico para otros campos
  [key: string]: GraphDataPoint;
}

export interface ControlGraficaResponse {
  code: number;
  message: string;
  data: {
    graph: GraphData;
    table: any[];
    cadena: string[];
    temperature: number | string;
    date: [string, string];
  };
}

// ✅ Tipo para las leyendas del gráfico (ahora dinámicas)
export interface LegendItem {
  key: string;
  label: string;
  visible: boolean;
  color: string;
  yAxisID: string;
  type: "temperature" | "percentage" | "gas" | "state";
  configType: number;
  unit?: string;
}

export interface GraphControlsProps {
  onSearch: (fechaI: string, fechaF: string, ultima: string) => void;
  loading: boolean;
  onClear: () => void;
}

export interface DateFilter {
  label: string;
  value: string;
  hours: number;
}

export interface LegendConfig {
  key: string;
  label: string;
  visible: boolean;
  color: string;
  yAxisID: string;
  type: "temperature" | "percentage" | "gas" | "state";
  configType: number;
  unit?: string;
}

export type TemperatureUnit = "C" | "F";

export interface GraphLegendsProps {
  legends: LegendItem[];
  onToggleLegend: (key: string) => void;
  temperatureUnit: TemperatureUnit;
  onToggleTemperatureUnit: () => void;
}

export interface GraphChartProps {
  data: ControlGraficaResponse | null;
  loading: boolean;
  error: string | null;
  legends: LegendItem[];
  temperatureUnit: TemperatureUnit;
}

export interface UseControlGraficaReturn {
  data: ControlGraficaResponse | null;
  loading: boolean;
  error: string | null;
  loadInitialData: () => Promise<void>;
  fetchData: (fechaI: string, fechaF: string, ultima: string) => Promise<void>;
  refetch: () => void;
  clearData: () => void;
  lastRequest: Partial<ControlGraficaRequest> | null;
}
