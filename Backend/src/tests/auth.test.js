import supertest from 'supertest';
import app from '../'
describe('Auth API', () => {
  it('should register a user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Zaid',
      email: 'zaid@example.com',
      password: '123456'
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('zaid@example.com');
  });
})