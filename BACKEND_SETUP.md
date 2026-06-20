# NOMA POS - Backend Configuration Guide

## ✅ Ringkasan Update Backend

Backend telah diupdate untuk mendukung semua fitur frontend baru:

### 1. Dashboard Controller ✓
- **File**: `server/src/controllers/dashboardController.js`
- **Update**: Menambahkan 3 endpoint data baru:
  - `monthlySalesData`: Data penjualan per bulan (12 bulan terakhir)
  - `categories`: Daftar semua kategori produk
  - `bestSellingProducts`: 5 produk terlaku (top seller)

### 2. Report Controller ✓
- **File**: `server/src/controllers/reportController.js`
- **Status**: Sudah lengkap, siap digunakan

### 3. Cashier Controller ✓
- **File**: `server/src/controllers/cashierController.js`
- **Endpoints**:
  - `GET /api/cashiers` - Ambil daftar kasir aktif
  - `POST /api/cashiers` - Tambah kasir baru
  - `PUT /api/cashiers/:id` - Update kasir
  - `PUT /api/cashiers/deactivate/:id` - Nonaktifkan kasir
  - `DELETE /api/cashiers/:id` - Hapus kasir permanen

### 4. Transaction Controller ✓
- **File**: `server/src/controllers/transactionController.js`
- **Support**: QRIS payment method (disimpan ke database)

### 5. Product Controller ✓
- **File**: `server/src/controllers/productController.js`
- **Status**: Sudah lengkap

---

## 📋 Setup Database

### Opsi 1: Menggunakan Complete Schema (Recommended)
```bash
# 1. Login ke MySQL
mysql -u root -p

# 2. Import schema baru
USE noma_pos;
SOURCE database/complete_schema.sql;
```

### Opsi 2: Manual Setup
Jika database sudah ada, pastikan tabel memiliki kolom:

```sql
-- Pastikan users memiliki kolom is_active
ALTER TABLE users ADD COLUMN is_active TINYINT(1) DEFAULT 1;

-- Pastikan sales memiliki kolom payment_method
ALTER TABLE sales ADD COLUMN payment_method ENUM('tunai', 'qris', 'transfer', 'kartu_kredit') DEFAULT 'tunai';

-- Pastikan sale_items memiliki semua kolom yang diperlukan
ALTER TABLE sale_items ADD COLUMN IF NOT EXISTS subtotal DECIMAL(12, 2);
```

---

## 🔧 Environment Configuration

### File: `.env` di folder server

```env
# Database Connection
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=noma_pos

# JWT Secret
JWT_SECRET=your_super_secret_key_change_this

# Server Port
PORT=5000

# Node Environment
NODE_ENV=development
```

---

## 🚀 Menjalankan Backend

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Setup Database
```bash
mysql -u root -p < database/complete_schema.sql
```

### 3. Jalankan Server
```bash
npm start
# atau untuk development dengan auto-reload
npm run dev
```

Server akan running di `http://localhost:5000`

---

## ✅ Validasi Endpoints

### Cek Dashboard API
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/dashboard
```

**Response Expected:**
```json
{
  "totalSales": 5000000,
  "todayTransactions": 10,
  "totalProducts": 25,
  "activeCashiers": 3,
  "recentActivities": [...],
  "monthlySalesData": [
    { "month": "Jan 2026", "sales": 1000000 },
    { "month": "Feb 2026", "sales": 2000000 }
  ],
  "categories": [
    { "id": 1, "name": "Elektronik" },
    { "id": 2, "name": "Fashion" }
  ],
  "bestSellingProducts": [
    {
      "id": 1,
      "name": "Produk A",
      "category_name": "Elektronik",
      "price": 100000,
      "sold_qty": 50
    }
  ]
}
```

### Cek Report API
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:5000/api/reports/sales?startDate=2026-06-01&endDate=2026-06-21"
```

### Cek Cashiers API
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/cashiers
```

### Cek Products API
```bash
curl http://localhost:5000/api/products
```

---

## 📝 Important Notes

### 1. Payment Method Support
- **Tunai** ✓ - Pembayaran tunai
- **QRIS** ✓ - Pembayaran menggunakan QRIS (barcode ditampilkan di frontend)
- **Transfer** - Tersedia untuk future implementation
- **Kartu Kredit** - Tersedia untuk future implementation

### 2. Cashier Status
- **is_active = 1**: Kasir aktif (muncul di list)
- **is_active = 0**: Kasir nonaktif (tidak muncul di list)
- **DELETED**: Data hapus permanen dari database

### 3. Image Upload
- **Folder**: `server/src/uploads/products/`
- **Max Size**: 2MB per file
- **Allowed Types**: jpg, jpeg, png, webp, gif
- **Access URL**: `http://localhost:5000/uploads/products/filename.jpg`

---

## 🐛 Troubleshooting

### Error: "Cannot find module 'joi'"
```bash
npm install joi
```

### Error: "JWT verification failed"
- Pastikan token valid
- Pastikan JWT_SECRET di .env sesuai

### Error: "Column doesn't exist"
- Jalankan migration/update schema SQL
- Cek nama kolom di database

### Error: "Connection refused"
- Pastikan MySQL running
- Cek DB_HOST dan DB_PORT di .env

### Image tidak muncul di frontend
- Pastikan folder `server/src/uploads/products/` ada
- Cek permission folder (755 atau 777)
- Cek path URL di frontend sesuai dengan base URL

---

## 📞 Testing dengan Postman

### 1. Login
**POST** `http://localhost:5000/api/auth/login`
```json
{
  "username": "admin",
  "password": "123456"
}
```

### 2. Ambil Token
Copy `token` dari response, gunakan di header:
```
Authorization: Bearer [TOKEN_ANDA]
```

### 3. Test Dashboard
**GET** `http://localhost:5000/api/dashboard`
Header: `Authorization: Bearer [TOKEN]`

---

## 🎉 Setup Complete!

Backend sudah siap! Hubungkan dengan frontend dan semua fitur berikut akan berjalan:

✅ Dashboard dengan grafik penjualan bulanan
✅ Modal kategori & produk terlaku
✅ Transaksi QRIS dengan barcode
✅ Laporan penjualan dengan filter tanggal
✅ Manajemen kasir (tambah, edit, nonaktifkan, hapus)
