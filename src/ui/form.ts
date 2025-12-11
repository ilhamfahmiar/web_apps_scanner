import { LogData } from "../types/index";
import { startScanner } from "../scanner/qrScanner";
import {elements} from '../ui/elements';
import { clearHistory,getHistory, updateHistoryItem } from "../utils/storage";
import { exportToCSV } from "../utils/csv";
import { createIcons, Download } from 'lucide';

let currentAntrian: number = parseInt(
  localStorage.getItem("nomorAntrianTerakhir") || "0"
);

export function generateAntrian(): number {
  currentAntrian++;
  localStorage.setItem("nomorAntrianTerakhir", currentAntrian.toString());
  return currentAntrian;
}

export function fillForm(data: LogData) {
  const isValid = data.scanData.status !== "PO tidak valid";
  
  elements.noTransaksi.value = data.scanData.trno || "";
  elements.namaSupplier.value = data.scanData.suppname || "";
  elements.idSupplier.value = data.scanData.suppid || "";
  if ( isValid) {
    elements.nomorAntrian.value = data.scanData.nomor_antrian?.toString() || "";
    elements.invalidCard.style.display = "none";
    elements.nomorAntrianDiv.style.display = "block";
    elements.printBtnDiv.style.display="grid";
    elements.printBtn.onclick = () => handlePrint(data);
  }else{
    elements.nomorAntrian.value = 0 .toString() || "";
    elements.printBtnDiv.style.display="none";
    elements.nomorAntrianDiv.style.display = "none";
    elements.invalidCard.style.display = "block";
  }
  if(data.pdfUrl && data.pdfUrl!=""){
    displayDownloadLink(data.pdfUrl, elements.downloadLinkArea);
  }
  toData();
}

function toData(){
  const { tabScanner, tabData, scannerCard, tabHistory, dataCard, historyCard } = elements;
  tabScanner.classList.remove('active');
  tabData.classList.add('active');
  tabHistory.classList.remove('active');
  scannerCard.classList.remove('active');
  dataCard.classList.add('active'); // Card hasil scan muncul
  historyCard.classList.remove('active');
}
function toScanner(){
  const { tabScanner, tabData, tabHistory,scannerCard, dataCard, historyCard } = elements;
  tabScanner.classList.add('active');
  tabData.classList.remove('active');
  tabHistory.classList.remove('active');
  scannerCard.classList.add('active');
  dataCard.classList.remove('active');
  historyCard.classList.remove('active');
}
function toHistory(){
  const { tabScanner, tabData, tabHistory,scannerCard, dataCard,historyCard } = elements;
  tabScanner.classList.remove('active');
  tabData.classList.remove('active');
  tabHistory.classList.add('active');
  scannerCard.classList.remove('active');
  dataCard.classList.remove('active'); // Card hasil scan muncul
  historyCard.classList.add('active');
}
export function initTabs() {
  const { tabScanner, tabData, tabHistory, clearHistoryBtn, exportBtn } = elements;
  tabData.addEventListener('click', () => {
    toData();
  });

  tabScanner.addEventListener('click', () => {
    startScanner();
    toScanner();
  });

  tabHistory.addEventListener('click', () => {
    toHistory();
  });

  clearHistoryBtn.addEventListener('click', () => {
    clearHistory();
  });

  exportBtn.addEventListener('click', () => {
    exportToCSV(getHistory());
  });
}

function displayDownloadLink(url: string, container: HTMLElement) {
    container.innerHTML = '';
    
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.target = '_blank';
    
    downloadLink.className = 'btn secondary download-link';
    downloadLink.style.background = '#3ac005';
    downloadLink.style.color = '#ffffff'; 
    downloadLink.style.fontSize = '14px'; 
    downloadLink.style.fontFamily = 'Arial, sans-serif';
    downloadLink.innerHTML = '<i data-lucide="download"></i> Unduh PDF';
    container.appendChild(downloadLink);
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
}
async  function handlePrint(data: LogData) {
    try {
      const res = await fetch("/scan-api/print-ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      updateHistoryItem(data.timestamp, { pdfUrl: result.pdf_url });
      displayDownloadLink(result.pdf_url, elements.downloadLinkArea);
      if (result.printed) {
        console.log("Tiket berhasil dicetak");
      } else {
        console.log("Printer tidak tersedia. Tiket disimpan sebagai PDF.");
      }

    } catch (err) {
      console.error(err);
      alert("Gagal mengirim perintah print ke server");
    }
}