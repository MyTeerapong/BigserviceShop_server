const Item = require('../models/Type');

const generateNextId = async () => {
const [rows] = await Item.getLastTypeId();
let newId = 'T0001'; 

if (rows.length > 0) {
  const lastId = rows[0].T_id; 
  const number = parseInt(lastId.slice(1)) + 1; 
  newId = 'T' + number.toString().padStart(4, '0'); 
}
return newId;
};

exports.createType = async (req, res) => {
  try {
    const data = req.body;
    await Item.createType(data);
    res.json(data);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getNewTypeId = async (req, res) => {
  try {
    const newId = await generateNextId();
    res.json({ T_id: newId });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getTypes = async (req, res) => {
  try {
    const [results] = await Item.getType();
    res.json(results);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getType = async (req, res) => {
  try {
    const [results] = await Item.getTypeById(req.params.id);
    res.json(results[0]);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.updateType = async (req, res) => {
  try {
    await Item.updateType(req.params.id, req.body);
    res.json({ id: req.params.id, ...req.body });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.deleteType = async (req, res) => {
  try {
    await Item.deleteType(req.params.id);
    res.json({ message: 'Item deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json(err);
  }
};
