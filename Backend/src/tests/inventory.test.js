import request from 'supertest';
import app from '../../app.js';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Sweet from '../models/Sweet.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

let adminToken = '';
let userToken = '';
let sweetId = '';

beforeAll(async () => {
  await connectDB();
  await User.deleteMany({});
  await Sweet.deleteMany({});

  const adminRes = await request(app).post('/api/auth/register').send({
    name: 'user',
    email: 'user@example.com',
    password: 'userpass',
    role: 'admin',
  });

  const userRes = await request(app).post('/api/auth/register').send({
    name: 'test',
    email: 'test@example.com',
    password: 'testpass',
  });

  adminToken = adminRes.body.token;
  userToken = userRes.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  // Fresh sweet before each test
  const sweetRes = await request(app)
    .post('/api/sweets/')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      name: 'Barfi',
      category: 'Milk',
      price: 50,
      quantity: 1,
    });

  sweetId = sweetRes.body._id;
});

describe('Inventory API', () => {
  it('should purchase sweet', async () => {
    const res = await request(app)
      .post(`/api/inventory/${sweetId}/purchase`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Sweet purchased successfully');
  });

  it('should not purchase if quantity is 0', async () => {
    // Manually update sweet to 0 quantity
    await Sweet.findByIdAndUpdate(sweetId, { inStock: false });

    const res = await request(app)
      .post(`/api/inventory/${sweetId}/purchase`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Sweet out of stock');
  });

});
