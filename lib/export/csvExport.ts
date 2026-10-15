/**
 * Client-Side CSV Export Utility for PRAROHA'26.
 * Implements RFC-4180 compliant CSV generation and automatic browser downloads.
 */

/**
 * Escapes a cell value for CSV inclusion according to RFC-4180.
 */
function escapeCSVValue(val: unknown): string {
  if (val === null || val === undefined) {
    return "";
  }
  const str = String(val);
  // If value contains comma, quotes, or newlines, escape quotes and wrap in quotes
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Converts an array of objects into an RFC-4180 CSV string.
 */
export function convertToCSV(data: Record<string, any>[]): string {
  if (!data || data.length === 0) {
    return "";
  }

  const headers = Object.keys(data[0]);
  const headerRow = headers.map(escapeCSVValue).join(",");

  const rows = data.map((item) =>
    headers.map((header) => escapeCSVValue(item[header])).join(",")
  );

  return [headerRow, ...rows].join("\r\n");
}

/**
 * Triggers an immediate browser download of a CSV file from raw data.
 */
export function downloadCSV(data: Record<string, any>[], defaultFilename: string) {
  if (!data || data.length === 0) {
    alert("No data available to export.");
    return;
  }

  const csvContent = convertToCSV(data);
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const timestamp = new Date().toISOString().slice(0, 10);
  const filename = defaultFilename.includes(".csv")
    ? defaultFilename.replace(".csv", `_${timestamp}.csv`)
    : `${defaultFilename}_${timestamp}.csv`;

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
