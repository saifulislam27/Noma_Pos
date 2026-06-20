const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const cashierRoutes = require("./routes/cashierRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
// 🌟 1. Import file reportRoutes di sini
const reportRoutes = require("./routes/reportRoutes");

const app = express();

/*
|--------------------------------------------------------------------------
| Global Middleware
|--------------------------------------------------------------------------
*/
app.use(cors());
app.use(express.json());

/*
|--------------------------------------------------------------------------
| Static Files
|--------------------------------------------------------------------------
*/
// 🌟 PERBAIKAN KUNCI: Diarahkan langsung ke folder 'uploads/products' agar pas dengan pemanggilan frontend
app.use(
  "/uploads/products",
  express.static(path.join(__dirname, "uploads/products"))
);

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/cashiers", cashierRoutes);

// 🌟 2. Daftarkan middleware route untuk Laporan (Reports)
app.use("/api/reports", reportRoutes);

/*
|--------------------------------------------------------------------------
| 404 Handler
|--------------------------------------------------------------------------
*/
app.use((req, res) => {
  res.status(404).json({
    message: "Endpoint tidak ditemukan"
  });
});

module.exports = app;