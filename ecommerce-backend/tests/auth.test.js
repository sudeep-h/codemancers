jest.setTimeout(15000);
const request=require('supertest');
const app=require('../server');
const mongoose=require('mongoose');
require('dotenv').config();

beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGO_URI_TEST);
        console.log("Mongodb-test connected successfully");
    }
});

afterAll(async () => {
    await new Promise(resolve => setTimeout(resolve, 500)); 
    await mongoose.connection.close();
});

describe('Auth Routes', () => {
    const dynamicEmail = `testuser_${Date.now()}@example.com`;
    const dummyUser = {
        email: dynamicEmail,
        password: 'password123',
        role: 'user'
    };
  
    it('should register a new user successfully', async () => {
        const res = await request(app).post('/api/auth/register').send(dummyUser);
    
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toMatch(/Registered Successfully/i);
        // expect(res.body.user.email).toBe(dummyUser.email);
    });
  
    it('should not register with missing fields', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ email: 'testuser@example.com' }); 
    
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message');
    });
  
    it('should not register if user already exists', async () => {
        await request(app).post('/api/auth/register').send(dummyUser);   //Already registered user above
    
        const res = await request(app).post('/api/auth/register').send(dummyUser);
    
        expect(res.statusCode).toBe(400); 
        // expect(res.body).toHaveProperty('error');
        expect(res.body.message).toMatch(/Email already registered/i);
    });
  
    it('should login a registered user', async () => {
        await request(app).post('/api/auth/register').send(dummyUser);
    
        const res = await request(app)
            .post('/api/auth/login')
            .send({
            email: dummyUser.email,
            password: dummyUser.password
            });
    
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user.email).toBe(dummyUser.email);
    });
  
    it('should not login with wrong password', async () => {
        await request(app).post('/api/auth/register').send(dummyUser);
    
        const res = await request(app)
            .post('/api/auth/login')
            .send({
            email: dummyUser.email,
            password: 'wrongpassword'
            });
    
        expect(res.statusCode).toBe(401);
        // expect(res.body).toHaveProperty('error');
        expect(res.body.message).toMatch(/Invalid Credentials/i);
    });
  
    it('should not login with non-existent user', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
            email: 'nouser@example.com',
            password: 'password123'
            });
    
        expect(res.statusCode).toBe(401);
        // expect(res.body).toHaveProperty('error');
        expect(res.body.message).toMatch(/Invalid Credentials/i);
    });
  
    it('should logout user', async () => {
        const res = await request(app).get('/api/auth/logout');
    
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/logged out/i);
    });
});
