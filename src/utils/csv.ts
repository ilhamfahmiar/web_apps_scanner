import { ScanData } from "../types/ScanData";

export function exportToCSV(data: ScanData[]): void {
  const header = [
    "Nomor Antrian",
    "No Transaksi",
    "Nama Supplier",
    "ID Supplier",
    "Qty Penawaran",
    "Nama Buyer",
    "Lokasi",
    "Waktu",
  ];

  const rows = data.map((item) => [
    item.nomorAntrian,
    `"${item.noTransaksi}"`,
    `"${item.namaSupplier}"`,
    `"${item.idSupplier}"`,
    `"${item.qtyPenawaran}"`,
    `"${item.namaBuyer}"`,
    `"${item.lokasi.replace(/\n/g, " ")}"`,
    item.waktu,
  ]);

  const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "riwayat-scan.csv";
  a.click();

  URL.revokeObjectURL(url);
}
