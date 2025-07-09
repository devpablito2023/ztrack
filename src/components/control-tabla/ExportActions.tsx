"use client";

import { useCallback } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format, parseISO, isValid } from "date-fns";
import { es } from "date-fns/locale";
import type {
  ControlTableResponse,
  TableRecord,
  TemperatureUnit,
  ExportActionsProps,
} from "$/types/controlTable";

const ExportActions: React.FC<ExportActionsProps> = ({
  data,
  filteredData,
  temperatureUnit,
  visibleColumns,
  loading,
}) => {
  // ✅ Función para convertir temperatura
  const convertTemperature = useCallback(
    (temp: number): number => {
      if (temperatureUnit === "F") {
        return (temp * 9) / 5 + 32;
      }
      return temp;
    },
    [temperatureUnit]
  );

  // ✅ Función para formatear valores para exportación
  const formatValueForExport = useCallback(
    (value: any, key: string): string => {
      if (value === null || value === undefined) {
        return "N/A";
      }

      const temperatureFields = [
        "temp_supply_1",
        "return_air",
        "ambient_air",
        "evaporation_coil",
        "compress_coil_1",
        "set_point",
        "cargo_1_temp",
        "cargo_2_temp",
        "cargo_3_temp",
        "cargo_4_temp",
      ];

      if (key === "created_at") {
        try {
          const date = parseISO(value.toString());
          return isValid(date)
            ? format(date, "dd/MM/yyyy HH:mm:ss", { locale: es })
            : "Fecha inválida";
        } catch {
          return "Fecha inválida";
        }
      }

      if (temperatureFields.includes(key) && typeof value === "number") {
        const convertedTemp = convertTemperature(value);
        return `${convertedTemp.toFixed(1)}°${temperatureUnit}`;
      }

      if (key === "relative_humidity" && typeof value === "number") {
        return `${value.toFixed(1)}%`;
      }

      if (key === "power_kwh" && typeof value === "number") {
        return `${value.toFixed(2)} kWh`;
      }

      if (
        ["consumption_ph_1", "consumption_ph_2", "consumption_ph_3"].includes(
          key
        ) &&
        typeof value === "number"
      ) {
        return `${value.toFixed(2)} A`;
      }

      if (
        ["co2_reading", "ethylene", "sp_ethyleno"].includes(key) &&
        typeof value === "number"
      ) {
        return `${value.toFixed(3)} ppm`;
      }

      if (key === "power_state") {
        const stateLabels: Record<number, string> = {
          0: "Apagado",
          1: "Encendido",
        };
        return stateLabels[value] || value.toString();
      }

      if (["longitud", "latitud"].includes(key) && typeof value === "number") {
        return value.toFixed(6);
      }

      return value.toString();
    },
    [convertTemperature, temperatureUnit]
  );

  // ✅ Obtener etiquetas de columnas
  const getColumnLabel = useCallback((key: string): string => {
    const labels: Record<string, string> = {
      created_at: "Fecha/Hora",
      temp_supply_1: "Temp. Suministro",
      return_air: "Temp. Retorno",
      ambient_air: "Temp. Ambiente",
      evaporation_coil: "Temp. Evaporador",
      compress_coil_1: "Compresor",
      set_point: "Set Point",
      cargo_1_temp: "Cargo 1",
      cargo_2_temp: "Cargo 2",
      cargo_3_temp: "Cargo 3",
      cargo_4_temp: "Cargo 4",
      relative_humidity: "Humedad",
      power_kwh: "Potencia",
      power_state: "Estado",
      consumption_ph_1: "Consumo F1",
      consumption_ph_2: "Consumo F2",
      consumption_ph_3: "Consumo F3",
      co2_reading: "CO₂",
      ethylene: "Etileno",
      sp_ethyleno: "SP Etileno",
      humidity_set_point: "SP Humedad",
      stateProcess: "Estado Proceso",
      longitud: "Longitud",
      latitud: "Latitud",
    };
    return labels[key] || key;
  }, []);

  // ✅ Exportar a Excel
  const exportToExcel = useCallback(() => {
    if (!data || filteredData.length === 0) return;

    try {
      const excelData = filteredData.map((record) => {
        const row: Record<string, string> = {};
        visibleColumns.forEach((key) => {
          row[getColumnLabel(key)] = formatValueForExport(
            record[key as keyof TableRecord],
            key
          );
        });
        return row;
      });

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      const colWidths = visibleColumns.map((key) => {
        const label = getColumnLabel(key);
        return { wch: Math.max(label.length, 15) };
      });
      ws["!cols"] = colWidths;

      XLSX.utils.book_append_sheet(wb, ws, "Datos Monitoreo");

      const timestamp = format(new Date(), "yyyy-MM-dd_HH-mm-ss");
      const filename = `monitoreo_contenedor_${timestamp}.xlsx`;

      XLSX.writeFile(wb, filename);
      console.log("✅ Archivo Excel exportado:", filename);
    } catch (error) {
      console.error("❌ Error exportando a Excel:", error);
      alert("Error al exportar a Excel. Inténtalo de nuevo.");
    }
  }, [
    data,
    filteredData,
    visibleColumns,
    getColumnLabel,
    formatValueForExport,
  ]);

  // ✅ Exportar a PDF
  const exportToPDF = useCallback(() => {
    if (!data || filteredData.length === 0) return;

    try {
      const doc = new jsPDF("l", "mm", "a4");

      doc.setFontSize(16);
      doc.text("Reporte de Monitoreo de Contenedor", 20, 20);

      doc.setFontSize(10);
      const timestamp = format(new Date(), "dd/MM/yyyy HH:mm:ss", {
        locale: es,
      });
      doc.text(`Generado: ${timestamp}`, 20, 30);
      doc.text(`Registros: ${filteredData.length}`, 20, 35);
      doc.text(`Unidad Temperatura: °${temperatureUnit}`, 20, 40);

      const headers = visibleColumns.map((key) => getColumnLabel(key));
      const rows = filteredData.map((record) =>
        visibleColumns.map((key) =>
          formatValueForExport(record[key as keyof TableRecord], key)
        )
      );

      autoTable(doc, {
        head: [headers],
        body: rows,
        startY: 50,
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: 255,
          fontStyle: "bold",
        },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        columnStyles: { 0: { cellWidth: 25 } },
        margin: { top: 50, right: 10, bottom: 20, left: 10 },
        tableWidth: "auto",
        theme: "striped",
      });

      const fileTimestamp = format(new Date(), "yyyy-MM-dd_HH-mm-ss");
      const filename = `monitoreo_contenedor_${fileTimestamp}.pdf`;

      doc.save(filename);
      console.log("✅ Archivo PDF exportado:", filename);
    } catch (error) {
      console.error("❌ Error exportando a PDF:", error);
      alert("Error al exportar a PDF. Inténtalo de nuevo.");
    }
  }, [
    data,
    filteredData,
    visibleColumns,
    temperatureUnit,
    getColumnLabel,
    formatValueForExport,
  ]);

  // ✅ Imprimir tabla
  const printTable = useCallback(() => {
    if (!data || filteredData.length === 0) return;

    try {
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        alert("Por favor, permite las ventanas emergentes para imprimir.");
        return;
      }

      const timestamp = format(new Date(), "dd/MM/yyyy HH:mm:ss", {
        locale: es,
      });

      const printHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Reporte de Monitoreo de Contenedor</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; font-size: 12px; }
            .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px; }
            .info { margin-bottom: 20px; background-color: #f5f5f5; padding: 10px; border-radius: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #3b82f6; color: white; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            tr:hover { background-color: #f5f5f5; }
            .footer { margin-top: 20px; text-align: center; font-size: 10px; color: #666; }
            @media print { body { margin: 0; } .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📋 Reporte de Monitoreo de Contenedor</h1>
          </div>
          
          <div class="info">
            <p><strong>Generado:</strong> ${timestamp}</p>
            <p><strong>Total de registros:</strong> ${filteredData.length.toLocaleString()}</p>
            <p><strong>Unidad de temperatura:</strong> °${temperatureUnit}</p>
            <p><strong>Rango de fechas:</strong> ${data.data.date[0]} - ${
        data.data.date[1]
      }</p>
          </div>

          <table>
            <thead>
              <tr>
                ${visibleColumns
                  .map((key) => `<th>${getColumnLabel(key)}</th>`)
                  .join("")}
              </tr>
            </thead>
            <tbody>
              ${filteredData
                .map(
                  (record) => `
                <tr>
                  ${visibleColumns
                    .map(
                      (key) =>
                        `<td>${formatValueForExport(
                          record[key as keyof TableRecord],
                          key
                        )}</td>`
                    )
                    .join("")}
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>

          <div class="footer">
            <p>Sistema de Monitoreo de Contenedores - Generado automáticamente</p>
          </div>
        </body>
        </html>
      `;

      printWindow.document.write(printHTML);
      printWindow.document.close();

      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
      };

      console.log("✅ Tabla enviada a impresión");
    } catch (error) {
      console.error("❌ Error imprimiendo tabla:", error);
      alert("Error al imprimir. Inténtalo de nuevo.");
    }
  }, [
    data,
    filteredData,
    visibleColumns,
    temperatureUnit,
    getColumnLabel,
    formatValueForExport,
  ]);

  if (!data || filteredData.length === 0) {
    return null;
  }
  return (
    <div className="flex items-center space-x-2">
      {/* Exportar a Excel */}
      <button
        onClick={exportToExcel}
        disabled={loading}
        className="flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors disabled:cursor-not-allowed text-sm"
        title="Exportar a Excel"
      >
        <span>📊</span>
        <span className="hidden sm:inline">Excel</span>
      </button>

      {/* Exportar a PDF */}
      <button
        onClick={exportToPDF}
        disabled={loading}
        className="flex items-center space-x-2 px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg transition-colors disabled:cursor-not-allowed text-sm"
        title="Exportar a PDF"
      >
        <span>📄</span>
        <span className="hidden sm:inline">PDF</span>
      </button>

      {/* Imprimir */}
      <button
        onClick={printTable}
        disabled={loading}
        className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors disabled:cursor-not-allowed text-sm"
        title="Imprimir tabla"
      >
        <span>🖨️</span>
        <span className="hidden sm:inline">Imprimir</span>
      </button>
    </div>
  );
};

export default ExportActions;
