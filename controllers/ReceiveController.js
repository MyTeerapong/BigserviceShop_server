const Item = require('../models/Receive');

// สร้างรหัส R_id ใหม่
const generateNextId = async () => {
  const [rows] = await Item.getLastReceiveId();
  let newId = 'R0001';

  if (rows.length > 0) {
    const lastId = rows[0].R_id;
    const number = parseInt(lastId.slice(1)) + 1;
    newId = 'R' + number.toString().padStart(4, '0');
  }

  return newId;
};

// สร้างข้อมูลรับเข้า
exports.createReceive = async (req, res) => {
  try {
    const { receive, receive_detail } = req.body;
    await Item.createReceive(receive, receive_detail);
    res.json({ receive, receive_detail });
  } catch (err) {
    res.status(500).json(err);
  }
};

// สร้างรหัสใหม่
exports.getNewReceiveId = async (req, res) => {
  try {
    const newId = await generateNextId();
    res.json({ R_id: newId });
  } catch (err) {
    res.status(500).json(err);
  }
};

// ดึงรายการรับเข้าทั้งหมด
exports.getReceives = async (req, res) => {
  try {
    const [results] = await Item.getReceive();
    res.json(results);
  } catch (err) {
    res.status(500).json(err);
  }
};

// ดึงรายการรับเข้ารายตัว (รวม detail)
exports.getReceive = async (req, res) => {
  try {
    const result = await Item.getReceiveById(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

// แก้ไขรายการรับเข้า (ใช้ transaction)
exports.updateReceive = async (req, res) => {
  try {
  const { receive, receive_detail } = req.body;
  await Item.updateReceive(receive, receive_detail);
    res.json({ message: 'Updated', receive, receive_detail });
  } catch (err) {
    res.status(500).json(err);
  }
};

// ลบรายการรับเข้า (คืน stock ก่อนลบ)
exports.deleteReceive = async (req, res) => {
  try {
    const R_id = req.params.id;
    const result = await Item.getReceiveById(R_id);
    const receiveDetails = result.receive_Detail;

    await Item.deleteReceive(R_id, receiveDetails);
    res.json({ message: 'Deleted', id: R_id });
  } catch (err) {
    res.status(500).json(err);
  }
};
