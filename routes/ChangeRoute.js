const express = require('express');
const router = express.Router();
const itemController = require('../controllers/ChangeController');
const authMiddleware = require('../auth/authMiddle');

router.get('/get',authMiddleware, itemController.getChanges);
router.get('/getbyId/:id',authMiddleware, itemController.getChange);
router.post('/insert',authMiddleware, itemController.createChange);
router.delete('/delete/:id',authMiddleware, itemController.deleteChange);
router.get('/getNewId',authMiddleware, itemController.getNewChangeId);

module.exports = router;
