import { AssetMark, PageTitle, Row, Screen, StateView } from '@/src/components/ui';
import { formatUsd, walletEstimatedUsd } from '@/src/domain/money';
import { useWallet } from '@/src/state/wallet-context';
import { router, useLocalSearchParams } from 'expo-router';
export default function Wallet() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { snapshot, loading, error, reload, balancesHidden } = useWallet();
  if (!snapshot)
    return (
      <Screen>
        <StateView loading={loading} error={error} onRetry={reload} />
      </Screen>
    );
  const w = snapshot.wallets.find((x) => x.id === id);
  if (!w)
    return (
      <Screen>
        <StateView empty="This Wallet could not be found." />
      </Screen>
    );
  const sub = snapshot.subaccounts.find((x) => x.id === w.subaccountId);
  const a = snapshot.accounts.find((x) => x.id === sub?.accountId);
  return (
    <Screen>
      <PageTitle
        eyebrow={`${a?.name} / ${sub?.name}`}
        title={w.name}
        subtitle={`${w.type} Wallet · balances remain separate at Asset level.`}
      />
      <PageTitle
        eyebrow="Aggregated estimated value"
        title={formatUsd(walletEstimatedUsd(snapshot, w.id), balancesHidden)}
      />
      {snapshot.assets
        .filter((x) => x.walletId === w.id)
        .map((x) => (
          <Row
            key={x.id}
            title={x.name}
            subtitle={`${x.symbol} · ${x.kind}`}
            value={formatUsd(
              snapshot.balances.find((b) => b.assetId === x.id)?.estimatedUsdMinor ?? 0n,
              balancesHidden,
            )}
            leading={<AssetMark symbol={x.symbol} />}
            onPress={() => router.push(`/asset/${x.id}`)}
          />
        ))}
    </Screen>
  );
}
