const express = require('express');
const router = express.Router();
const itemController = require('../controllers/TypeController');
const authMiddleware = require('../auth/authMiddle');

router.get('/get',authMiddleware, itemController.getTypes);
router.get('/getbyId/:id',authMiddleware, itemController.getType);
router.post('/insert', authMiddleware, itemController.createType);
router.put('/update/:id',authMiddleware, itemController.updateType);
router.delete('/delete/:id',authMiddleware, itemController.deleteType);
router.get('/getNewId', itemController.getNewTypeId);
module.exports = router;
