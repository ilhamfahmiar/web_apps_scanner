import { ScanData } from "../types/ScanData";

const STORAGE_KEY = "scanHistory";

/**
 * Mengambil semua data scan dari localStorage dengan validasi tipe.
 */
export function getHistory(): ScanData[] {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) return [];

    const parsed = JSON.parse(rawData);

    // Validasi sederhana: pastikan data adalah array
    if (!Array.isArray(parsed)) return [];

    return parsed;
  } catch (error) {
    console.error("Gagal membaca riwayat scan dari storage:", error);
    return [];
  }
}

/**
 * Menyimpan data scan baru ke urutan teratas (unshift).
 */
export function saveHistory(data: ScanData): void {
  try {
    const history = getHistory();
    
    // Menambahkan data baru di index 0
    history.unshift(data);

    // Membatasi riwayat agar tidak memberbankan memori browser (limit 100)
    if (history.length > 100) {
      history.pop();
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    // Menangani kuota localStorage penuh (biasanya 5MB)
    console.error("Gagal menyimpan data ke storage. Kapasitas mungkin penuh:", error);
    alert("Penyimpanan browser penuh. Mohon bersihkan riwayat atau kirim data ke server.");
  }
}

/**
 * Menghapus seluruh riwayat scan.
 */
export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}