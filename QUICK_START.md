# 🚀 QUICK START - NOMA POS

## ✅ Dalam 5 Menit, Aplikasi Anda Berjalan!

### **Prasyarat** (pastikan sudah ada)
- Node.js v16+ (download: https://nodejs.org)
- MySQL v5.7+ (download: https://www.mysql.com)

---

## **LANGKAH 1: Setup Database** (2 menit)

Buka **Terminal/CMD** dan jalankan:

```bash
# Masuk ke folder project
cd c:\Iful\noma-pos

# Import database
mysql -u root -p < database/complete_schema.sql

# Keterangan:
# - Diminta password MySQL, ketik password Anda
# - Jika tidak ada password, tekan Enter langsung
```

✅ **Selesai!** Database sudah siap

---

## **LANGKAH 2: Jalankan Backend** (Terminal/CMD baru)

```bash
cd c:\Iful\noma-pos\server

# Install dependencies (first time only)
npm install

# Jalankan server
npm start

# Tunggu sampai muncul:
# "Server running on port 5000"
```

✅ **Backend ready!** Jangan tutup terminal ini

---

## **LANGKAH 3: Jalankan Frontend** (Terminal/CMD baru)

```bash
cd c:\Iful\noma-pos\client

# Install dependencies (first time only)
npm install

# Jalankan dev server
npm run dev

# Tungup sampai muncul:
# "Local: http://localhost:5173"
```

✅ **Frontend ready!**

---

## **LANGKAH 4: Login ke Aplikasi**

1. Buka browser: **http://localhost:5173**
2. Masuk dengan:
   - **Username**: `admin`
   - **Password**: `123456`

3. Anda sudah masuk ke Dashboard! 🎉

---

## 🔍 **Cek Semuanya Berjalan**

| Component | URL | Status |
|-----------|-----|--------|
| Frontend | http://localhost:5173 | ✅ Harus muncul |
| Backend API | http://localhost:5000/api/products | ✅ Harus return JSON |
| Database | MySQL running | ✅ Harus jalan |

---

## ❌ **Error di Tengah Jalan?**

### Error: "Cannot connect to database"
```bash
# Check MySQL running
mysql -u root -p -e "SELECT 1;"

# Atau start MySQL:
# Windows: net start MySQL80
# macOS: brew services start mysql
```

### Error: "Port 5000 already in use"
```bash
# Kill process:
# Windows: taskkill /PID <PID> /F
# macOS: lsof -i :5000 | kill -9 <PID>
```

### Error: "Cannot find module"
```bash
cd server (atau client)
npm install
```

**Masih error?** Baca [ERROR_CHECKING_GUIDE.md](ERROR_CHECKING_GUIDE.md)

---

## 🎯 **Apa Yang Sudah Bisa Dilihat?**

✅ **Dashboard** - Grafik penjualan bulanan
✅ **Kategori & Produk Modal** - Klik "Total Produk"
✅ **Laporan** - Filter tanggal, export Excel/PDF
✅ **Kasir Management** - Tambah, edit, hapus
✅ **Transaksi** - Pembayaran Tunai & QRIS

---

## 📚 **Dokumentasi Lengkap**

- **Semua fitur**: [COMPLETE_SETUP_GUIDE.md](COMPLETE_SETUP_GUIDE.md)
- **Backend config**: [BACKEND_SETUP.md](BACKEND_SETUP.md)
- **Frontend config**: [FRONTEND_SETUP.md](FRONTEND_SETUP.md)
- **Error handling**: [ERROR_CHECKING_GUIDE.md](ERROR_CHECKING_GUIDE.md)

---

## 🎓 **Next Steps**

Setelah berhasil login:

1. **Explore Dashboard** - Lihat grafik dan statistik
2. **Test Transaksi** - Login sebagai kasir, buat transaksi
3. **Try QRIS** - Pilih metode pembayaran QRIS
4. **Check Reports** - Lihat laporan penjualan
5. **Manage Users** - Tambah kasir baru

---

## 🤝 **Tips**

- **Pertama kali?** Baca [COMPLETE_SETUP_GUIDE.md](COMPLETE_SETUP_GUIDE.md)
- **Ada error?** Baca [ERROR_CHECKING_GUIDE.md](ERROR_CHECKING_GUIDE.md)
- **Ingin modify code?** Check [SESSION_SUMMARY.md](SESSION_SUMMARY.md)

---

## ⏹️ **Menghentikan Aplikasi**

Tekan **CTRL+C** di masing-masing terminal

---

**Selamat! Aplikasi NOMA POS Anda sudah siap pakai! 🎉**

Jika ada pertanyaan, refer ke dokumentasi di folder root project.
