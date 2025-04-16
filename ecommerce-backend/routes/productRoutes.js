const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { requireAdmin } = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const {createProduct,getAllProducts,updateProduct,deleteProduct} = require('../controllers/productController');

//only super admin can create product
router.post('/', protect, requireAdmin, upload.single('image'), createProduct);

//All users can get all products
router.get('/', protect, getAllProducts);

//only super admin can update a product
router.put('/:id', protect, updateProduct);

//only super admin can delete a product
router.delete('/:id', protect, requireAdmin, deleteProduct);

module.exports = router;
