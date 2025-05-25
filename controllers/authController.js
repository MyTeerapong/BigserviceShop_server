const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { Em_username, Em_password } = req.body;
  try {
    const [rows] = await db.promise().query(
      'SELECT Em_id, Em_username, Em_password FROM employee WHERE Em_username = ?',
      [Em_username]
    );
    if (rows.length === 0) return res.status(400).json({ message: 'Invalid username or password' });

    const user = rows[0];
    // เปลี่ยนตรงนี้ ไม่ใช้ bcrypt
    const isMatch = Em_password === user.Em_password;

    if (!isMatch) return res.status(400).json({ message: 'Invalid username or password' });

    const token = jwt.sign(
      { id: user.Em_id, username: user.Em_username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};


exports.getMe = async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      'SELECT Em_id, Em_username, Em_name FROM employee WHERE Em_id = ?',
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });

    return res.json({ user: rows[0] });
  } catch (err) {
    console.error('getMe error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
