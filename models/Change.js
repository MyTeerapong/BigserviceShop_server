const db = require('../config/db');

exports.getLastChangeId = () => {
  return db.promise().query('SELECT Ch_id FROM changes ORDER BY CAST(SUBSTRING(Ch_id, 2) AS UNSIGNED) DESC LIMIT 1;');
};

exports.createChange = async (change, change_detail) => {
  const conn = await db.promise().getConnection();
  try {
    await conn.beginTransaction();

    // Insert main sale
    await conn.query(
      'INSERT INTO changes (Ch_id, Ch_date, S_id, Em_id) VALUES ( ?, ?, ?, ?)',
      [change.Ch_id, change.Ch_date, change.S_id, change.Em_id]
    );

    // Insert each receive_detail item
    for (const item of change_detail) {
      if (!item.P_id) {
        throw new Error('P_id is missing in sale_detail item');
      }

      await conn.query(
        'INSERT INTO change_detail (Ch_id, P_id, Chd_priceunit, Chd_quantity, Chd_detail) VALUES (?, ?, ?, ?, ?)',
        [change.Ch_id, item.P_id, item.Chd_priceunit, item.Chd_quantity, item.Chd_detail]
      );

      // Update stock
      await conn.query(
        'UPDATE product SET P_quantity = P_quantity - ? WHERE P_id = ?',
        [item.Chd_quantity, item.P_id]
      );

      await conn.query(
        'UPDATE sale SET S_status = "เปลี่ยน" WHERE S_id = ?',
        [change.S_id]
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


exports.deleteChange = async (Ch_id, change_detail, S_id) => {
  const conn = await db.promise().getConnection();
  try {
    await conn.beginTransaction();

    // 1. คืนสต็อกก่อนลบ
    for (const detail of change_detail) {
      await conn.query(
        'UPDATE product SET P_quantity = P_quantity + ? WHERE P_id = ?',
        [detail.Chd_quantity, detail.P_id]
      );
    }

    // 2. อัปเดตสถานะการขายกลับเป็น "ปกติ"
    await conn.query(
      'UPDATE sale SET S_status = "ปกติ" WHERE S_id = ?',
      [S_id]
    );

    // 3. ลบรายละเอียด
    await conn.query('DELETE FROM change_detail WHERE Ch_id = ?', [Ch_id]);

    // 4. ลบข้อมูลหลัก
    await conn.query('DELETE FROM changes WHERE Ch_id = ?', [Ch_id]);

    await conn.commit();
    return { success: true };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};


exports.getChanges = () => {
  return db.promise().query('SELECT ch.*, Em_name FROM changes ch JOIN employee e ON ch.Em_id = e.Em_id');
};

exports.getChangeById = async (ch_id) => {
  try {
    const [changeRows] = await db.promise().query(
      'SELECT * FROM changes WHERE ch_id = ?',
      [ch_id]
    );

    const [changedetailRows] = await db.promise().query(
      'SELECT * FROM change_detail WHERE ch_id = ?',
      [ch_id]
    );

    return { change: changeRows, change_detail: changedetailRows };
  } catch (err) {
    throw err;
  }
};
