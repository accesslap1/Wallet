import { Asset, MinorAmount, WalletSnapshot } from './models';

export const money = (value: string, decimals: number, currency: string): MinorAmount => ({
  value: BigInt(value),
  decimals,
  currency,
});
export const addUsd = (values: bigint[]) => values.reduce((sum, value) => sum + value, 0n);
export const formatMinor = (amount: MinorAmount, hidden = false) => {
  if (hidden) return '••••••';
  const negative = amount.value < 0n;
  const absolute = negative ? -amount.value : amount.value;
  const base = 10n ** BigInt(amount.decimals);
  const whole = absolute / base;
  const fraction = (absolute % base).toString().padStart(amount.decimals, '0').replace(/0+$/, '');
  return `${negative ? '-' : ''}${whole.toLocaleString('en-US')}${fraction ? `.${fraction}` : ''} ${amount.currency}`;
};
export const formatUsd = (minor: bigint, hidden = false) =>
  hidden
    ? '$••••••'
    : `$${(Number(minor) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export const assetEstimatedUsd = (snapshot: WalletSnapshot, assetId: string) =>
  snapshot.balances.find((balance) => balance.assetId === assetId)?.estimatedUsdMinor ?? 0n;
export const walletEstimatedUsd = (snapshot: WalletSnapshot, walletId: string) =>
  addUsd(
    snapshot.assets
      .filter((asset) => asset.walletId === walletId)
      .map((asset) => assetEstimatedUsd(snapshot, asset.id)),
  );
export const subaccountEstimatedUsd = (snapshot: WalletSnapshot, subaccountId: string) =>
  addUsd(
    snapshot.wallets
      .filter((wallet) => wallet.subaccountId === subaccountId)
      .map((wallet) => walletEstimatedUsd(snapshot, wallet.id)),
  );
export const accountEstimatedUsd = (snapshot: WalletSnapshot, accountId: string) =>
  addUsd(
    snapshot.subaccounts
      .filter((subaccount) => subaccount.accountId === accountId)
      .map((subaccount) => subaccountEstimatedUsd(snapshot, subaccount.id)),
  );
export const totalEstimatedUsd = (snapshot: WalletSnapshot) =>
  addUsd(snapshot.accounts.map((account) => accountEstimatedUsd(snapshot, account.id)));
export const findAsset = (snapshot: WalletSnapshot, id: string): Asset | undefined =>
  snapshot.assets.find((asset) => asset.id === id);
