const express = require('express');
const router = express.Router();
const itemController = require('../controllers/SaleController');
const authMiddleware = require('../auth/authMiddle');

router.get('/get',authMiddleware, itemController.getSales);
router.get('/getbyId/:id',authMiddleware, itemController.getSale);
router.post('/insert', authMiddleware, itemController.createSale);
router.put('/update/:id', authMiddleware, itemController.updateSale);
router.delete('/delete/:id', authMiddleware, itemController.deleteSale);
router.get('/getNewId', itemController.getNewSaleId);

module.exports = router;
