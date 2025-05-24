const db = require('../config/db');
exports.getLastDealerId = () => {
  return db.promise().query('SELECT D_id FROM dealer ORDER BY CAST(SUBSTRING(D_id, 2) AS UNSIGNED) DESC LIMIT 1;');
};

exports.getDealer = () => {
  return db.promise().query('SELECT * FROM dealer');
};

exports.getDealerById = (id) => {
  return db.promise().query('SELECT * FROM dealer WHERE D_id = ?', [id]);
};

exports.createDealer = (data) => {
  return db.promise().query('INSERT INTO dealer (D_id, D_name, D_address, D_tel) VALUES (?, ?, ?, ?)', [
    data.D_id,
    data.D_name,
    data.D_address,
    data.D_tel,
  ]);
};

exports.updateDealer = (id, data) => {
  return db.promise().query('UPDATE dealer SET ? WHERE D_id = ?', [data, id]);
};

exports.deleteDealer = (id) => {
  return db.promise().query('DELETE FROM dealer WHERE D_id = ?', [id]);
};
