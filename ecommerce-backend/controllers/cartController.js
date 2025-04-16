const Cart = require('../models/Cart');
const Product = require('../models/Product');

//Add products to the user's cart
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
            
            //If the product is existing then update the quantity
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

// Get current user's cart
exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(200).json({ message: 'Your cart is empty', cart: { items: [] } });
        }
        res.status(200).json({ cart });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch cart', error: err.message });
    }
};
  

// Remove item from cart
exports.removeFromCart = async (req, res) => {
    const { productId } = req.params;
  
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });
    
        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        await cart.save();
    
        res.status(200).json({ message: 'Item removed from cart', cart });
    } catch (err) {
        res.status(500).json({ message: 'Failed to remove item', error: err.message });
    }
};