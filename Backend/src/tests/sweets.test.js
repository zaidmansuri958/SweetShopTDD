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
        role: 'admin'
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
        sweetId = res.body._id;
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

    it('should update a sweet', async () => {
        const res = await request(app)
            .put(`/api/sweets/${sweetId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ price: 150 });

        expect(res.statusCode).toBe(200);
    });

    it('should delete a sweet', async () => {
        const res = await request(app)
            .delete(`/api/sweets/${sweetId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
    });

    it('should fail to create sweet with invalid data', async () => {
        const res = await request(app)
            .post('/api/sweets')
            .set('Authorization', `Bearer ${token}`)
            .send({ price: 'invalid' }); // missing required fields

        expect(res.statusCode).toBe(400);
    });

    it('should return 404 when deleting non-existent sweet', async () => {
        const res = await request(app)
            .delete('/api/sweets/64cb1234567890abcdef1234')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(404);
    });

    it('should return empty array when no sweets match search', async () => {
        const res = await request(app)
            .get('/api/sweets/search?name=DoesNotExist')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });

    it('should reject unauthenticated sweet creation', async () => {
        const res = await request(app)
            .post('/api/sweets')
            .send({ name: 'Jalebi', price: 50 });

        expect(res.statusCode).toBe(401); // or 403 depending on your auth middleware
    });

});
