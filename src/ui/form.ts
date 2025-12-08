import { ScanData } from "../types/ScanData";

export const elements = {
  nomorAntrian: document.getElementById("nomorAntrian") as HTMLInputElement,
  noTransaksi: document.getElementById("noTransaksi") as HTMLInputElement,
  namaSupplier: document.getElementById("namaSupplier") as HTMLInputElement,
  idSupplier: document.getElementById("idSupplier") as HTMLInputElement,
  qtyPenawaran: document.getElementById("qtyPenawaran") as HTMLInputElement,
  namaBuyer: document.getElementById("namaBuyer") as HTMLInputElement,
  lokasi: document.getElementById("lokasi") as HTMLTextAreaElement,
  historyList: document.getElementById("historyList") as HTMLDivElement,
  tabScanner: document.getElementById('tabScanner') as HTMLButtonElement,
  tabData: document.getElementById('tabData') as HTMLButtonElement,
  scannerCard: document.getElementById('scannerCard') as HTMLDivElement,
  dataCard: document.getElementById('dataCard') as HTMLDivElement
};

let currentAntrian: number = parseInt(
  localStorage.getItem("nomorAntrianTerakhir") || "0"
);

export function generateAntrian(): number {
  currentAntrian++;
  localStorage.setItem("nomorAntrianTerakhir", currentAntrian.toString());
  return currentAntrian;
}

export function fillForm(data: any) {
  console.log(data)
  elements.nomorAntrian.value = generateAntrian().toString();
  elements.noTransaksi.value = data.noTransaksi || data.namaSeller || "";
  elements.namaSupplier.value = data.namaSupplier || data.kodeUnik || "";
  elements.idSupplier.value = data.idSupplier || data.namaBarang || "";
  elements.qtyPenawaran.value = data.qtyPenawaran || data.jumlahMuatan || "";
  elements.namaBuyer.value = data.namaBuyer || data.asalDaerah || "";
  elements.lokasi.value = data.lokasi || data.alamatPengirim || "";
  toData();
}

export function getFormData(): ScanData {
  return {
    nomorAntrian: Number(elements.nomorAntrian.value),
    noTransaksi: elements.noTransaksi.value,
    namaSupplier: elements.namaSupplier.value,
    idSupplier: elements.idSupplier.value,
    qtyPenawaran: elements.qtyPenawaran.value,
    namaBuyer: elements.namaBuyer.value,
    lokasi: elements.lokasi.value,
    waktu: new Date().toISOString(),
  };
}

function toData(){
  const { tabScanner, tabData, scannerCard, dataCard } = elements;
  tabScanner.classList.remove('active');
  tabData.classList.add('active');
  scannerCard.classList.remove('active');
  dataCard.classList.add('active'); // Card hasil scan muncul
}
export function initTabs() {
  const { tabScanner, tabData, scannerCard, dataCard } = elements;
  tabData.addEventListener('click', () => {
    // Navigasi Tab
    tabScanner.classList.remove('active');
    tabData.classList.add('active');

    // Tampilan Kartu
    scannerCard.classList.remove('active');
    dataCard.classList.add('active'); // Card hasil scan muncul
  });

  tabScanner.addEventListener('click', () => {
    tabScanner.classList.add('active');
    tabData.classList.remove('active');
    scannerCard.classList.add('active');
    dataCard.classList.remove('active');
  });
}