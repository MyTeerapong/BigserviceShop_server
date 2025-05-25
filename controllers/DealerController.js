const Item = require('../models/Dealer');

const generateNextId = async () => {
const [rows] = await Item.getLastDealerId();
let newId = 'D0001'; 

if (rows.length > 0) {
  const lastId = rows[0].D_id; 
  const number = parseInt(lastId.slice(1)) + 1; 
  newId = 'D' + number.toString().padStart(4, '0'); 
}
return newId;
};

exports.createDealer = async (req, res) => {
  try {
    const data = req.body;
    await Item.createDealer(data);
    res.json(data);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getNewDealerId = async (req, res) => {
  try {
    const newId = await generateNextId();
    res.json({ D_id: newId });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getDealers = async (req, res) => {
  try {
    const [results] = await Item.getDealer();
    res.json(results);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getDealer = async (req, res) => {
  try {
    const [results] = await Item.getDealerById(req.params.id);
    res.json(results[0]);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.updateDealer = async (req, res) => {
  try {
    await Item.updateDealer(req.params.id, req.body);
    res.json({ id: req.params.id, ...req.body });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.deleteDealer = async (req, res) => {
  try {
    await Item.deleteDealer(req.params.id);
    res.json({ message: 'Item deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json(err);
  }
};
