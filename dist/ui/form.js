export const elements = {
    nomorAntrian: document.getElementById("nomorAntrian"),
    noTransaksi: document.getElementById("noTransaksi"),
    namaSupplier: document.getElementById("namaSupplier"),
    idSupplier: document.getElementById("idSupplier"),
    qtyPenawaran: document.getElementById("qtyPenawaran"),
    namaBuyer: document.getElementById("namaBuyer"),
    lokasi: document.getElementById("lokasi"),
    historyList: document.getElementById("historyList"),
};
let currentAntrian = parseInt(localStorage.getItem("nomorAntrianTerakhir") || "0");
export function generateAntrian() {
    currentAntrian++;
    localStorage.setItem("nomorAntrianTerakhir", currentAntrian.toString());
    return currentAntrian;
}
export function fillForm(data) {
    elements.nomorAntrian.value = generateAntrian().toString();
    elements.noTransaksi.value = data.noTransaksi || data.namaSeller || "";
    elements.namaSupplier.value = data.namaSupplier || data.kodeUnik || "";
    elements.idSupplier.value = data.idSupplier || data.namaBarang || "";
    elements.qtyPenawaran.value = data.qtyPenawaran || data.jumlahMuatan || "";
    elements.namaBuyer.value = data.namaBuyer || data.asalDaerah || "";
    elements.lokasi.value = data.lokasi || data.alamatPengirim || "";
}
export function getFormData() {
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
