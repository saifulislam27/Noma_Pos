const express = require("express");
const router = express.Router();

// Import middleware pengunci keamanan
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Import controller laporan penjualan yang sudah kita rancang sebelumnya
const { getSalesReport } = require("../controllers/reportController");

// Semua rute di bawah ini wajib melampirkan Token login yang valid
router.use(authMiddleware);

/**
 * 🌟 Rute Menarik Laporan Penjualan (DILINDUNGI)
 * Hanya boleh diakses oleh user yang memiliki role 'owner'
 * Endpoint ini menerima query parameter string: ?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 */
router.get(
  "/sales",
  roleMiddleware("owner"),
  getSalesReport
);

module.exports = router;