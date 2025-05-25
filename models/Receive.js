const db = require('../config/db');

exports.getLastReceiveId = () => {
  return db.promise().query('SELECT R_id FROM receive ORDER BY CAST(SUBSTRING(R_id, 2) AS UNSIGNED) DESC LIMIT 1;');
};

exports.createReceive = async (receive, receive_detail) => {
  const conn = await db.promise().getConnection();
  try {
    await conn.beginTransaction();

    // Insert main receive
    await conn.query(
      'INSERT INTO receive (R_id, R_date, D_id, Em_id) VALUES (?, ?, ?, ?)',
      [receive.R_id, receive.R_date, receive.D_id, receive.Em_id]
    );

    // Insert each receive_detail item
    for (const item of receive_detail) {
      if (!item.P_id) {
        throw new Error('P_id is missing in receive_detail item');
      }

      await conn.query(
        'INSERT INTO receive_detail (R_id, P_id, RD_priceunit, RD_unit, RD_quantity) VALUES (?, ?, ?, ?, ?)',
        [receive.R_id, item.P_id, item.RD_priceunit, item.RD_unit, item.RD_quantity]
      );

      // Update stock
      await conn.query(
        'UPDATE product SET P_quantity = P_quantity + ? WHERE P_id = ?',
        [item.RD_quantity, item.P_id]
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


exports.deleteReceive = async (R_id, receiveDetails) => {
  const conn = await db.promise().getConnection();
  try {
    await conn.beginTransaction();

    // 1. คืนสต็อกก่อนลบ
    for (const detail of receiveDetails) {
      await conn.query(
        'UPDATE product SET P_quantity = P_quantity - ? WHERE P_id = ?',
        [detail.RD_quantity, detail.P_id]
      );
    }

    // 2. ลบจาก receive_detail
    await conn.query('DELETE FROM receive_detail WHERE R_id = ?', [R_id]);

    // 3. ลบจาก receive
    await conn.query('DELETE FROM receive WHERE R_id = ?', [R_id]);

    await conn.commit();
    return { success: true };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

exports.updateReceive = async (receive, receiveDetails) => {
  const conn = await db.promise().getConnection();
  try {
    await conn.beginTransaction();

    // 1. แก้ข้อมูล receive
    await conn.query(
      'UPDATE receive SET R_date = ?, D_id = ?, Em_id = ? WHERE R_id = ?',
      [receive.R_date, receive.D_id, receive.Em_id, receive.R_id]
    );

    // 2. ลบของเดิม และเพิ่มใหม่
    await conn.query('DELETE FROM receive_detail WHERE R_id = ?', [receive.R_id]);

    for (const detail of receiveDetails) {
      await conn.query(
        'INSERT INTO receive_detail (R_id, P_id, RD_priceunit, RD_unit, RD_quantity) VALUES (?, ?, ?, ?, ?)',
        [receive.R_id, detail.P_id, detail.RD_priceunit, detail.RD_unit, detail.RD_quantity]
      );

      await conn.query(
        'UPDATE product SET P_quantity = P_quantity + ? WHERE P_id = ?',
        [detail.RD_quantity, detail.P_id]
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

exports.getReceive = () => {
  return db.promise().query('SELECT r.*, D_name, Em_name FROM receive r JOIN dealer d ON r.D_id = d.D_id JOIN employee e ON r.Em_id = e.Em_id');
};

exports.getReceiveById = async (R_id) => {
  try {
    const [receiveRows] = await db.promise().query(
      'SELECT * FROM receive WHERE R_id = ?',
      [R_id]
    );

    const [receiveDetailRows] = await db.promise().query(
      'SELECT * FROM receive_detail WHERE R_id = ?',
      [R_id]
    );

    return { receive: receiveRows, receive_Detail: receiveDetailRows };
  } catch (err) {
    throw err;
  }
};
