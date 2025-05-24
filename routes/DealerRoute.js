const express = require('express');
const router = express.Router();
const itemController = require('../controllers/DealerController');

router.get('/get', itemController.getDealers);
router.get('/getbyId/:id', itemController.getDealer);
router.post('/insert', itemController.createDealer);
router.put('/update/:id', itemController.updateDealer);
router.delete('/delete/:id', itemController.deleteDealer);
router.get('/getNewId', itemController.getNewDealerId);
module.exports = router;
