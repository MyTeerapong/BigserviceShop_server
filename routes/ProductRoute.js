const express = require('express');
const router = express.Router();
const itemController = require('../controllers/ProductController');

router.get('/get', itemController.getProducts);
router.get('/getbyId/:id', itemController.getProduct);
router.post('/insert', itemController.createProduct);
router.put('/update/:id', itemController.updateProduct);
router.delete('/delete/:id', itemController.deleteProduct);
router.get('/getNewId', itemController.getNewProductId);
module.exports = router;
