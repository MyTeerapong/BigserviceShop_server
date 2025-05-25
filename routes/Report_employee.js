const express = require('express');
const router = express.Router();
const reportEmployeeController = require('../report/report_employee');

router.get('/brand', reportEmployeeController.generateReportEmployee);

module.exports = router;
