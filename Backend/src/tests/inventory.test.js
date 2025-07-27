import request  from 'supertest';
import app from '../../app.js';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Sweet from '../models/Sweet.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';


dotenv.config();

let token = '';
let sweetId = '';


beforeAll(async () => {
    await connectDB();
    await User.deleteMany({});
    await Sweet.deleteMany({});

    const res = await request(app).post('/api/auth/register').send({
        name: 'user',
        email: 'user@example.com',
        password: 'userpass',
        role:'admin'
    });

    token = res.body.token;

  const sweet = await request(app)
    .post('/api/sweets/')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'Barfi',
      category: 'Milk',
      price: 50,
      quantity: 1
    });

  sweetId = sweet.body._id;
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Inventory API', () => {
  it('should purchase sweet', async () => {
    const res = await request(app)
      .post(`/api/inventory/${sweetId}/purchase`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });
})