import { TransactionRow } from '@/src/components/transactions';
import { PageTitle, Panel, Screen, StateView } from '@/src/components/ui';
import { colors, radius, typography } from '@/src/design/tokens';
import { TransactionStatus, TransactionType } from '@/src/domain/models';
import { useWallet } from '@/src/state/wallet-context';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
export default function Transactions() {
  const { snapshot, loading, error, reload } = useWallet();
  const [status, setStatus] = useState<TransactionStatus | 'all'>('all');
  const [type, setType] = useState<TransactionType | 'all'>('all');
  if (!snapshot)
    return (
      <Screen>
        <StateView loading={loading} error={error} onRetry={reload} />
      </Screen>
    );
  const values = snapshot.transactions.filter(
    (t) => (status === 'all' || t.status === status) && (type === 'all' || t.type === type),
  );
  return (
    <Screen>
      <PageTitle
        eyebrow="Ledger"
        title="Transaction history"
        subtitle="Completed and attempted movements across every Account."
      />
      <ScrollView horizontal contentContainerStyle={s.filters}>
        {(['all', 'completed', 'pending', 'failed', 'cancelled'] as const).map((v) => (
          <Pressable key={v} onPress={() => setStatus(v)} style={[s.filter, status === v && s.selected]}>
            <Text style={[s.text, status === v && s.selectedText]}>{v}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <ScrollView horizontal contentContainerStyle={s.filters}>
        {(['all', 'receive', 'send', 'transfer', 'withdraw', 'swap', 'e-pay'] as const).map((v) => (
          <Pressable key={v} onPress={() => setType(v)} style={[s.filter, type === v && s.selected]}>
            <Text style={[s.text, type === v && s.selectedText]}>{v}</Text>
          </Pressable>
        ))}
      </ScrollView>
      {values.length ? (
        <Panel>
          {values.map((t) => (
            <TransactionRow
              key={t.id}
              transaction={t}
              asset={snapshot.assets.find((a) => a.id === t.assetId)}
            />
          ))}
        </Panel>
      ) : (
        <StateView empty="No transactions match the selected filters." />
      )}
    </Screen>
  );
}
const s = StyleSheet.create({
  filters: { gap: 8, paddingRight: 18 },
  filter: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.small,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  selected: { backgroundColor: colors.blue, borderColor: colors.blueBright },
  text: { ...typography.label, textTransform: 'capitalize', color: colors.grey },
  selectedText: { color: colors.white },
});
