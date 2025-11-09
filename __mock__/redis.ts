export const redis = {
  ping: jest.fn().mockResolvedValue('PONG'),
  status: 'connected',
  responseTime: 10,
  get: jest.fn(),
  set: jest.fn(),
};
