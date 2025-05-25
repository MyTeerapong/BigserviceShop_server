const Item = require('../models/Product');

const generateNextId = async () => {
const [rows] = await Item.getLastProductId();
let newId = 'P0001'; 

if (rows.length > 0) {
  const lastId = rows[0].P_id; 
  const number = parseInt(lastId.slice(1)) + 1; 
  newId = 'P' + number.toString().padStart(4, '0'); 
}
return newId;
};

exports.createProduct= async (req, res) => {
  try {
    const data = req.body;
    await Item.createProduct(data);
    res.json(data);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getNewProductId = async (req, res) => {
  try {
    const newId = await generateNextId();
    res.json({ P_id: newId });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getProducts = async (req, res) => {
  try {
    const [results] = await Item.getProduct();
    res.json(results);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getProduct = async (req, res) => {
  try {
    const [results] = await Item.getProductById(req.params.id);
    res.json(results[0]);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.updateProduct = async (req, res) => {
  try {
    await Item.updateProduct(req.params.id, req.body);
    res.json({ id: req.params.id, ...req.body });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Item.deleteProduct(req.params.id);
    res.json({ message: 'Item deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json(err);
  }
};
