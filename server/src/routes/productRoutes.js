const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// 🌟 LANGKAH 1: Impor konfigurasi multer (sesuaikan jalur folder jika config upload-mu ada di tempat lain)
const upload = require("../middleware/uploadMiddleware"); 
// Catatan: Jika berkas upload kamu ada di folder config, gunakan: require("../config/multer") atau sejenisnya.

const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// Semua rute produk wajib login
router.use(authMiddleware);

// Kasir & Owner boleh melihat produk untuk kebutuhan jualan dan manajemen
router.get("/", getProducts);

// 🌟 LANGKAH 2: Pasang upload.single("image") di rute POST sebelum roleMiddleware & controller
// Hanya Owner yang boleh mengelola data produk (Tambah)
router.post(
  "/",
  upload.single("image"), // 👈 Mengurai FormData saat tambah produk baru
  roleMiddleware("owner"),
  createProduct
);

// 🌟 LANGKAH 3: Pasang upload.single("image") di rute PUT sebelum roleMiddleware & controller
// Hanya Owner yang boleh mengelola data produk (Edit/Update)
router.put(
  "/:id",
  upload.single("image"), // 👈 Mengurai FormData saat edit produk
  roleMiddleware("owner"),
  updateProduct
);

// Hanya Owner yang boleh mengelola data produk (Hapus)
router.delete("/:id", roleMiddleware("owner"), deleteProduct);

module.exports = router;