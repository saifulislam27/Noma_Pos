const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction
} = require("../controllers/transactionController");

// Semua rute di bawah ini memerlukan login (Autentikasi)
router.use(authMiddleware);

// Rute umum
router.get("/", getTransactions);

// RUTE DENGAN ROLE MIDDLEWARE
// PENTING: Gunakan 'cashier' (sesuai database) dan TANPA kurung siku []
router.get(
  "/:id",
  roleMiddleware("owner", "cashier"), 
  getTransactionById
);

router.post(
  "/", 
  createTransaction
);

router.put(
  "/:id",
  roleMiddleware("owner", "cashier"), 
  updateTransaction
);

router.delete(
  "/:id",
  roleMiddleware("owner", "cashier"), 
  deleteTransaction
);

module.exports = router;