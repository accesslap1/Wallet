import { AssetMark, PageTitle, Panel, Row, Screen, SectionHeader, StateView } from '@/src/components/ui';
import { accountEstimatedUsd, formatUsd, subaccountEstimatedUsd } from '@/src/domain/money';
import { useWallet } from '@/src/state/wallet-context';
import { router, useLocalSearchParams } from 'expo-router';
export default function Account() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { snapshot, loading, error, reload, balancesHidden } = useWallet();
  if (!snapshot)
    return (
      <Screen>
        <StateView loading={loading} error={error} onRetry={reload} />
      </Screen>
    );
  const a = snapshot.accounts.find((x) => x.id === id);
  if (!a)
    return (
      <Screen>
        <StateView empty="This Account could not be found." />
      </Screen>
    );
  return (
    <Screen>
      <PageTitle eyebrow="Account" title={a.name} subtitle={a.subtitle} />
      <PageTitle
        eyebrow="Aggregated estimated value"
        title={formatUsd(accountEstimatedUsd(snapshot, a.id), balancesHidden)}
        subtitle="Calculated from all Assets inside this Account."
      />
      <SectionHeader title="Sub-accounts" />
      <Panel>
        {snapshot.subaccounts
          .filter((x) => x.accountId === a.id)
          .map((x) => (
            <Row
              key={x.id}
              title={x.name}
              subtitle={`${x.walletIds.length} wallets`}
              value={formatUsd(subaccountEstimatedUsd(snapshot, x.id), balancesHidden)}
              leading={<AssetMark symbol={x.name} />}
              onPress={() => router.push(`/subaccount/${x.id}`)}
            />
          ))}
      </Panel>
    </Screen>
  );
}
