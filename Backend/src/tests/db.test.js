import { jest } from '@jest/globals';

const mockConnection = { connection: 'mocked' };
const mockConnect = jest.fn(() => Promise.resolve(mockConnection));

jest.unstable_mockModule('mongoose', () => ({
  default: {
    connect: mockConnect,
  },
}));

const connectDB = (await import('../config/db.js')).default;

describe('MongoDB Connection', () => {
  it('should connect to MongoDB Atlas', async () => {
    const db = await connectDB();
    expect(mockConnect).toHaveBeenCalled();
    expect(db.connection).toBe('mocked');
  });
});