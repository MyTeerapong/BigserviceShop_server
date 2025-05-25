const Item = require('../models/Change');

// สร้างรหัส R_id ใหม่
const generateNextId = async () => {
  const [rows] = await Item.getLastChangeId();
  let newId = 'CH001';

  if (rows.length > 0) {
    const lastId = rows[0].Ch_id;
    const number = parseInt(lastId.slice(1)) + 1;
    newId = 'CH' + number.toString().padStart(3, '0');
  }

  return newId;
};

// สร้างข้อมูลรับเข้า
exports.createChange = async (req, res) => {
  try {
    const { change, change_detail } = req.body;
    await Item.createChange(change, change_detail);
    res.json({ change, change_detail });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// สร้างรหัสใหม่
exports.getNewChangeId = async (req, res) => {
  try {
    const newId = await generateNextId();
    res.json({ Ch_id: newId });
  } catch (err) {
    res.status(500).json(err);
  }
};

// ดึงรายการรับเข้าทั้งหมด
exports.getChanges = async (req, res) => {
  try {
    const [results] = await Item.getChanges();
    res.json(results);
  } catch (err) {
    res.status(500).json(err);
  }
};

// ดึงรายการรับเข้ารายตัว (รวม detail)
exports.getChange= async (req, res) => {
  try {
    const result = await Item.getChangeById(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

// ลบรายการรับเข้า (คืน stock ก่อนลบ)
exports.deleteChange = async (req, res) => {
  try {
    const Ch_id = req.params.id;
    const result = await Item.getChangeById(Ch_id);
    const change_detail = result.change_detail;
    const change = result.change[0]; // ดึงข้อมูลหลักจาก array

    await Item.deleteChange(Ch_id, change_detail, change.S_id); // ส่ง S_id ไปด้วย
    res.json({ message: 'Deleted', id: Ch_id });
  } catch (err) {
    res.status(500).json(err);
  }
};

