import { startScanner } from "./scanner/qrScanner";
import { renderHistory, getHistory, clearHistory, saveHistory } from "./utils/storage";
import { exportToCSV } from "./utils/csv";
import {elements} from './ui/elements';
import { fillForm, initTabs } from "./ui/form";

// Load history on load


const bootstrap = () => {
    initTabs();
    renderHistory();
    (document.getElementById("exportBtn") as HTMLButtonElement).onclick = () => {
        const history = getHistory();
        if (history.length === 0) return alert("Tidak ada data");
    };

    (document.getElementById("clearHistoryBtn") as HTMLButtonElement).onclick =
        () => {
            if (confirm("Hapus semua riwayat?")) {
                clearHistory();
                renderHistory();
            }
        };
    try {
        // startScanner();
    } catch (e) {
        console.error("Scanner error:", e);
    }
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap);
} else {
  startScanner();
    bootstrap(); // Jika sudah siap, langsung jalankan
}

