const Cart = require('../models/Cart');
const Order = require('../models/Order');
const sendEmail = require('../utils/nodemailer');

// Checkout: Create order and clear cart
exports.checkout = async (req, res) => {
    const userId = req.user._id;
    const { shippingAddress } = req.body;

    try {
        const cart = await Cart.findOne({ user: userId }).populate('items.product');

        if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
        }

        if (!shippingAddress) {
        return res.status(400).json({ message: 'Shipping address is required' });
        }

        // Calculate total amount of cart
        const totalAmount = cart.items.reduce((acc, item) => {
        return acc + item.quantity * item.product.price;
        }, 0);

        // Create order
        const order = new Order({
        user: userId,
        items: cart.items.map(item => ({
            product: item.product._id,
            quantity: item.quantity
        })),
        shippingAddress,
        totalAmount
        });

        await order.save();

        // Clear user's cart after checkout
        cart.items = [];
        await cart.save();

        // Send confirmation email
        const emailContent = `
            <h2>Order Confirmation</h2>
            <p>Thank you for your order!</p>
            <p><strong>Shipping Address:</strong> ${shippingAddress}</p>
            <p><strong>Total:</strong> $${totalAmount}</p>
            <h4>Order Summary:</h4>
            <ul>
            ${cart.items.map(item => (
                `<li>${item.product.title} - Quantity: ${item.quantity}</li>`
            )).join('')}
            </ul>
            `;

        await sendEmail({
            to: req.user.email,
            subject: 'Your Online Store Order Confirmation',
            html: emailContent
        });


        res.status(200).json({ message: 'Checkout successful', order });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Checkout failed', error: error.message });
    }
};
