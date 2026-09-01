import { isStrongPassword, isValidPattern } from './auth-models';
import { hashSecret, MockAuthService } from './mock-auth-service';

describe('mock authentication', () => {
  const service = new MockAuthService();

  it('hashes secrets deterministically without retaining their input', () => {
    expect(hashSecret('sample-secret')).toBe(hashSecret('sample-secret'));
    expect(hashSecret('sample-secret')).not.toContain('sample');
  });

  it('validates every mock verification channel', () => {
    expect(service.verifyCode('email', '000000')).toBe(false);
  });

  it('validates password and pattern requirements', () => {
    expect(isStrongPassword('Secure#Pass!42', 'Secure#Pass!42')).toBe(true);
    expect(isStrongPassword('weak', 'weak')).toBe(false);
    expect(isValidPattern([0, 1, 4, 7])).toBe(true);
    expect(isValidPattern([0, 1, 1, 2])).toBe(false);
  });
});
