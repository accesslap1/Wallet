import { mockSnapshot } from '@/src/data/mock-wallet-service';
import { accountEstimatedUsd, formatMinor, money, totalEstimatedUsd } from './money';
describe('financial calculations', () => {
  it('formats integer minor units', () =>
    expect(formatMinor(money('18420000', 8, 'BTC'))).toBe('0.1842 BTC'));
  it('aggregates account totals', () =>
    expect(accountEstimatedUsd(mockSnapshot, 'acc-personal')).toBe(3919540n));
  it('aggregates the hierarchy', () => expect(totalEstimatedUsd(mockSnapshot)).toBe(4980565n));
});
