import { AssetMark, PageTitle, Row, Screen, StateView } from '@/src/components/ui';
import { accountEstimatedUsd, formatUsd } from '@/src/domain/money';
import { useWallet } from '@/src/state/wallet-context';
import { router } from 'expo-router';
export default function Accounts() {
  const { snapshot, loading, error, reload, balancesHidden } = useWallet();
  if (!snapshot)
    return (
      <Screen>
        <StateView loading={loading} error={error} onRetry={reload} />
      </Screen>
    );
  return (
    <Screen>
      <PageTitle
        eyebrow="Management"
        title="Accounts"
        subtitle="Your highest-level financial spaces. Totals are calculated from their underlying Assets."
      />
      {snapshot.accounts.length ? (
        snapshot.accounts.map((a) => (
          <Row
            key={a.id}
            title={a.name}
            subtitle={`${a.subaccountIds.length} subaccounts · ${a.subtitle}`}
            value={formatUsd(accountEstimatedUsd(snapshot, a.id), balancesHidden)}
            leading={<AssetMark symbol={a.name} />}
            onPress={() => router.push(`/account/${a.id}`)}
          />
        ))
      ) : (
        <StateView empty="Create an Account to begin organizing Wallets and Assets." />
      )}
    </Screen>
  );
}
