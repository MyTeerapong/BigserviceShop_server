const express = require('express');
const router = express.Router();
const itemController = require('../controllers/ReceiveController');
const authMiddleware = require('../auth/authMiddle');

router.get('/get',authMiddleware, itemController.getReceives);
router.get('/getbyId/:id',authMiddleware, itemController.getReceive);
router.post('/insert',authMiddleware, itemController.createReceive);
router.put('/update/:id',authMiddleware, itemController.updateReceive);
router.delete('/delete/:id',authMiddleware, itemController.deleteReceive);
router.get('/getNewId', itemController.getNewReceiveId);

module.exports = router;
