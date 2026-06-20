const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 1. Tentukan folder penyimpanan gambar produk
const targetDir = path.join(__dirname, "../uploads/products");

// 2. AMAN: Otomatis membuat folder jika folder 'uploads/products' belum ada di server
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 3. Konfigurasi penyimpanan nama file unik
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, targetDir);
  },
  filename: (req, file, cb) => {
    // Menghasilkan nama unik: timestamp-namaasli.jpg
    const uniqueSuffix = Date.now() + "-" + file.originalname.replace(/\s+/g, "-");
    cb(null, uniqueSuffix);
  }
});

// 4. Filter tipe berkas (Hanya mengizinkan ekstensi gambar murni)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Hanya file gambar dengan ekstensi (jpg/jpeg/png/webp) yang diizinkan!"));
  }
};

// 5. Inisialisasi multer dengan limit ukuran maksimal 2MB per foto
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } 
});

module.exports = upload;