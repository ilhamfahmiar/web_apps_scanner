export interface ScanData {
  periodid: number;
  datepo: string;
  trno: string;
  validdateuntil: string;
  suppid: string;
  suppname: string;
  status: string;
}

export interface LogData {
  trno_scanned: string;
  status_log: 'BERHASIL' | 'GAGAL_EKSTERNAL' | 'GAGAL_SCAN_QR' | 'GAGAL_DB';
  pesan_log: string;
  scanned_by: string;
  data_po_mentah: any;
  fk_scan_id?: number;
}

export async function saveScanAndLog(scanData: ScanData, scannedBy: string) {
  const tanggal_antrian = new Date().toISOString().split('T')[0];
  const logData: LogData = {
    trno_scanned: scanData.trno,
    status_log: scanData.status === "PO Valid" ? "BERHASIL" : "GAGAL_EKSTERNAL",
    pesan_log: scanData.status,
    scanned_by: scannedBy,
    data_po_mentah: scanData
  };
  try {
        const response = await fetch('/scan-api/scan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ scanData: scanData, log: logData, tanggal_antrian: tanggal_antrian })
        });
        if (!response.ok) {
            let errorDetail = 'Tidak ada detail error.';
            try {
                const errorJson = await response.json();
                errorDetail = JSON.stringify(errorJson);
            } catch {
                errorDetail = await response.text();
            }
            throw new Error(`[HTTP ${response.status}] Gagal menyimpan scan/log: ${errorDetail}`);
        }
        const result = await response.json();
        return result;

  } catch (error) {
        let errorMessage = "Terjadi Kesalahan Jaringan/Proxy.";
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'string') {
             errorMessage = error;
        }
        throw new Error(`[SERVER ERROR] Gagal mengirim data ke API: ${errorMessage}`);
  }
}
