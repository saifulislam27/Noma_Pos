const pool = require("../config/db");

exports.createTransaction = async (
  req,
  res
) => {

  const connection =
    await pool.getConnection();

  try {

    await connection.beginTransaction();

    const {
      payment_method,
      items
    } = req.body;

    let total = 0;

    for (const item of items) {

      const [products] =
        await connection.query(
          `
          SELECT *
          FROM products
          WHERE id = ?
          `,
          [item.product_id]
        );

      if (
        products.length === 0
      ) {

        throw new Error(
          "Produk tidak ditemukan"
        );

      }

      total +=
        Number(
          products[0].price
        ) *
        item.qty;
    }

    const [saleResult] =
      await connection.query(
        `
        INSERT INTO sales
        (
          cashier_id,
          payment_method,
          total
        )
        VALUES
        (?, ?, ?)
        `,
        [
          req.user.id,
          payment_method,
          total
        ]
      );

    const saleId =
      saleResult.insertId;

    for (const item of items) {

      const [products] =
        await connection.query(
          `
          SELECT *
          FROM products
          WHERE id = ?
          `,
          [item.product_id]
        );

      const product =
        products[0];

      const price =
        Number(
          product.price
        );

      await connection.query(
        `
        INSERT INTO sale_items
        (
          sale_id,
          product_id,
          qty,
          price,
          subtotal
        )
        VALUES
        (?, ?, ?, ?, ?)
        `,
        [
          saleId,
          item.product_id,
          item.qty,
          price,
          price * item.qty
        ]
      );
    }

    await connection.commit();

    res.status(201).json({
      message:
        "Transaksi berhasil",
      sale_id:
        saleId
    });

  } catch (error) {

    await connection.rollback();

    console.error(error);

    res.status(500).json({
      message:
        "Gagal membuat transaksi"
    });

  } finally {

    connection.release();

  }
};

exports.getTransactions =
async (req, res) => {

  try {

    const [rows] =
      await pool.query(
        `
        SELECT
          s.*,
          u.name AS cashier_name
        FROM sales s
        LEFT JOIN users u
        ON u.id = s.cashier_id
        ORDER BY s.id DESC
        `
      );

    res.json(rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Gagal mengambil transaksi"
    });

  }
};

exports.getTransactionById =
async (req, res) => {

  try {

    const { id } =
      req.params;

    const [sales] =
      await pool.query(
        `
        SELECT *
        FROM sales
        WHERE id = ?
        `,
        [id]
      );

    if (
      sales.length === 0
    ) {

      return res.status(404).json({
        message:
          "Transaksi tidak ditemukan"
      });

    }

    const [items] =
      await pool.query(
        `
        SELECT
          si.*,
          p.name AS product_name
        FROM sale_items si
        JOIN products p
        ON p.id = si.product_id
        WHERE si.sale_id = ?
        `,
        [id]
      );

    res.json({
      transaction:
        sales[0],
      items
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Gagal mengambil detail transaksi"
    });

  }
};

exports.updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { items, payment_method } = req.body; // items: array of {product_id, qty, price}
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Hitung ulang total dari items baru
    let newTotal = 0;
    for (const item of items) {
      newTotal += Number(item.price) * item.qty;
    }

    // 2. Update data utama di tabel 'sales'
    await connection.query(
      "UPDATE sales SET total = ?, payment_method = ? WHERE id = ?",
      [newTotal, payment_method, id]
    );

    // 3. Hapus detail lama di 'sale_items'
    await connection.query("DELETE FROM sale_items WHERE sale_id = ?", [id]);

    // 4. Masukkan detail baru ke 'sale_items'
    for (const item of items) {
      await connection.query(
        `INSERT INTO sale_items (sale_id, product_id, qty, price, subtotal) 
         VALUES (?, ?, ?, ?, ?)`,
        [id, item.product_id, item.qty, item.price, item.price * item.qty]
      );
    }

    await connection.commit();
    res.json({ message: "Transaksi berhasil diperbarui" });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ message: "Gagal memperbarui transaksi", error: error.message });
  } finally {
    connection.release();
  }
};

exports.deleteTransaction =
async (req, res) => {

  try {

    const { id } =
      req.params;

    await pool.query(
      `
      DELETE FROM sales
      WHERE id = ?
      `,
      [id]
    );

    res.json({
      message:
        "Transaksi berhasil dihapus"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Gagal hapus transaksi"
    });

  }
};
// Tambahkan fungsi ini di controller transaksi Anda
exports.updateTransactionItems = async (req, res) => {
  const { id } = req.params; // ID Transaksi
  const { items } = req.body; // Array item baru: [{id, qty, price}, ...]

  try {
    await pool.query("START TRANSACTION");

    for (const item of items) {
      // Update qty dan hitung ulang subtotal (qty * price)
      await pool.query(
        "UPDATE sale_items SET qty = ?, subtotal = (? * price) WHERE id = ?",
        [item.qty, item.qty, item.id]
      );
    }

    // Hitung ulang total transaksi di tabel sales
    await pool.query(
      "UPDATE sales SET total = (SELECT SUM(subtotal) FROM sale_items WHERE sale_id = ?) WHERE id = ?",
      [id, id]
    );

    await pool.query("COMMIT");
    res.json({ message: "Transaksi berhasil diperbarui" });
  } catch (err) {
    await pool.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  }
};
exports.deleteTransaction = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM sales WHERE id = ?", [id]);
    res.json({ message: "Transaksi berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};