import QRCodeStyling from "qr-code-styling";

const qr = new QRCodeStyling({
  width: 200,
  height: 200,
  data: JSON.stringify({kode: "PM0225050467"}),
  image: "/src/assets/logo.png", // optional
  dotsOptions: {
    color: "#000",
    type: "rounded",
  },
  qrOptions: {
    // Setting ke 'H' (High) memungkinkan hingga 30% data rusak/tertutup
    errorCorrectionLevel: 'H' 
  },
  imageOptions: {
    crossOrigin: "anonymous",
    margin: 10,
    imageSize: 0.25,
  },
});

const container = document.getElementById("qr");
if (container) {
  qr.append(container);
}


const btnGenerate = document.getElementById("generateQrBtn")!;
const input = document.getElementById("qrText") as HTMLInputElement;

btnGenerate.addEventListener("click", () => {
  const value = input.value.trim();
  console.log("Generating QR for:", value);
  if (!value) {
    alert("Isi QR tidak boleh kosong");
    return;
  }
  qr.update({
    data: JSON.stringify({kode: value}),
  });
});

(document.getElementById("downloadQrBtn") as HTMLButtonElement)
  .addEventListener("click", () => {
    qr.download({ name: "qrcode", extension: "png" });
  });