const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const { getDashboardSummary } = require("../controllers/dashboardController");

// Hanya user yang sudah login dan bertindak sebagai Owner yang boleh melihat dashboard utama ini
router.get("/", authMiddleware, roleMiddleware("owner"), getDashboardSummary);

module.exports = router;