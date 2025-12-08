import { fillForm, getFormData } from "../ui/form.js";
import { saveHistory } from "../utils/storage.js";
export function startScanner() {
  const html5QrCode = new Html5Qrcode("reader");
  function onScanSuccess(decodedText) {
    try {
      const data = JSON.parse(decodedText);
      fillForm(data);
      saveHistory(getFormData());
      alert("QR berhasil dipindai ✅");
    } catch (error) {
      alert("QR tidak valid atau bukan JSON ❌");
    }
  }
  Html5Qrcode.getCameras()
    .then((devices) => {
      if (devices.length > 0) {
        html5QrCode.start(
          devices[0].id,
          { fps: 10, qrbox: 250 },
          onScanSuccess
        );
      } else {
        alert("Kamera tidak ditemukan");
      }
    })
    .catch((err) => {
      alert("Gagal akses kamera: " + err);
    });
}
