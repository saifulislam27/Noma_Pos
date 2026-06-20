# NOMA POS - Frontend Configuration Guide

## ✅ Ringkasan Update Frontend

Frontend telah diupdate dengan semua fitur baru:

### 1. Dashboard Page ✓
- **File**: `client/src/pages/owner/dashboard/Dashboard.jsx`
- **Fitur Baru**:
  - Grafik penjualan real-time dengan data 12 bulan
  - Modal kategori produk (klik kartu "Total Produk")
  - Modal produk terlaku (top seller)
  - Data statistik lengkap dari backend

### 2. Sales Chart Component ✓
- **File**: `client/src/components/charts/SalesChart.jsx`
- **Update**: Dynamic data dari backend (bukan hardcoded)
- **Tooltip**: Format Rupiah untuk semua nilai

### 3. StatCard Component ✓
- **File**: `client/src/components/ui/StatCard.jsx`
- **Update**: Support onClick handler untuk modal interaktif

### 4. Cashiers Page ✓
- **File**: `client/src/pages/owner/cashiers/Cashiers.jsx`
- **Fitur**:
  - Tombol "Nonaktifkan" kasir
  - Tombol "Hapus" kasir permanen
  - Auto-refresh setelah operasi

### 5. Reports Page ✓
- **File**: `client/src/pages/owner/reports/Reports.jsx`
- **Fitur**:
  - Tanggal "sampai" otomatis = hari ini
  - Auto-fetch laporan saat tanggal berubah
  - Export Excel dan PDF

### 6. Cashier Transaction Page ✓
- **File**: `client/src/pages/cashier/NewTransaction.jsx`
- **Fitur QRIS Baru**:
  - Modal dengan tampilan barcode/QR code
  - Detail transaksi real-time
  - Tombol "Selesai" untuk konfirmasi pembayaran
  - Support pembayaran Tunai dan QRIS

### 7. Layout Components ✓
- **Files**: 
  - `client/src/components/layout/Navbar.jsx`
  - `client/src/components/layout/Sidebar.jsx`
- **Update**: Logo dari `public/logo.png`

---

## 📦 Frontend Dependencies

### Pastikan semua package sudah terinstall:
```bash
cd client
npm install
```

### Package utama yang diperlukan:
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.0.0",
    "axios": "^1.0.0",
    "recharts": "^2.0.0",
    "react-icons": "^4.0.0",
    "react-pdf": "^7.0.0"
  },
  "devDependencies": {
    "tailwindcss": "^3.0.0",
    "autoprefixer": "^10.0.0",
    "postcss": "^8.0.0"
  }
}
```

---

## 🎨 Assets Requirements

### 1. Logo Image
- **Path**: `client/public/logo.png`
- **Size**: Recommended 200x100px atau lebih
- **Format**: PNG dengan transparent background
- **Status**: ✅ Sudah ditambahkan di Navbar dan Sidebar

### Contoh struktur folder:
```
client/
├── public/
│   ├── logo.png          ← Logo Anda
│   ├── index.html
│   └── vite.svg
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── utils/
│   └── main.jsx
└── package.json
```

---

## 🔗 API Configuration

### File: `client/src/services/api.js`

Pastikan sudah configure dengan benar:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
});

// Auto add token ke setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Environment Variables
Buat file `.env` di folder `client`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=NOMA POS
```

---

## 🚀 Menjalankan Frontend

### 1. Install Dependencies
```bash
cd client
npm install
```

### 2. Jalankan Development Server
```bash
npm run dev
```

Server akan running di `http://localhost:5173` (Vite default)

### 3. Build untuk Production
```bash
npm run build
```

Output akan di folder `dist/`

---

## 📱 Testing Checklist

### Dashboard Owner ✓
- [ ] Buka Dashboard, grafik penjualan muncul
- [ ] Klik "Total Produk", modal terbuka
- [ ] Modal menampilkan kategori dan produk terlaku
- [ ] Tutup modal tanpa error

### Reports Owner ✓
- [ ] Buka halaman Laporan
- [ ] Tanggal "sampai" otomatis = hari ini
- [ ] Tabel transaksi muncul otomatis
- [ ] Bisa filter dengan tanggal mulai
- [ ] Bisa export Excel dan PDF

