import { UserSessionMiddleware } from './user-session.middleware';

describe('UserSessionMiddleware', () => {
  it('should be defined', () => {
    expect(new UserSessionMiddleware()).toBeDefined();
  });
});
