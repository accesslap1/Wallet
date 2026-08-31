import { MockWalletDataService } from '@/src/data/mock-wallet-service';
import { WalletSnapshot } from '@/src/domain/models';
import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from 'react';

type State = {
  snapshot?: WalletSnapshot;
  loading: boolean;
  error?: string;
  reload(): void;
  balancesHidden: boolean;
  toggleBalances(): void;
};
const Context = createContext<State | null>(null);
const service = new MockWalletDataService();
export function WalletProvider({ children }: PropsWithChildren) {
  const [snapshot, setSnapshot] = useState<WalletSnapshot>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [balancesHidden, setBalancesHidden] = useState(false);
  const load = () => {
    setLoading(true);
    setError(undefined);
    service
      .getSnapshot()
      .then(setSnapshot)
      .catch(() => setError('Wallet information could not be loaded.'))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    service
      .getSnapshot()
      .then(setSnapshot)
      .catch(() => setError('Wallet information could not be loaded.'))
      .finally(() => setLoading(false));
  }, []);
  const value = useMemo(
    () => ({
      snapshot,
      loading,
      error,
      reload: load,
      balancesHidden,
      toggleBalances: () => setBalancesHidden((value) => !value),
    }),
    [snapshot, loading, error, balancesHidden],
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useWallet() {
  const value = useContext(Context);
  if (!value) throw new Error('useWallet must be used inside WalletProvider');
  return value;
}
