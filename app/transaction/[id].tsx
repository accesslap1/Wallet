import { KeyValue, PageTitle, Screen, StateView, Status } from '@/src/components/ui';
import { formatMinor } from '@/src/domain/money';
import { useWallet } from '@/src/state/wallet-context';
import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
export default function Transaction() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { snapshot, loading, error, reload } = useWallet();
  if (!snapshot)
    return (
      <Screen>
        <StateView loading={loading} error={error} onRetry={reload} />
      </Screen>
    );
  const t = snapshot.transactions.find((x) => x.id === id);
  if (!t)
    return (
      <Screen>
        <StateView empty="This Transaction could not be found." />
      </Screen>
    );
  const a = snapshot.assets.find((x) => x.id === t.assetId);
  return (
    <Screen>
      <PageTitle
        eyebrow="Transaction details"
        title={t.type.replace('-', ' ')}
        subtitle={new Date(t.occurredAt).toLocaleString()}
      />
      <View style={{ alignSelf: 'flex-start' }}>
        <Status value={t.status} />
      </View>
      <KeyValue label="Transaction ID" value={t.id} />
      <KeyValue label="Asset" value={`${a?.name ?? 'Unknown'} (${a?.symbol ?? '—'})`} />
      <KeyValue label="Amount" value={formatMinor(t.amount)} />
      <KeyValue label="Fee" value={formatMinor(t.fee)} />
      <KeyValue label="Source" value={t.source} />
      <KeyValue label="Destination" value={t.destination} />
      {t.network && <KeyValue label="Network" value={t.network} />}{' '}
      {t.reference && <KeyValue label="Reference" value={t.reference} />}{' '}
      {t.statusReason && <KeyValue label="Status reason" value={t.statusReason} />}
    </Screen>
  );
}
