jest.setTimeout(30000);
const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const path = require('path');
const User = require('../models/User');

let adminCookie;
let createdProductId;

beforeAll(async () => {

    if(mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGO_URI_TEST);
    }

    const adminEmail = 'admin@example.com';
    const password = 'admin123';

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
        await User.create({
        email: adminEmail,
        password,
        role: 'admin'
        });
    }

    const res = await request(app)
        .post('/api/auth/login')
        .set('Accept', 'application/json')
        .send({ email: adminEmail, password });

        // console.log("res-headers",res.headers);

    adminCookie = res.headers['set-cookie'];
    // console.log("admincookie",adminCookie);
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Product Routes (Admin)', () => {
    it('should create a product', async () => {
        const res = await request(app)
        .post('/api/products')
        .set('Cookie', adminCookie)
        .field('title', 'Test Product')
        .field('description', 'A test product')
        .field('price', '99.99')
        .attach('image', path.resolve(__dirname, 'pen-image.jpg'))

        expect(res.statusCode).toBe(201);
        expect(res.body.product.title).toBe('Test Product');
        createdProductId = res.body.product._id;
    });

    it('should get all products', async () => {
        const res = await request(app)
        .get('/api/products');

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.products)).toBe(true);
    });

    it('should update the product', async () => {
        const res = await request(app)
        .put(`/api/products/${createdProductId}`)
        .set('Cookie', adminCookie)
        .field('title', 'Updated Product');

        expect(res.statusCode).toBe(200);
        expect(res.body.product.title).toBe('Updated Product');
    });

    it('should delete the product', async () => {
        const res = await request(app)
        .delete(`/api/products/${createdProductId}`)
        .set('Cookie', adminCookie);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/deleted/i);
    });
});
