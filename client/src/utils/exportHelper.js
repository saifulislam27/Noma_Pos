import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Utility untuk Export ke Excel (Menggunakan exceljs)
 */
export const exportExcel = async (data, filename) => {
  if (!data || !data.length) return;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Laporan Penjualan");

  // 1. Definisikan Struktur Kolom yang Rapi & Human-Readable
  worksheet.columns = [
    { header: "No", key: "no", width: 8 },
    { header: "No. Struk", key: "struk", width: 18 },
    { header: "Nama Kasir", key: "kasir", width: 20 },
    { header: "Metode Pembayaran", key: "metode", width: 20 },
    { header: "Waktu Transaksi", key: "waktu", width: 25 },
    { header: "Total Belanja (Rp)", key: "total", width: 18 },
  ];

  // 2. Map Data JSON Transaksi ke Baris Kolom Excel
  const rows = data.map((item, index) => ({
    no: index + 1,
    struk: `#TRX-${String(item.id).padStart(5, "0")}`,
    kasir: item.cashier_name || "-",
    metode: String(item.payment_method).toUpperCase(),
    waktu: new Date(item.created_at).toLocaleString("id-ID"),
    total: Number(item.total),
  }));

  worksheet.addRows(rows);

  // 3. Styling Header Excel agar Terlihat Profesional
  worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFF" } };
  worksheet.getRow(1).eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "2563EB" }, // Warna Biru Tema Noma POS
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
  });

  // 4. Proses Download Berkas Excel
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer]);
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.xlsx`;
  a.click();
  
  URL.revokeObjectURL(url); // Membersihkan memori browser
};

/**
 * Utility untuk Export ke PDF (Menggunakan jspdf & jspdf-autotable)
 */
export const exportPDF = (data, title) => {
  if (!data || !data.length) return;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  // 1. Tulis Judul Laporan & Periode Tanggal
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(30, 41, 59); // Warna Slate-800
  doc.text(title, 14, 15); // Ditulis di koordinat y = 15

  // 2. Buat Garis Pembatas Estetik di Bawah Judul
  doc.setDrawColor(226, 232, 240); // Warna Slate-200
  doc.setLineWidth(0.4);
  doc.line(14, 19, 196, 19); // Garis horizontal di koordinat y = 19

  // 3. Definisikan Judul Header Tabel PDF
  const tableHeaders = [["No", "No. Struk", "Nama Kasir", "Metode", "Waktu Transaksi", "Total Belanja"]];

  // 4. Map Data Transaksi ke dalam Baris Tabel PDF
  const tableBody = data.map((item, index) => [
    index + 1,
    `#TRX-${String(item.id).padStart(5, "0")}`,
    item.cashier_name || "-",
    String(item.payment_method).toUpperCase(),
    new Date(item.created_at).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }),
    `Rp ${Number(item.total).toLocaleString("id-ID")}`
  ]);

  // 5. Panggil Fungsi autoTable dengan Pengaturan Posisi Amannya (startY)
  autoTable(doc, {
    startY: 24, // 🌟 KUNCI: Dipaksa mulai di koordinat y = 24 agar tidak menutupi Judul Laporan di y = 15
    head: tableHeaders,
    body: tableBody,
    theme: "striped",
    headStyles: {
      fillColor: [37, 99, 235], // Warna biru dasar (Blue-600) Noma POS
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    columnStyles: {
      0: { halign: "center", cellWidth: 12 }, // Kolom nomor di tengah
      5: { halign: "right" }                 // Kolom Total Belanja rata kanan
    },
    styles: {
      font: "helvetica",
      fontSize: 9,
      cellPadding: 3
    }
  });

  // 6. Simpan Berkas PDF dengan Nama yang Sesuai
  const safeFileName = title.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  doc.save(`${safeFileName}.pdf`);
};