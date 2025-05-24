const db = require('../config/db');
exports.getLastTypeId = () => {
  return db.promise().query('SELECT B_id FROM brand ORDER BY CAST(SUBSTRING(B_id, 2) AS UNSIGNED) DESC LIMIT 1;');
};

exports.getBrand = () => {
  return db.promise().query('SELECT * FROM brand');
};

exports.getBrandById = (id) => {
  return db.promise().query('SELECT * FROM brand WHERE B_id = ?', [id]);
};

exports.createBrand = (data) => {
  return db.promise().query('INSERT INTO brand (B_id, B_name) VALUES (?, ?)', [
    data.B_id,
    data.B_name,
  ]);
};

exports.updateBrand = (id, data) => {
  return db.promise().query('UPDATE brand SET ? WHERE B_id = ?', [data, id]);
};

exports.deleteBrand = (id) => {
  return db.promise().query('DELETE FROM brand WHERE B_id = ?', [id]);
};
