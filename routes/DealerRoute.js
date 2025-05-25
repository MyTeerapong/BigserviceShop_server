const express = require('express');
const router = express.Router();
const itemController = require('../controllers/DealerController');
const authMiddleware = require('../auth/authMiddle');

router.get('/get',authMiddleware, itemController.getDealers);
router.get('/getbyId/:id',authMiddleware, itemController.getDealer);
router.post('/insert',authMiddleware, itemController.createDealer);
router.put('/update/:id',authMiddleware, itemController.updateDealer);
router.delete('/delete/:id',authMiddleware, itemController.deleteDealer);
router.get('/getNewId',authMiddleware, itemController.getNewDealerId);
module.exports = router;
