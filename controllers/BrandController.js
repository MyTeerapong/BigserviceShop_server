const Item = require('../models/Brand');

const generateNextId = async () => {
const [rows] = await Item.getLastTypeId();
let newId = 'B0001'; 

if (rows.length > 0) {
  const lastId = rows[0].B_id; 
  const number = parseInt(lastId.slice(1)) + 1; 
  newId = 'B' + number.toString().padStart(4, '0'); 
}
return newId;
};

exports.createBrand = async (req, res) => {
  try {
    const data = req.body;
    await Item.createBrand(data);
    res.json(data);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getNewBrandId = async (req, res) => {
  try {
    const newId = await generateNextId();
    res.json({ B_id: newId });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getBrands = async (req, res) => {
  try {
    const [results] = await Item.getBrand();
    res.json(results);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getBrand = async (req, res) => {
  try {
    const [results] = await Item.getBrandById(req.params.id);
    res.json(results[0]);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.updateBrand = async (req, res) => {
  try {
    await Item.updateBrand(req.params.id, req.body);
    res.json({ id: req.params.id, ...req.body });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.deleteBrand = async (req, res) => {
  try {
    await Item.deleteBrand(req.params.id);
    res.json({ message: 'Item deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json(err);
  }
};
