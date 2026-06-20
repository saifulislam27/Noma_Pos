/**
 * Role Middleware
 * Digunakan untuk membatasi akses berdasarkan role user.
 * Penggunaan di Routes: roleMiddleware("owner", "kasir")
 */
module.exports = (...roles) => {
  return (req, res, next) => {
    // 1. Cek apakah user sudah ter-autentikasi (dilakukan oleh authMiddleware sebelumnya)
    if (!req.user) {
      return res.status(401).json({ 
        message: "Unauthorized: Anda harus login terlebih dahulu" 
      });
    }

    // 2. Cek apakah role user ada di dalam daftar roles yang diizinkan
    // roles di sini berupa array karena kita menggunakan rest parameter (...roles)
    if (!roles.includes(req.user.role)) {
      console.error(`Akses Ditolak: User ${req.user.name} dengan role '${req.user.role}' mencoba mengakses rute yang memerlukan salah satu dari role: ${roles.join(", ")}`);
      
      return res.status(403).json({ 
        message: "Akses ditolak: Anda tidak memiliki izin untuk tindakan ini" 
      });
    }

    // 3. Jika lolos, lanjut ke controller
    next();
  };
};