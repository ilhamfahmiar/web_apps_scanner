import { LogData } from "../types/index";
import {elements} from '../ui/elements';
import { fillForm, initTabs } from "../ui/form";
const STORAGE_KEY = "scanHistory";

/**
 * Mengambil semua data scan dari localStorage dengan validasi tipe.
 */
export function getHistory(): LogData[] {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) return [];
    const parsed = JSON.parse(rawData);
    if (!Array.isArray(parsed)) return [];

    return parsed as LogData[];
  } catch (error) {
    console.error("Gagal membaca riwayat scan dari storage:", error);
    return [];
  }
}

export function renderHistory() {
  const history = getHistory();

  elements.historyList.innerHTML = "";

  if (history.length === 0) {
    elements.historyList.innerHTML = "<p>Belum ada data</p>";
    return;
  }
  history.forEach((item) => {
    const div = document.createElement("div");
    div.className = "history-item";
    div.innerHTML = `
      <div>
        <strong>#${item.scanData.nomor_antrian}</strong> - ${item.status}<br/>
        ${item.scanData.trno} (${item.scanData.suppname})
      </div>
      <small>${new Date(item.timestamp).toLocaleString()}</small>
      <hr style="border: 0; height: 1px; background: #eee; margin: 10px 0;">
    `;
    div.onclick = () => fillForm(item);

    elements.historyList.appendChild(div);
  });
}

/**
 * Menyimpan data scan baru ke urutan teratas (unshift).
 */
export function saveHistory(data: LogData): void {
  try {
    const history = getHistory();
    history.unshift(data);
    if (history.length > 100) {
      history.pop();
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    renderHistory();
  } catch (error) {
    // Menangani kuota localStorage penuh (biasanya 5MB)
    console.error("Gagal menyimpan data ke storage. Kapasitas mungkin penuh:", error);
    alert("Penyimpanan browser penuh. Mohon bersihkan riwayat atau kirim data ke server.");
  }
}

export function updateHistoryItem(timestamp: string, updates: Partial<LogData>): void {
    try {
        const history = getHistory();
        const itemIndex = history.findIndex(item => item.timestamp === timestamp);
        if (itemIndex > -1) {
            history[itemIndex] = {
                ...history[itemIndex],
                ...updates, 
            };
            
            localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
            renderHistory(); 
        } else {
            console.warn(`Item riwayat dengan ID ${timestamp} tidak ditemukan.`);
        }
    } catch (error) {
        console.error("Gagal mengupdate storage:", error);
    }
}

/**
 * Menghapus seluruh riwayat scan.
 */
export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
  clearForm()
  renderHistory();
}

export function clearForm() {
  elements.noTransaksi.value = "";
  elements.namaSupplier.value = "";
  elements.idSupplier.value = "";
  elements.nomorAntrian.value = "";
  elements.printBtnDiv.style.display="none";
  elements.nomorAntrianDiv.style.display = "none";
  elements.invalidCard.style.display = "none";
  elements.downloadLinkArea.innerHTML = "";
}