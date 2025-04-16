const express = require('express');
const router = express.Router();

const { protect } = require('../middlewares/authMiddleware');
const cartController = require('../controllers/cartController');

//Add product to cart (logged-in users only)
router.post('/', protect, cartController.addToCart);

//Get current user's cart
router.get('/', protect, cartController.getCart);

module.exports = router;
