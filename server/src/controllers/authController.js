const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // cek user
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    const user = rows[0];

    if (!user) {
      return res.status(400).json({
        message: "Username tidak ditemukan",
      });
    }

    // cek password
    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!validPassword) {
      return res.status(400).json({
        message: "Password salah",
      });
    }

    // generate token (role di sini akan mengikuti database: 'owner' atau 'cashier')
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

/*
|--------------------------------------------------------------------------
| REGISTER CASHIER (UNTUK OWNER)
|--------------------------------------------------------------------------
*/
exports.registerCashier = async (req, res) => {
  try {
    const { name, username, password } = req.body;

    // cek username
    const [existing] = await pool.query(
      "SELECT id FROM users WHERE username = ?",
      [username]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        message: "Username sudah digunakan",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    // Menggunakan 'cashier' agar konsisten dengan pengecekan di route
    const [result] = await pool.query(
      `
      INSERT INTO users (name, username, password, role)
      VALUES (?, ?, ?, 'cashier')
      `,
      [name, username, hash]
    );

    return res.status(201).json({
      message: "Cashier berhasil dibuat",
      user: {
        id: result.insertId,
        name,
        username,
        role: "cashier",
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Gagal membuat cashier",
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET ALL CASHIERS
|--------------------------------------------------------------------------
*/
exports.getCashiers = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, username, created_at FROM users WHERE role = 'cashier' ORDER BY id DESC"
    );

    return res.json(rows);
  } catch (error) {
    console.error("GET CASHIERS ERROR:", error);
    return res.status(500).json({
      message: "Gagal mengambil data daftar kasir",
    });
  }
};

/*
|--------------------------------------------------------------------------
| REGISTER OWNER
|--------------------------------------------------------------------------
*/
exports.registerOwner = async (req, res) => {
  try {
    const { name, username, password } = req.body;

    const [ownerRows] = await pool.query(
      "SELECT id FROM users WHERE role = 'owner'"
    );

    if (ownerRows.length > 0) {
      return res.status(403).json({
        message: "Owner sudah terdaftar",
      });
    }

    const [existingRows] = await pool.query(
      "SELECT id FROM users WHERE username = ?",
      [username]
    );

    if (existingRows.length > 0) {
      return res.status(400).json({
        message: "Username sudah digunakan",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `
        INSERT INTO users (name, username, password, role)
        VALUES (?, ?, ?, 'owner')
      `,
      [name, username, hash]
    );

    return res.status(201).json({
      message: "Owner berhasil dibuat",
      user: {
        id: result.insertId,
        name,
        username,
        role: "owner",
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({
      message: "Gagal membuat owner",
    });
  }
};