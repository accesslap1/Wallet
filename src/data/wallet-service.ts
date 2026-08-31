import { WalletSnapshot } from '@/src/domain/models';
export interface WalletDataService {
  getSnapshot(): Promise<WalletSnapshot>;
}
