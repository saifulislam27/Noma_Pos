const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

// Semua rute di bawah ini wajib login (membawa token JWT yang valid)
router.use(authMiddleware);

/**
 * Rute GET diperbolehkan untuk siapa saja yang sudah login (Owner & Kasir)
 * agar kasir dapat melihat daftar kategori produk saat melayani transaksi.
 */
router.get(
  "/",
  getCategories
);

/**
 * Rute POST, PUT, dan DELETE tetap dikunci rapat khusus untuk OWNER saja.
 * Kasir yang mencoba mengakses rute ini akan diblokir otomatis.
 */
router.post(
  "/",
  roleMiddleware("owner"),
  createCategory
);

router.put(
  "/:id",
  roleMiddleware("owner"),
  updateCategory
);

router.delete(
  "/:id",
  roleMiddleware("owner"),
  deleteCategory
);

module.exports = router;