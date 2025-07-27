import request from 'supertest';
import app from '../app.js'

let token = '';
let sweetId = '';

beforeAll(async () => {
  const res = await request(app).post('/api/auth/register').send({
    name: 'Admin',
    email: 'admin@example.com',
    password: 'adminpass'
  });
  token = res.body.token;
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
    sweetId = res.body.id;
  });

})