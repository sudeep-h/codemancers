const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.addToCart = async (req, res) => {
    const userId = req.user._id;
    const { productId, quantity } = req.body;
  
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
    
        let cart = await Cart.findOne({ user: userId });
    
        if (!cart) {
            cart = new Cart({
            user: userId,
            items: [{ product: productId, quantity: quantity || 1 }]
            });
        } else {
            const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    
            if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity || 1;
            } else {
            cart.items.push({ product: productId, quantity: quantity || 1 });
            }
        }
    
        await cart.save();
        res.status(200).json({ message: 'Product added to cart', cart });
    
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to add to cart', error: err.message });
    }
};
  