const express = require('express');
const router = express.Router();
const itemController = require('../controllers/EmployeeController');
const authMiddleware = require('../auth/authMiddle');

router.get('/get',authMiddleware, itemController.getEmployees);
router.get('/getbyId/:id',authMiddleware, itemController.getEmployee);
router.post('/insert',authMiddleware, itemController.createEmployee);
router.put('/update/:id',authMiddleware, itemController.updateEmployee);
router.delete('/delete/:id',authMiddleware, itemController.deleteEmployee);
router.get('/getNewId', itemController.getNewEmployeeId);
module.exports = router;
