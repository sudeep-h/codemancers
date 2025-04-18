jest.setTimeout(20000);
const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const path = require('path');

let userCookie;
let testProductId;

beforeAll(async () => {

    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGO_URI_TEST);
    }

    const userEmail = `testuser_${Date.now()}@example.com`;
    const userPassword = 'password123';

    //Register an admin user to create a product
    await request(app)
        .post('/api/auth/register')
        .send({ email: userEmail, password: userPassword, role: 'admin' });

    const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: userEmail, password: userPassword });

    userCookie = loginRes.headers['set-cookie'];

    // Create a dummy product
    const productRes = await request(app)
        .post('/api/products')
        .set('Cookie', userCookie)
        .field('title', 'Cart Test Product')
        .field('description', 'A product for cart testing')
        .field('price', 49.99)
        .attach('image', path.resolve(__dirname, 'pen-image.jpg'));

    testProductId = productRes.body.product._id;
});

afterAll(async () => {
    await new Promise(resolve => setTimeout(resolve, 500)); 
    await mongoose.connection.close();
});

describe('Cart Routes', () => {
    it('should add product to cart', async () => {
        const res = await request(app)
        .post('/api/cart')
        .set('Cookie', userCookie)
        .send({
            productId: testProductId,
            quantity: 2
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/added to cart/i);
    });

    it('should get the user\'s cart', async () => {
        const res = await request(app)
        .get('/api/cart')
        .set('Cookie', userCookie);

        expect(res.statusCode).toBe(200);
        expect(res.body.cart).toHaveProperty('items');
        expect(Array.isArray(res.body.cart.items)).toBe(true);
        expect(res.body.cart.items[0].product._id).toBe(testProductId);
    });

    it('should remove product from cart', async () => {
        const res = await request(app)
        .delete(`/api/cart/${testProductId}`)
        .set('Cookie', userCookie);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/removed/i);
    });
});

