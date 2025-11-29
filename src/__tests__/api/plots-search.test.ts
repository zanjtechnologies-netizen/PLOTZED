import { NextRequest } from 'next/server';
import { POST } from '@/app/api/plots/search/route';
import { prisma } from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    plots: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  },
}));

describe('/api/plots/search', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should apply a bounding box for geolocation searches', async () => {
    (prisma.plots.findMany as jest.Mock).mockResolvedValue([]);

    const body = {
      latitude: '12.9716',
      longitude: '77.5946',
      radiusKm: 10,
    };

    const request = {
      json: async () => body,
    } as unknown as NextRequest;

    await POST(request);

    const findManyArgs = (prisma.plots.findMany as jest.Mock).mock.calls[0][0];
    const where = findManyArgs.where;

    // Check for the presence of the bounding box coordinates
    expect(where.latitude).toHaveProperty('gte');
    expect(where.latitude).toHaveProperty('lte');
    expect(where.longitude).toHaveProperty('gte');
    expect(where.longitude).toHaveProperty('lte');

    // Verify the coordinates are numbers
    expect(typeof where.latitude.gte).toBe('number');
    expect(typeof where.latitude.lte).toBe('number');
    expect(typeof where.longitude.gte).toBe('number');
    expect(typeof where.longitude.lte).toBe('number');
  });
});
