const express = require('express');
const router = express.Router();
const reportTypeController = require('../report/report_type');

router.get('/type', reportTypeController.generateReportType);

module.exports = router;
