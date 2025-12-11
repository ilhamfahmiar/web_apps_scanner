import { fillForm } from "../ui/form";
import { saveScanAndLog } from './saveScanAndLog';
import { saveHistory } from "../utils/storage";
import { BackendPO, LogData, ValidationResult } from "../types/index";
declare const Html5Qrcode: any;
import { validateScanData } from "./validate";

function setError(errorMessage:any){ 
  const elements = {
    crash: document.getElementById('crash') as HTMLDivElement,
  };
  document.getElementById("instructions")!.style.display = "none";
  elements.crash.textContent = errorMessage || "";
  document.getElementById("crash")!.style.display = "block";
}

export function startScanner() {
  const html5QrCode = new Html5Qrcode("reader");
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Variabel untuk mengunci proses agar tidak duplikat
  let isProcessing = false;

  async function onScanSuccess(decodedText: string) {
    setTimeout(() => {
        document.getElementById("instructions")!.style.display = "block";
        document.getElementById("crash")!.style.display = "none";
    }, 5000); 
    if (isProcessing) return;
    
    let originalData: any;
    
      try {
          isProcessing = true;
          originalData = JSON.parse(decodedText);
          await html5QrCode.stop(); 
          console.log("Kamera dihentikan. Melakukan validasi...",originalData,);
          const validatedData = await validateScanData(originalData); 
          if(validatedData.qrcode_crash=="crash"){
            setError(validatedData.message);
            isProcessing = false;
            // await startScanning();
            return;
          }
          // alert("Validasi selesai. Menyimpan data scan...");
          try {
            const saved = await saveScanAndLog(validatedData.data, "scannedBy");
            console.log("Nomor Antrian dari API:", validatedData.data, saved);
            if(!saved.success){
              console.log("Penyimpanan scan/log gagal:", saved.message);
              setError(saved.message);
              isProcessing = false;
              return;
            }
            const logDataSave: LogData={
              timestamp: new Date().toISOString(),
              message: validatedData.message || "",
              status: validatedData.data.status === "PO valid" ? "PO valid" : "PO tidak valid",
              scanData: saved.data,
              pdfUrl: ""
            }
            fillForm(logDataSave);
            saveHistory(logDataSave);
          } catch (err) {
            console.log("Gagal menyimpan ke API lokal:", err);
          }
      } catch (error) {
          const errorMessage = error instanceof Error 
              ? error.message 
              : "Terjadi kesalahan yang tidak diketahui.";
          isProcessing = false; 
      } finally {
          setTimeout(() => {
              isProcessing = false;
          }, 3000); 
      }
  }

  const startScanning = async () => {
    try {
      const config = { fps: 10, qrbox: { width: 300, height: 300 }, 
  aspectRatio: 1.0 };
      if (isMobile) {
        await html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess);
      } else {
        const devices = await Html5Qrcode.getCameras();
        if (devices.length > 0) {
          await html5QrCode.start(devices[0].id, config, onScanSuccess);
        } else {
          alert("Kamera tidak ditemukan");
        }
      }
    } catch (err) {
      alert("Error kamera: Pastikan gunakan HTTPS");
    }
  };

  startScanning();
}

