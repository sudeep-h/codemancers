const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { requireAdmin } = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const {createProduct,getAllProducts} = require('../controllers/productController');

//only super admin can create product
router.post('/', protect, requireAdmin, upload.single('image'), createProduct);

//All users can get all products
router.get('/', protect, getAllProducts);

module.exports = router;
