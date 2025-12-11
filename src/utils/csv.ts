import { LogData } from "../types/index";

export function exportToCSV(data: LogData[]): void {
  const header = [
    "status",
    "Nomor Antrian",
    "No Transaksi",
    "Nama Supplier",
    "ID Supplier",
    "Waktu",
  ];

  const rows = data.map((item) => [
    item.status,
    item.scanData.nomor_antrian !== undefined ? `"${item.scanData.nomor_antrian}"` : '""',
    `"${item.scanData.trno}"`,
    `"${item.scanData.suppname}"`,
    `"${item.scanData.suppid}"`,
    item.timestamp,
  ]);

  const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  const now = new Date();
  const datePart = now.getFullYear().toString() + 
                   (now.getMonth() + 1).toString().padStart(2, '0') + 
                   now.getDate().toString().padStart(2, '0');
  
  // Format Waktu + Milidetik Unik: HHMMSS_ms
  const timePart = now.getHours().toString().padStart(2, '0') + 
                   now.getMinutes().toString().padStart(2, '0') + 
                   now.getSeconds().toString().padStart(2, '0');

  // Contoh: riwayat-scan_20251211_030602.csv
  const uniqueFilename = `riwayat-scan_${datePart}_${timePart}.csv`;
  
  a.download = uniqueFilename;
  a.click();

  URL.revokeObjectURL(url);
}
