const express = require("express");
const router = express.Router();

// Import middleware yang diperlukan
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  login,
  registerOwner,
  registerCashier,
  getCashiers // 👈 1. Tambahkan import fungsi getCashiers di sini
} = require("../controllers/authController");

// Rute Publik (Siapa saja bisa mengakses tanpa token)
router.post("/login", login);
router.post("/register", registerOwner); // Registrasi Owner pertama kali

/**
 * 🌟 Rute Tambah Kasir Baru (DILINDUNGI)
 * Wajib membawa token login (authMiddleware) DAN harus memiliki role 'owner' (roleMiddleware)
 */
router.post(
  "/register-cashier",
  authMiddleware,
  roleMiddleware("owner"),
  registerCashier
);

/**
 * 🌟 Rute Ambil Daftar Kasir (DILINDUNGI)
 * Digunakan untuk memunculkan list kasir pada tabel di halaman Owner
 */
router.get(
  "/cashiers",
  authMiddleware,
  roleMiddleware("owner"),
  getCashiers // 👈 2. Daftarkan rute GET di sini
);

module.exports = router;