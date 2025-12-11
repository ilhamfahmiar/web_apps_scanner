// src/types/index.ts

export interface BackendPO {
    nomor_antrian?: number;
    periodid: number;
    datepo: string;
    trno: string;
    validdateuntil: string;
    suppid: string;
    suppname: string;
    status: string;
    tanggal_antrian: string;
}


export interface LogData {
    timestamp: string;
    status: 'PO valid' | 'PO tidak valid';
    message: string;
    scanData: BackendPO;
    pdfUrl: string;
}

export interface ValidationResult {
    qrcode_crash: "crash" | "QR Code valid";
    data: BackendPO | {};
    message: string;
}