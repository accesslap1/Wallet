import { AssetMark, PageTitle, Row, Screen, StateView } from '@/src/components/ui';
import { formatUsd, subaccountEstimatedUsd, walletEstimatedUsd } from '@/src/domain/money';
import { useWallet } from '@/src/state/wallet-context';
import { router, useLocalSearchParams } from 'expo-router';
export default function Sub() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { snapshot, loading, error, reload, balancesHidden } = useWallet();
  if (!snapshot)
    return (
      <Screen>
        <StateView loading={loading} error={error} onRetry={reload} />
      </Screen>
    );
  const sub = snapshot.subaccounts.find((x) => x.id === id);
  if (!sub)
    return (
      <Screen>
        <StateView empty="This Subaccount could not be found." />
      </Screen>
    );
  const a = snapshot.accounts.find((x) => x.id === sub.accountId);
  return (
    <Screen>
      <PageTitle
        eyebrow={a?.name}
        title={sub.name}
        subtitle="A separate collection of Wallets inside this Account."
      />
      <PageTitle
        eyebrow="Aggregated estimated value"
        title={formatUsd(subaccountEstimatedUsd(snapshot, sub.id), balancesHidden)}
      />
      {snapshot.wallets
        .filter((x) => x.subaccountId === sub.id)
        .map((x) => (
          <Row
            key={x.id}
            title={x.name}
            subtitle={`${x.type} · ${x.assetIds.length} assets`}
            value={formatUsd(walletEstimatedUsd(snapshot, x.id), balancesHidden)}
            leading={<AssetMark symbol={x.type} />}
            onPress={() => router.push(`/wallet/${x.id}`)}
          />
        ))}
    </Screen>
  );
}
