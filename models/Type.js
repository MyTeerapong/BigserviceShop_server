const db = require('../config/db');
exports.getLastTypeId = () => {
  return db.promise().query('SELECT T_id FROM type ORDER BY CAST(SUBSTRING(T_id, 2) AS UNSIGNED) DESC LIMIT 1;');
};

exports.getType = () => {
  return db.promise().query('SELECT * FROM type');
};

exports.getTypeById = (id) => {
  return db.promise().query('SELECT * FROM type WHERE T_id = ?', [id]);
};

exports.createType = (data) => {
  return db.promise().query('INSERT INTO type (T_id, T_name) VALUES (?, ?)', [
    data.T_id,
    data.T_name,
  ]);
};

exports.updateType = (id, data) => {
  return db.promise().query('UPDATE type SET ? WHERE T_id = ?', [data, id]);
};

exports.deleteType = (id) => {
  return db.promise().query('DELETE FROM type WHERE T_id = ?', [id]);
};
