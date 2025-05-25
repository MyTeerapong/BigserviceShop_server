const express = require('express');
const router = express.Router();
const reportTypeController = require('../report/report_dealer');

router.get('/dealer', reportTypeController.generateReportDealer);

module.exports = router;
