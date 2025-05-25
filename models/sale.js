const db = require('../config/db');

exports.getLastSaleId = () => {
  return db.promise().query('SELECT S_id FROM sale ORDER BY CAST(SUBSTRING(S_id, 2) AS UNSIGNED) DESC LIMIT 1;');
};

exports.createSale = async (sale, sale_detail) => {
  const conn = await db.promise().getConnection();
  try {
    await conn.beginTransaction();

    // Insert main sale
    await conn.query(
      'INSERT INTO sale (S_id, S_date, S_total, S_status, S_customer, Em_id) VALUES ( ?, ?, ?, ?, ?, ?)',
      [sale.S_id, sale.S_date, sale.S_total, sale.S_status, sale.S_customer, sale.Em_id]
    );

    // Insert each receive_detail item
    for (const item of sale_detail) {
      if (!item.P_id) {
        throw new Error('P_id is missing in sale_detail item');
      }

      await conn.query(
        'INSERT INTO sale_detail (S_id, P_id, SD_priceunit, SD_total, SD_quantity) VALUES (?, ?, ?, ?, ?)',
        [sale.S_id, item.P_id, item.SD_priceunit, item.SD_total, item.SD_quantity]
      );

      // Update stock
      await conn.query(
        'UPDATE product SET P_quantity = P_quantity - ? WHERE P_id = ?',
        [item.SD_quantity, item.P_id]
      );
    }

    await conn.commit();
    return { success: true };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};


exports.deleteSale = async (S_id, sale_detail) => {
  const conn = await db.promise().getConnection();
  try {
    await conn.beginTransaction();

    // 1. คืนสต็อกก่อนลบ
    for (const detail of sale_detail) {
      await conn.query(
        'UPDATE product SET P_quantity = P_quantity + ? WHERE P_id = ?',
        [detail.SD_quantity, detail.P_id]
      );
    }

    // 2. ลบจาก sale_detail
    await conn.query('DELETE FROM sale_detail WHERE S_id = ?', [S_id]);

    // 3. ลบจาก sale
    await conn.query('DELETE FROM sale WHERE S_id = ?', [S_id]);

    await conn.commit();
    return { success: true };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

exports.updateSale = async (sale, sale_detail) => {
  const conn = await db.promise().getConnection();
  try {
    await conn.beginTransaction();

    await conn.query(
      'UPDATE sale SET S_date = ?, S_total = ?, S_status = ?, S_customer = ?, Em_id = ? WHERE S_id = ?',
      [sale.S_date, sale.S_total, sale.S_status, sale.S_customer, sale.Em_id, sale.S_id]
    );

    await conn.query('DELETE FROM sale_detail WHERE S_id = ?', [sale.S_id]);

    for (const detail of sale_detail) {
      await conn.query(
        'INSERT INTO sale_detail (S_id, P_id, SD_priceunit, SD_total, SD_quantity) VALUES (?, ?, ?, ?, ?)',
        [sale.S_id, detail.P_id, detail.SD_priceunit, detail.SD_total, detail.SD_quantity]
      );

      await conn.query(
        'UPDATE product SET P_quantity = P_quantity - ? WHERE P_id = ?',
        [detail.SD_quantity, detail.P_id]
      );
    }


    await conn.commit();
    return { success: true };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

exports.getSales = () => {
  return db.promise().query('SELECT s.*, Em_name FROM sale s JOIN employee e ON s.Em_id = e.Em_id');
};

exports.getSaleById = async (S_id) => {
  try {
    const [saleRows] = await db.promise().query(
      'SELECT * FROM sale WHERE S_id = ?',
      [S_id]
    );

    const [saleDetailRows] = await db.promise().query(
      'SELECT * FROM sale_detail WHERE S_id = ?',
      [S_id]
    );

    return { sale: saleRows, sale_detail: saleDetailRows };
  } catch (err) {
    throw err;
  }
};
