const express = require('express');
const router = express.Router();
const itemController = require('../controllers/BrandController');
const authMiddleware = require('../auth/authMiddle');

router.get('/get',authMiddleware, itemController.getBrands);
router.get('/getbyId/:id',authMiddleware, itemController.getBrand);
router.post('/insert',authMiddleware, itemController.createBrand);
router.put('/update/:id',authMiddleware, itemController.updateBrand);
router.delete('/delete/:id',authMiddleware, itemController.deleteBrand);
router.get('/getNewId', itemController.getNewBrandId);
module.exports = router;
