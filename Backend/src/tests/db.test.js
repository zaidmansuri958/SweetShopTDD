import { jest } from '@jest/globals';

const mockConnection = { connection: 'mocked' };
const mockConnect = jest.fn(() => Promise.resolve(mockConnection));

jest.unstable_mockModule('mongoose', () => ({
  default: {
    connect: mockConnect,
  },
}));

const { connectToDatabase } = await import('../utils/db.js');

describe('MongoDB Connection', () => {
  it('should connect to MongoDB Atlas', async () => {
    const db = await connectToDatabase();
    expect(mockConnect).toHaveBeenCalled();
    expect(db.connection).toBe('mocked');
  });
});