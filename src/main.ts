import { startScanner } from "./scanner/qrScanner";
import { getHistory, clearHistory, saveHistory } from "./utils/storage";
import { exportToCSV } from "./utils/csv";
import { elements, getFormData, fillForm, initTabs } from "./ui/form";

// Load history on load
function renderHistory() {
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
        <strong>#${item.nomorAntrian}</strong> - ${item.idSupplier}<br/>
        ${item.noTransaksi} (${item.namaBuyer})
      </div>
      <small>${new Date(item.waktu).toLocaleString()}</small>
    `;
    div.onclick = () => fillForm(item);

    elements.historyList.appendChild(div);
  });
}

const bootstrap = () => {
    
    // Inisialisasi navigasi tab dahulu
    initTabs();
    renderHistory();
    // Baru jalankan kamera scanner
    try {
        startScanner();
    } catch (e) {
        console.error("Scanner error:", e);
    }
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap);
} else {
    bootstrap(); // Jika sudah siap, langsung jalankan
}

// Buttons
(document.getElementById("saveBtn") as HTMLButtonElement).onclick = () => {
  saveHistory(getFormData());
  renderHistory();
  alert("Data disimpan!");
};

(document.getElementById("exportBtn") as HTMLButtonElement).onclick = () => {
  const history = getHistory();
  if (history.length === 0) return alert("Tidak ada data");

  exportToCSV(history);
};

(document.getElementById("clearHistoryBtn") as HTMLButtonElement).onclick =
  () => {
    if (confirm("Hapus semua riwayat?")) {
      clearHistory();
      renderHistory();
    }
  };

// INIT
// startScanner();
// renderHistory();
