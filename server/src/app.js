const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const cashierRoutes = require("./routes/cashierRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

/*
|--------------------------------------------------------------------------
| Global Middleware
|--------------------------------------------------------------------------
*/
// 🌟 PERBAIKAN: Konfigurasi CORS agar mendukung akses dari Vercel
const corsOptions = {
  origin: [
    "https://noma-hqd2utrow-rocking199.vercel.app", 
    "http://localhost:5173" // Tambahkan jika Anda masih sering testing lokal
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true, // Wajib agar HP mengizinkan pengiriman kredensial
};

app.use(cors(corsOptions));
app.use(express.json());

// 🌟 TAMBAHAN: Logging untuk Debugging di Railway
// Ini akan membantu Anda melihat request apa yang masuk dari HP di dashboard Railway
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

/*
|--------------------------------------------------------------------------
| Static Files
|--------------------------------------------------------------------------
*/
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