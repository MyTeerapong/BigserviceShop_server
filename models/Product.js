const db = require('../config/db');
exports.getLastProductId = () => {
  return db.promise().query('SELECT P_id FROM product ORDER BY CAST(SUBSTRING(P_id, 2) AS UNSIGNED) DESC LIMIT 1;');
};

exports.getProduct = () => {
  return db.promise().query('SELECT p.*, t.T_name, b.B_name FROM product p JOIN type t ON p.T_id = t.T_id JOIN brand b ON p.B_id = b.B_id');
};

exports.getProductById = (id) => {
  return db.promise().query('SELECT * FROM product WHERE P_id = ?', [id]);
};

exports.createProduct = (data) => {
  return db.promise().query('INSERT INTO product (P_id, P_name, P_price, P_unit, P_quantity, P_detail, T_id, B_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [
    data.P_id,
    data.P_name,
    data.P_price,
    data.P_unit,
    data.P_quantity,
    data.P_detail,
    data.T_id,
    data.B_id
  ]);
};

exports.updateProduct = (id, data) => {
  return db.promise().query('UPDATE product SET ? WHERE P_id = ?', [data, id]);
};

exports.deleteProduct = (id) => {
  return db.promise().query('DELETE FROM product WHERE P_id = ?', [id]);
};