### Cashiers Owner ✓
- [ ] Buka halaman Kasir
- [ ] Klik "Tambah Kasir", form muncul
- [ ] Bisa register kasir baru
- [ ] Klik "Nonaktifkan" di daftar kasir
- [ ] Klik "Hapus" untuk delete permanen
- [ ] Daftar auto-refresh setelah operasi

### Cashier Transaction ✓
- [ ] Login sebagai kasir
- [ ] Pilih produk dan tambah ke keranjang
- [ ] Pilih metode "💵 Tunai"
- [ ] Klik "Selesai Transaksi"
- [ ] Konfirmasi transaksi berhasil
- [ ] Pilih metode "📱 QRIS"
- [ ] Modal QRIS muncul dengan barcode
- [ ] Bisa klik "Selesai" untuk confirm
- [ ] Bisa klik "Batal" untuk cancel

### Layout ✓
- [ ] Navbar menampilkan logo + "NOMA POS"
- [ ] Sidebar menampilkan "NOMA POS" (text only)
- [ ] Logo terlihat dengan baik

---

## 🎯 Feature Breakdown by Page

### Owner Dashboard (`/owner/dashboard`)
```
┌─────────────────────────────┐
│      Navbar + Logo          │
├─────────────┬───────────────┤
│   Sidebar   │   Dashboard   │
│             ├─ Stats (4x)   │
│             ├─ Chart        │
│             ├─ Activities   │
│             └─ Modal        │
└─────────────┴───────────────┘
```

### Owner Reports (`/owner/reports`)
```
┌─────────────────────────────┐
│      Navbar + Logo          │
├─────────────┬───────────────┤
│   Sidebar   │   Reports     │
│             ├─ Date Filter  │
│             ├─ Stats        │
│             └─ Table        │
└─────────────┴───────────────┘
```

### Cashier Transaction (`/cashier/transactions`)
```
┌─────────────────────────────┐
│      Navbar + Logo          │
├─────────────┬───────────────┤
│   Sidebar   │  Transaction  │
│             ├─ Products     │
│             ├─ Cart         │
│             ├─ Payment Opt  │
│             └─ QRIS Modal   │
└─────────────┴───────────────┘
```

---

## 🐛 Common Issues & Solutions

### Issue: Logo tidak muncul
**Solution**:
```bash
# Pastikan file ada
ls client/public/logo.png

# Jika tidak ada, copy dari mana pun
cp /path/to/logo.png client/public/
```

### Issue: Grafik tidak muncul
**Solution**:
1. Cek browser console untuk error
2. Pastikan `recharts` terinstall: `npm install recharts`
3. Pastikan backend `/api/dashboard` mengembalikan `monthlySalesData`

### Issue: Modal tidak bisa membuka
**Solution**:
1. Check browser console
2. Pastikan StatCard punya `onClick` prop
3. Pastikan state `showProductModal` di-initialize

### Issue: QRIS modal error
**Solution**:
1. Pastikan NewTransaction.jsx punya state `showQrisModal` dan `qrisData`
2. Pastikan `saveTransaction()` function defined
3. Check console untuk error detail

### Issue: API calls gagal
**Solution**:
```javascript
// Debug di browser console
fetch('http://localhost:5000/api/dashboard', {
  headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
})
.then(r => r.json())
.then(d => console.log(d))
.catch(e => console.error(e))
```

---

## 📝 Important Notes

### 1. Token Management
Semua API call otomatis menambahkan token dari localStorage:
```javascript
// Stored di localStorage saat login
localStorage.setItem('token', response.data.token);

// Digunakan otomatis di api.js interceptor
```

### 2. Date Format
- **Input date**: YYYY-MM-DD (HTML5 date input)
- **Display date**: Format lokal Indonesia (dd/mm/yyyy)

### 3. Currency Format
- **Format**: Rupiah dengan simbol "Rp"
- **Separator**: Titik untuk ribuan (1.000.000)
- **Fungsi**: `formatRupiah()` di utils

### 4. Responsive Design
- Mobile-first approach dengan Tailwind
- Breakpoints: sm, md, lg, xl
- Semua component responsive tested

---

## 🎉 Frontend Setup Complete!

Semua fitur frontend sudah siap:

✅ Dashboard dengan grafik dan modal
✅ Reports dengan auto-date dan filter
✅ Cashiers management (CRUD + nonaktif)
✅ Transaction dengan QRIS support
✅ Logo dan branding updated
✅ Responsive design untuk semua device

**Next Step**: Jalankan backend, lalu connect frontend ke API!
