const pool = require("../config/db");

exports.getProducts = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        p.*,
        c.name AS category_name
      FROM products p
      LEFT JOIN categories c
      ON c.id = p.category_id
      ORDER BY p.id DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Gagal mengambil produk"
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, category_id, price } = req.body;

    const image = req.file ? req.file.filename : null;

    const [result] = await pool.query(
      `
      INSERT INTO products
      (
        name,
        image,
        category_id,
        price
      )
      VALUES
      (?, ?, ?, ?)
      `,
      [name, image, Number(category_id), Number(price)]
    );

    const [rows] = await pool.query(
      `
      SELECT *
      FROM products
      WHERE id = ?
      `,
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Gagal tambah produk"
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category_id, price } = req.body;

    if (!name || !category_id || !price) {
      return res.status(400).json({
        message: "Nama, kategori, dan harga wajib diisi"
      });
    }

    const [oldRows] = await pool.query(
      `SELECT * FROM products WHERE id = ?`,
      [id]
    );

    if (oldRows.length === 0) {
      return res.status(404).json({
        message: "Produk tidak ditemukan"
      });
    }

    const oldProduct = oldRows[0];
    const finalImage = req.file ? req.file.filename : oldProduct.image;

    await pool.query(
      `
      UPDATE products
      SET
        name = ?,
        image = ?,
        category_id = ?,
        price = ?
      WHERE id = ?
      `,
      [
        name,
        finalImage,
        Number(category_id),
        Number(price),
        Number(id)
      ]
    );

    res.json({
      message: "Produk berhasil diupdate"
    });
  } catch (error) {
    console.error("ERROR DETAIL UPDATE PRODUCT:", error);
    res.status(500).json({
      message: "Gagal update produk",
      error: error.message
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      `
      DELETE FROM products
      WHERE id = ?
      `,
      [id]
    );

    res.json({
      message: "Produk berhasil dihapus"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Gagal hapus produk"
    });
  }
};