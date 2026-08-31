export type Id = string;
export type MinorAmount = Readonly<{ value: bigint; decimals: number; currency: string }>;

export interface User {
  id: Id;
  displayName: string;
  accountIds: Id[];
}
export interface Account {
  id: Id;
  userId: Id;
  name: string;
  subtitle: string;
  subaccountIds: Id[];
}
export interface Subaccount {
  id: Id;
  accountId: Id;
  name: string;
  walletIds: Id[];
}
export type WalletType = 'EGETY' | 'FIAT' | 'CRYPTO' | 'WONDERS' | 'TOKENIZATION';
export interface Wallet {
  id: Id;
  subaccountId: Id;
  type: WalletType;
  name: string;
  assetIds: Id[];
}
export interface WalletAddress {
  id: Id;
  assetId: Id;
  network: string;
  address: string;
}
export interface Balance {
  assetId: Id;
  available: MinorAmount;
  locked: MinorAmount;
  estimatedUsdMinor: bigint;
}
export interface Asset {
  id: Id;
  walletId: Id;
  name: string;
  symbol: string;
  kind: 'fiat' | 'crypto' | 'ecosystem';
  decimals: number;
  addressIds: Id[];
}
export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'cancelled';
export type TransactionType = 'receive' | 'send' | 'transfer' | 'withdraw' | 'swap' | 'e-pay';
export interface Transaction {
  id: Id;
  type: TransactionType;
  status: TransactionStatus;
  assetId: Id;
  amount: MinorAmount;
  fee: MinorAmount;
  source: string;
  destination: string;
  occurredAt: string;
  statusReason?: string;
  network?: string;
  reference?: string;
}

export interface WalletSnapshot {
  user: User;
  accounts: Account[];
  subaccounts: Subaccount[];
  wallets: Wallet[];
  assets: Asset[];
  addresses: WalletAddress[];
  balances: Balance[];
  transactions: Transaction[];
}
