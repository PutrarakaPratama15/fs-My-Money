// File: app/budget/ExportButton.tsx
"use client";

import { TransactionHistory } from "../../actions/transactions";

export default function ExportButton({ data }: { data: TransactionHistory[] }) {
  const handleExport = () => {
    if (data.length === 0) {
      alert("Tidak ada data transaksi untuk diekspor.");
      return;
    }

    // 1. Definisikan Header Kolom Excel
    const headers = ["Tanggal", "Kategori", "Tipe", "Nominal", "Keterangan"];
    
    // 2. Mapping data baris demi baris
    const csvRows = data.map((row) => {
      const date = new Date(row.date).toLocaleDateString("id-ID");
      const category = row.category;
      const type = row.type === "income" ? "Pemasukan" : "Pengeluaran";
      const amount = row.amount;
      // Bungkus deskripsi pakai kutip ganda agar koma di dalam teks tidak merusak format CSV
      const description = `"${row.description || "-"}"`; 

      return [date, category, type, amount, description].join(",");
    });

    // 3. Gabungkan Header dan Baris Data
    const csvString = [headers.join(","), ...csvRows].join("\n");

    // 4. Proses konversi ke File dan trigger Download
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    link.href = url;
    link.setAttribute("download", `Laporan_Arus_Kas_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    
    // Bersihkan memori browser setelah download selesai
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors shadow-sm"
    >
      Unduh Excel (CSV)
    </button>
  );
}