jest.setTimeout(20000);

const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const path = require('path');

jest.mock('../utils/nodemailer', () => jest.fn().mockResolvedValue(true));
const sendEmail = require('../utils/nodemailer');

let userCookie;
let testProductId;

beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGO_URI_TEST);
    }

    const userEmail = `checkout_${Date.now()}@example.com`;
    const password = 'password123';

    await request(app)
        .post('/api/auth/register')
        .send({ email: userEmail, password, role: 'admin' });

    const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: userEmail, password });

    userCookie = loginRes.headers['set-cookie'];

    //Creating dummy product
    const productRes = await request(app)
        .post('/api/products')
        .set('Cookie', userCookie)
        .field('title', 'Checkout Test Product')
        .field('description', 'Test checkout product')
        .field('price', 99.99)
        .attach('image', path.resolve(__dirname, 'pen-image.jpg'));

        // console.log('Product Create Status:', productRes.statusCode);
        // console.log('Product Response:', productRes.body);

    testProductId = productRes.body.product._id;

    //Adding Product to Cart
    await request(app)
        .post('/api/cart')
        .set('Cookie', userCookie)
        .send({
        productId: testProductId,
        quantity: 1
        });
});

afterAll(async () => {
    await new Promise(resolve => setTimeout(resolve, 500)); 
    await mongoose.connection.close();
});

describe('Checkout Route', () => {
    it('should complete the checkout and send email', async () => {
        const res = await request(app)
        .post('/api/checkout')
        .set('Cookie', userCookie)
        .send({ shippingAddress: 'Bangalore' });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/Checkout successful/i);
        expect(res.body.order).toHaveProperty('items');
        expect(sendEmail).toHaveBeenCalledTimes(1);

        // Check if cart is cleared
        const cart = await Cart.findOne({ user: res.body.order.user });
        expect(cart.items.length).toBe(0);
    });
});
