const express = require('express');
const router = express.Router();
const itemController = require('../controllers/EmployeeController');

router.get('/get', itemController.getEmployees);
router.get('/getbyId/:id', itemController.getEmployee);
router.post('/insert', itemController.createEmployee);
router.put('/update/:id', itemController.updateEmployee);
router.delete('/delete/:id', itemController.deleteEmployee);
router.get('/getNewId', itemController.getNewEmployeeId);
module.exports = router;
