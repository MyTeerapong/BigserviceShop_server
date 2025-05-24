const express = require('express');
const router = express.Router();
const itemController = require('../controllers/TypeController');

router.get('/get', itemController.getTypes);
router.get('/getbyId/:id', itemController.getType);
router.post('/insert', itemController.createType);
router.put('/update/:id', itemController.updateType);
router.delete('/delete/:id', itemController.deleteType);
router.get('/getNewId', itemController.getNewTypeId);
module.exports = router;
