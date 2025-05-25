const express = require('express');
const router = express.Router();
const itemController = require('../controllers/ProductController');
const authMiddleware = require('../auth/authMiddle');

router.get('/get', authMiddleware, itemController.getProducts);
router.get('/getbyId/:id', authMiddleware, itemController.getProduct);
router.post('/insert',authMiddleware, itemController.createProduct);
router.put('/update/:id',authMiddleware, itemController.updateProduct);
router.delete('/delete/:id',authMiddleware, itemController.deleteProduct);
router.get('/getNewId', itemController.getNewProductId);
module.exports = router;
