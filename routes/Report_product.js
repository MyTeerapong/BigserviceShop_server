const express = require('express');
const router = express.Router();
const reportProductController = require('../report/report_product');

router.get('/product', reportProductController.generateReportProduct);

module.exports = router;
