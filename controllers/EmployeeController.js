const Item = require('../models/Employee');

const generateNextId = async () => {
const [rows] = await Item.getLastEmployeeId();
let newId = 'E0001'; 

if (rows.length > 0) {
  const lastId = rows[0].Em_id; 
  const number = parseInt(lastId.slice(1)) + 1; 
  newId = 'E' + number.toString().padStart(4, '0'); 
}
return newId;
};

exports.createEmployee = async (req, res) => {
  try {
    const data = req.body;
    await Item.createEmployee(data);
    res.json(data);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getNewEmployeeId = async (req, res) => {
  try {
    const newId = await generateNextId();
    res.json({ Em_id: newId });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getEmployees = async (req, res) => {
  try {
    const [results] = await Item.getEmployee();
    res.json(results);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getEmployee = async (req, res) => {
  try {
    const [results] = await Item.getEmployeeById(req.params.id);
    res.json(results[0]);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    await Item.updateEmployee(req.params.id, req.body);
    res.json({ id: req.params.id, ...req.body });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    await Item.deleteEmployee(req.params.id);
    res.json({ message: 'Item deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json(err);
  }
};
