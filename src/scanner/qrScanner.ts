import { fillForm, getFormData } from "../ui/form";
import { saveHistory } from "../utils/storage";

declare const Html5Qrcode: any;

export function startScanner() {
  const html5QrCode = new Html5Qrcode("reader");
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Variabel untuk mengunci proses agar tidak duplikat
  let isProcessing = false;

  async function onScanSuccess(decodedText: string) {
    // Jika sedang memproses data sebelumnya, abaikan frame ini
    if (isProcessing) return;

    try {
      isProcessing = true; // Kunci proses
      
      const data = JSON.parse(decodedText);
      fillForm(data);
      saveHistory(getFormData());
      
      alert("QR berhasil dipindai ✅");

      // Opsional: Matikan kamera setelah sukses agar tidak scan ulang otomatis
      await html5QrCode.stop(); 
      isProcessing = false;

    } catch (error) {
      console.error("Bukan JSON:", decodedText);
      // Jika ingin alert error muncul sekali saja, beri jeda sebelum isProcessing = false
    } finally {
      // Tunggu 3 detik sebelum mengizinkan scan berikutnya 
      // agar user punya waktu menjauhkan QR dari kamera
      setTimeout(() => {
        isProcessing = false;
      }, 3000);
    }
  }

  const startScanning = async () => {
    try {
      const config = { fps: 10, qrbox: 250 };
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