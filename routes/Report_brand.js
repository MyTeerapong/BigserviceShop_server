const express = require('express');
const router = express.Router();
const reportTypeController = require('../report/report_brand');

router.get('/brand', reportTypeController.generateReportType);

module.exports = router;
