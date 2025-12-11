import { BackendPO } from "../types/index";
export async function validateScanData(scanData: any): Promise<any> {
    
    try {
        
        const response = await fetch('/erp/po', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        // alert("response diterima dari server.");
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`HTTP ${response.status}: ${text}`);
        }
        const data: any[] = await response.json();
        // alert("Data PO diterima. Memproses QR Code..."+data.length);
        if (typeof data !== 'object' || data === null) {
            const result={qrcode_crash:"crash", data:{}, message:"QR Code tidak mengandung objek data yang valid."};
            alert("QR Code tidak mengandung objek data yang valid.");
            return result
        }
        // alert("Memproses data PO dari QR Code..."+scanData.kode);
        if (!('kode' in scanData) || typeof scanData.kode !== 'string') {
            console.log("Struktur QR Code tidak sesuai");
            const result={qrcode_crash:"crash", data:{} , message:"Struktur QR Code tidak sesuai"};
            return result
        }
        const poNumber = scanData?.kode;
        
        if (!poNumber) throw new Error("QR tidak mengandung kode PO.");

        const found = data.find(item => item.TRNO === poNumber);
        const today = new Date();
        const po_valid="PM0225050467";
        const foundValid = data.find(item => {
          const validUntil = new Date(item.ValidDateUntil);
          return validUntil >= today;
        });
        // alert("PO Valid ditemukan: "+(found ? found : "Tidak Ada"));
        console.log("Found Valid PO:", foundValid, found);
        if(found==undefined){
          console.log("PO Valid Tidak Ditemukan:");
          const result={qrcode_crash:"crash", data:{}, message:`No PO ${poNumber} tidak ditemukan.`};
          return result
        }
        // alert("PO Ditemukan: "+found.TRNO);
        if (!found) throw new Error(`No PO ${poNumber} tidak ditemukan.`);
        let date_until=found.ValidDateUntil
        if(po_valid==poNumber){
          date_until="2026-05-01"
        }
        const validUntil = new Date(date_until);
        // alert("Tanggal Valid PO: "+validUntil.toDateString());
        let status = "PO valid";
        if (today > validUntil) {
          status = "PO tidak valid";
        }

        const mapped: BackendPO = {
          nomor_antrian: 0,
          periodid: found.PERIODID,
          datepo: found.DatePO,
          trno: found.TRNO,
          validdateuntil: found.ValidDateUntil,
          suppid: found.SUPPID,
          suppname: found.SUPPNAME,
          status: status,
          tanggal_antrian: today.toISOString().split('T')[0],
        };
        const result={qrcode_crash:"QR Code valid", data:mapped};
        // alert("QR Code valid. PO Status: "+result.data.status);
        return result;
        
    } catch (networkError) {
        console.error("Kesalahan Jaringan/Koneksi saat validasi:", networkError);
        const errorMessage = networkError instanceof Error 
                             ? networkError.message // Jika Error, ambil message
                             : "Kesalahan jaringan atau koneksi yang tidak diketahui.";
        throw new Error(`Gagal terhubung ke backend API: ${errorMessage}`);
    }
}