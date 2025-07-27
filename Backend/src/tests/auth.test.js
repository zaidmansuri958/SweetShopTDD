import dotenv from 'dotenv';
dotenv.config(); 

import request from 'supertest';
import app from '../../app.js';
import mongoose from 'mongoose';
import connectDB from '../config/db.js'; 
beforeAll(async () => {
  await connectDB(); 
});

describe('Auth API', () => {
  it(
    'should register a user',
    async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Zaid',
        email: 'zaid@example.com',
        password: '123456',
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe('zaid@example.com');
    },
    10000 // timeout
  );
});

afterAll(async () => {
  await mongoose.connection.close();
});
