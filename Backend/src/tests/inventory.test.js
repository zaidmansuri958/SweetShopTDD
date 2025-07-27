import request  from 'supertest';
import app from '../../app.js';

let token = '';
let sweetId = '';

beforeAll(async () => {
  const res = await request(app).post('/api/auth/register').send({
    name: 'InventoryAdmin',
    email: 'invadmin@example.com',
    password: 'adminpass',
    role:'admin'
  });
  token = res.body.token;

  const sweet = await request(app)
    .post('/api/sweets')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'Barfi',
      category: 'Milk',
      price: 50,
      quantity: 1
    });

  sweetId = sweet.body.id;
});

describe('Inventory API', () => {
  it('should purchase sweet', async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });
})