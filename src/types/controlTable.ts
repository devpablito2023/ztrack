// ✅ Request para la tabla
export interface ControlTableRequest {
  device: string;
  ultima: string;
  utc: number;
  fechaI?: string; // Opcional para filtros
  fechaF?: string; // Opcional para filtros
}

// ✅ Estructura de un registro de la tabla
export interface TableRecord {
  temp_supply_1: number | null;
  return_air: number | null;
  evaporation_coil: number | null;
  compress_coil_1: number | null;
  ambient_air: number | null;
  cargo_1_temp: number | null;
  cargo_2_temp: number | null;
  cargo_3_temp: number | null;
  cargo_4_temp: number | null;
  relative_humidity: number | null;
  consumption_ph_1: number | null;
  consumption_ph_2: number | null;
  consumption_ph_3: number | null;
  co2_reading: number | null;
  power_kwh: number | null;
  set_point: number | null;
  power_state: number | null;
  humidity_set_point: number | null;
  sp_ethyleno: number | null;
  stateProcess: string | null;
  ethylene: number | null;
  created_at: string;
  longitud: number | null;
  latitud: number | null;
  ripener_prueba?: number | null; // Opcional, aparece en cadena pero no en registros
  defrost_prueba?: number | null; // Opcional, aparece en cadena pero no en registros
}

// ✅ Estructura de cadena (configuración de campos)
export interface TableCadena {
  _id: number;
  set_point: number;
  return_air: number;
  temp_supply_1: number;
  ambient_air: number;
  compress_coil_1: number;
  consumption_ph_1: number;
  consumption_ph_2: number;
  consumption_ph_3: number;
  created_at: number;
  evaporation_coil: number;
  humidity_set_point: number;
  latitud: number;
  longitud: number;
  power_kwh: number;
  power_state: number;
  relative_humidity: number;
  co2_reading: number;
  ethylene: number;
  ripener_prueba: number;
  sp_ethyleno: number;
  stateProcess: number;
  defrost_prueba: number;
  cargo_1_temp: number;
  cargo_2_temp: number;
  cargo_3_temp: number;
  cargo_4_temp: number;
}

// ✅ Respuesta completa de la API
export interface ControlTableResponse {
  data: {
    graph: string; // "listas"
    table: TableRecord[];
    cadena: TableCadena;
    temperature: number;
    date: [string, string]; // [fecha_inicio, fecha_fin]
  };
  code: number;
  message: string;
}

// ✅ Return del hook
export interface UseControlTableReturn {
  data: ControlTableResponse | null;
  loading: boolean;
  error: string | null;
  loadInitialData: () => Promise<void>;
  fetchData: (fechaI: string, fechaF: string, ultima: string) => Promise<void>;
  refetch: () => void;
  clearData: () => void;
  lastRequest: Partial<ControlTableRequest> | null;
}

// ✅ Props para componentes de tabla
export interface TableControlsProps {
  onSearch: (fechaI: string, fechaF: string, ultima: string) => void;
  loading: boolean;
  onClear: () => void;
}

// ✅ Props para ControlTable con toggle de temperatura
export interface ControlTableProps {
  data: ControlTableResponse | null;
  loading: boolean;
  error: string | null;
  temperatureUnit: "C" | "F";
  onToggleTemperatureUnit: () => void;
}

// ✅ Configuración de columnas para la tabla
export interface TableColumn {
  key: keyof TableRecord;
  label: string;
  type:
    | "temperature"
    | "percentage"
    | "power"
    | "gas"
    | "state"
    | "datetime"
    | "coordinate"
    | "number";
  unit?: string;
  visible: boolean;
  sortable: boolean;
  filterable: boolean;
}

// ✅ Filtros para la tabla
export interface TableFilters {
  search: string;
  dateRange: {
    start: string;
    end: string;
  };
  temperatureRange: {
    min: number | null;
    max: number | null;
  };
  humidityRange: {
    min: number | null;
    max: number | null;
  };
  powerState: number | null; // 0, 1 o null (todos)
}

// ✅ Configuración de paginación
export interface TablePagination {
  page: number;
  pageSize: number;
  total: number;
}

// ✅ Configuración de ordenamiento
export interface TableSort {
  column: keyof TableRecord;
  direction: "asc" | "desc";
}

export type TemperatureUnit = "C" | "F";

// ✅ Props adicionales para exportación
export interface ExportActionsProps {
  data: ControlTableResponse | null;
  filteredData: TableRecord[];
  temperatureUnit: TemperatureUnit;
  visibleColumns: string[];
  loading: boolean;
}

// ✅ Filtros rápidos para controles
export interface DateFilter {
  label: string;
  value: string;
  hours: number;
}
