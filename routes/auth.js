const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../auth/authMiddle');

router.post('/login', authController.login);
router.get('/getme', authMiddleware, authController.getMe);

module.exports = router;
