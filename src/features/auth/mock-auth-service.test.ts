import { isStrongPassword, isValidPattern, MOCK_CODES } from './auth-models';
import { hashSecret, MockAuthService } from './mock-auth-service';

describe('mock authentication', () => {
  const service = new MockAuthService();

  it('authenticates the development profile without storing the plain password', () => {
    expect(service.authenticateCredentials('maya.nassar@wallet-demo.test', 'Wallet#Demo!26')?.eid).toBe(
      'EID-700841626',
    );
    expect(hashSecret('Wallet#Demo!26')).not.toContain('Wallet');
  });

  it('validates every mock verification channel', () => {
    expect(service.verifyCode('email', MOCK_CODES.email)).toBe(true);
    expect(service.verifyCode('sms', MOCK_CODES.sms)).toBe(true);
    expect(service.verifyCode('authenticator', MOCK_CODES.authenticator)).toBe(true);
    expect(service.verifyCode('email', '000000')).toBe(false);
  });

  it('validates password and pattern requirements', () => {
    expect(isStrongPassword('Wallet#Demo!26', 'Wallet#Demo!26')).toBe(true);
    expect(isStrongPassword('weak', 'weak')).toBe(false);
    expect(isValidPattern([0, 1, 4, 7])).toBe(true);
    expect(isValidPattern([0, 1, 1, 2])).toBe(false);
  });
});
