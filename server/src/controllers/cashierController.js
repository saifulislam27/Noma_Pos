const pool = require("../config/db");
const bcrypt = require("bcryptjs");

exports.getCashiers = async (req, res) => {
  try {
    // Menambahkan filter WHERE is_active = 1
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE role = 'cashier' AND is_active = 1"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil data kasir: " + err.message });
  }
};
exports.createCashier = async (req, res) => {
  try {

    const {
      name,
      username,
      password
    } = req.body;

    const [existing] =
      await pool.query(
        `
        SELECT id
        FROM users
        WHERE username = ?
        `,
        [username]
      );

    if (existing.length > 0) {
      return res.status(400).json({
        message: "Username sudah digunakan"
      });
    }

    const hash =
      await bcrypt.hash(
        password,
        10
      );

    const [result] =
      await pool.query(
        `
        INSERT INTO users
        (
          name,
          username,
          password,
          role
        )
        VALUES
        (?, ?, ?, 'cashier')
        `,
        [
          name,
          username,
          hash
        ]
      );

    res.status(201).json({
      id: result.insertId,
      name,
      username,
      role: "cashier"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Gagal tambah kasir"
    });

  }
};

exports.updateCashier = async (
  req,
  res
) => {

  try {

    const { id } =
      req.params;

    const {
      name,
      username
    } = req.body;

    await pool.query(
      `
      UPDATE users
      SET
        name = ?,
        username = ?
      WHERE id = ?
      `,
      [
        name,
        username,
        id
      ]
    );

    const [rows] =
      await pool.query(
        `
        SELECT
          id,
          name,
          username,
          role
        FROM users
        WHERE id = ?
        `,
        [id]
      );

    res.json(
      rows[0]
    );

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Gagal update kasir"
    });

  }
};

exports.resetPassword = async (
  req,
  res
) => {

  try {

    const { id } =
      req.params;

    const hash =
      await bcrypt.hash(
        "123456",
        10
      );

    await pool.query(
      `
      UPDATE users
      SET password = ?
      WHERE id = ?
      `,
      [
        hash,
        id
      ]
    );

    res.json({
      message:
        "Password berhasil direset ke 123456"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Gagal reset password"
    });

  }
};

// Di src/controllers/cashierController.js
exports.deactivateCashier = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("UPDATE users SET is_active = 0 WHERE id = ?", [id]);
    res.json({ message: "Kasir berhasil dinonaktifkan" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCashier = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM users WHERE id = ?", [id]);
    res.json({ message: "Kasir berhasil dihapus permanen" });
  } catch (err) {
    res.status(500).json({ error: "Gagal menghapus kasir: " + err.message });
  }
};