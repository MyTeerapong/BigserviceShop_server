const db = require('../config/db');
exports.getLastEmployeeId = () => {
  return db.promise().query('SELECT Em_id FROM employee ORDER BY CAST(SUBSTRING(Em_id, 2) AS UNSIGNED) DESC LIMIT 1;');
};

exports.getEmployee = () => {
  return db.promise().query('SELECT * FROM employee');
};

exports.getEmployeeById = (id) => {
  return db.promise().query('SELECT * FROM employee WHERE Em_id = ?', [id]);
};

exports.createEmployee = (data) => {
  return db.promise().query('INSERT INTO employee (Em_id, Em_name, Em_gender, Em_address, Em_tel, Em_date, Em_username, Em_password, Em_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [
    data.Em_id,
    data.Em_name,
    data.Em_gender,
    data.Em_address,
    data.Em_tel,
    data.Em_date,
    data.Em_username,
    data.Em_password,
    data.Em_status
  ]);
};

exports.updateEmployee = (id, data) => {
  return db.promise().query('UPDATE employee SET ? WHERE Em_id = ?', [data, id]);
};

exports.deleteEmployee = (id) => {
  return db.promise().query('DELETE FROM employee WHERE Em_id = ?', [id]);
};
