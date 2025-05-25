const Item = require('../models/sale');

// สร้างรหัส R_id ใหม่
const generateNextId = async () => {
  const [rows] = await Item.getLastSaleId();
  let newId = 'S0001';

  if (rows.length > 0) {
    const lastId = rows[0].S_id;
    const number = parseInt(lastId.slice(1)) + 1;
    newId = 'S' + number.toString().padStart(4, '0');
  }

  return newId;
};

// สร้างข้อมูลรับเข้า
exports.createSale = async (req, res) => {
  try {
    const { sale, sale_detail } = req.body;
    await Item.createSale(sale, sale_detail);
    res.json({ sale, sale_detail });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// สร้างรหัสใหม่
exports.getNewSaleId = async (req, res) => {
  try {
    const newId = await generateNextId();
    res.json({ S_id: newId });
  } catch (err) {
    res.status(500).json(err);
  }
};

// ดึงรายการรับเข้าทั้งหมด
exports.getSales = async (req, res) => {
  try {
    const [results] = await Item.getSales();
    res.json(results);
  } catch (err) {
    res.status(500).json(err);
  }
};

// ดึงรายการรับเข้ารายตัว (รวม detail)
exports.getSale= async (req, res) => {
  try {
    const result = await Item.getSaleById(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

// แก้ไขรายการรับเข้า (ใช้ transaction)
exports.updateSale = async (req, res) => {
  try {
  const { sale, sale_detail } = req.body;
  await Item.updateSale(sale, sale_detail);
    res.json({ message: 'Updated', sale, sale_detail });
  } catch (err) {
    res.status(500).json(err);
  }
};

// ลบรายการรับเข้า (คืน stock ก่อนลบ)
exports.deleteSale = async (req, res) => {
  try {
    const S_id = req.params.id;
    const result = await Item.getSaleById(S_id);
    const sale_detail = result.sale_detail;

    await Item.deleteSale(S_id, sale_detail);
    res.json({ message: 'Deleted', id: S_id });
  } catch (err) {
    res.status(500).json(err);
  }
};
