const express = require('express');
const router = express.Router();
const itemController = require('../controllers/BrandController');

router.get('/get', itemController.getBrands);
router.get('/getbyId/:id', itemController.getBrand);
router.post('/insert', itemController.createBrand);
router.put('/update/:id', itemController.updateBrand);
router.delete('/delete/:id', itemController.deleteBrand);
router.get('/getNewId', itemController.getNewBrandId);
module.exports = router;
