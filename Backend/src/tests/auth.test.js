import dotenv from 'dotenv';
dotenv.config();

import request from 'supertest';
import app from '../../app.js';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';

beforeAll(async () => {
  await connectDB();
});

// ❌ NOT afterEach
// ✅ Clean before every test
beforeEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Auth API', () => {
  it('should register a user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Zaid',
      email: 'zaid@example.com',
      password: '123456',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('zaid@example.com');
  });

  it('should not register same email twice', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Zaid',
      email: 'repeat@example.com',
      password: '123456',
    });

    const res = await request(app).post('/api/auth/register').send({
      name: 'Zaid2',
      email: 'repeat@example.com',
      password: 'abcdef',
    });

    expect(res.statusCode).toBe(400);
  });

  it('should login a user', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'LoginUser',
      email: 'login@example.com',
      password: 'mypassword'
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'login@example.com',
      password: 'mypassword'
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

   it('should not login wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'login@example.com',
      password: 'wrong'
    });

    expect(res.statusCode).toBe(401);
  });

  it('should not register without email', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'NoEmail',
      password: '123456'
    });

    expect(res.statusCode).toBe(400); // or 500 depending on your validation
  });

  it('should not login non-existent email', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'notfound@example.com',
      password: 'doesntmatter'
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Invalid email or password');
  });

  it('should not login without password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'login@example.com'
    });

    expect(res.statusCode).toBe(400); // or 500 if no validation is done
  });

  it('should register user with admin role', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'AdminUser',
      email: 'adminuser@example.com',
      password: 'adminpass',
      role: 'admin'
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.user.role).toBe('admin');
  });

});
