import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from '../../app.js';
import connectDB from '../config/db.js';
import User from '../models/User.js';  
import Sweet from '../models/Sweet.js';

dotenv.config();

let token = '';
let sweetId = '';

beforeAll(async () => {
  await connectDB();
  await User.deleteMany({});
  await Sweet.deleteMany({});

  const res = await request(app).post('/api/auth/register').send({
    name: 'Admin',
    email: 'admin@example.com',
    password: 'adminpass',
    role:'admin'
  });

  token = res.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Sweet API', () => {
  it('should add new sweet', async () => {
    const res = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Ladoo',
        category: 'Traditional',
        price: 100,
        quantity: 50
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    sweetId = res.body.id;
  });

  it('should get all sweets', async () => {
    const res = await request(app)
      .get('/api/sweets')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should search sweets by name', async () => {
    const res = await request(app)
      .get('/api/sweets/search?name=Ladoo')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

});
