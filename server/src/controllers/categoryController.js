const pool = require("../config/db");

exports.getCategories = async (req, res) => {
  try {

    const [rows] =
      await pool.query(
        `
        SELECT *
        FROM categories
        ORDER BY id DESC
        `
      );

    res.json(rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Gagal mengambil kategori"
    });

  }
};

exports.createCategory = async (
  req,
  res
) => {

  try {

    const { name } =
      req.body;

    if (!name) {

      return res.status(400).json({
        message:
          "Nama kategori wajib diisi"
      });

    }

    const [result] =
      await pool.query(
        `
        INSERT INTO categories
        (name)
        VALUES (?)
        `,
        [name]
      );

    const [rows] =
      await pool.query(
        `
        SELECT *
        FROM categories
        WHERE id = ?
        `,
        [result.insertId]
      );

    res.status(201).json(
      rows[0]
    );

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Gagal menambah kategori"
    });

  }
};

exports.updateCategory = async (
  req,
  res
) => {

  try {

    const { id } =
      req.params;

    const { name } =
      req.body;

    await pool.query(
      `
      UPDATE categories
      SET name = ?
      WHERE id = ?
      `,
      [
        name,
        id
      ]
    );

    const [rows] =
      await pool.query(
        `
        SELECT *
        FROM categories
        WHERE id = ?
        `,
        [id]
      );

    if (
      rows.length === 0
    ) {

      return res.status(404).json({
        message:
          "Kategori tidak ditemukan"
      });

    }

    res.json(
      rows[0]
    );

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Gagal update kategori"
    });

  }
};

exports.deleteCategory = async (
  req,
  res
) => {

  try {

    const { id } =
      req.params;

    await pool.query(
      `
      DELETE FROM categories
      WHERE id = ?
      `,
      [id]
    );

    res.json({
      message:
        "Kategori berhasil dihapus"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Gagal hapus kategori"
    });

  }
};