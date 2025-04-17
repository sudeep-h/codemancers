const express = require('express');
const router = express.Router();

const { protect } = require('../middlewares/authMiddleware');
const orderController=require('../controllers/orderController');

router.post('/',protect,orderController.checkout)

module.exports = router;
