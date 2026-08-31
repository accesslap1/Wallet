import { ActionGrid } from '@/src/components/actions';
import { TransactionRow } from '@/src/components/transactions';
import {
  ActionSheet,
  KeyValue,
  PageTitle,
  Panel,
  Screen,
  SectionHeader,
  StateView,
} from '@/src/components/ui';
import { formatMinor, formatUsd } from '@/src/domain/money';
import { useWallet } from '@/src/state/wallet-context';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
export default function Asset() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { snapshot, loading, error, reload, balancesHidden } = useWallet();
  const [action, setAction] = useState<string>();
  if (!snapshot)
    return (
      <Screen>
        <StateView loading={loading} error={error} onRetry={reload} />
      </Screen>
    );
  const asset = snapshot.assets.find((x) => x.id === id);
  if (!asset)
    return (
      <Screen>
        <StateView empty="This Asset could not be found." />
      </Screen>
    );
  const balance = snapshot.balances.find((x) => x.assetId === asset.id);
  const wallet = snapshot.wallets.find((x) => x.id === asset.walletId);
  const sub = snapshot.subaccounts.find((x) => x.id === wallet?.subaccountId);
  const account = snapshot.accounts.find((x) => x.id === sub?.accountId);
  const addresses = snapshot.addresses.filter((x) => x.assetId === asset.id);
  const tx = snapshot.transactions.filter((x) => x.assetId === asset.id);
  return (
    <Screen>
      <PageTitle
        eyebrow={asset.kind}
        title={`${asset.name} · ${asset.symbol}`}
        subtitle={`${account?.name} / ${sub?.name} / ${wallet?.name}`}
      />
      <Panel>
        <KeyValue
          label="Available balance"
          value={balance ? formatMinor(balance.available, balancesHidden) : 'Unavailable'}
        />
        <KeyValue
          label="Locked balance"
          value={balance ? formatMinor(balance.locked, balancesHidden) : 'Unavailable'}
        />
        <KeyValue
          label="Estimated value"
          value={formatUsd(balance?.estimatedUsdMinor ?? 0n, balancesHidden)}
        />
        {addresses.map((x) => (
          <KeyValue key={x.id} label={`${x.network} receiving address`} value={x.address} />
        ))}
      </Panel>
      <SectionHeader title="Available actions" />
      <ActionGrid onAction={setAction} />
      <SectionHeader title="Related transactions" />
      {tx.length ? (
        <Panel>
          {tx.map((x) => (
            <TransactionRow key={x.id} transaction={x} asset={asset} />
          ))}
        </Panel>
      ) : (
        <StateView empty="No transactions have been recorded for this Asset." />
      )}
      <ActionSheet action={action} onClose={() => setAction(undefined)} />
    </Screen>
  );
}
