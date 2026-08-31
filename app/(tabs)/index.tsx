import { ActionGrid } from '@/src/components/actions';
import { TransactionRow } from '@/src/components/transactions';
import {
  ActionSheet,
  AssetMark,
  PageTitle,
  Row,
  Screen,
  SectionHeader,
  StateView,
} from '@/src/components/ui';
import { accountEstimatedUsd, formatUsd, totalEstimatedUsd } from '@/src/domain/money';
import { useWallet } from '@/src/state/wallet-context';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
export default function Home() {
  const { snapshot, loading, error, reload, balancesHidden, toggleBalances } = useWallet();
  const [action, setAction] = useState<string>();
  if (!snapshot)
    return (
      <Screen>
        <StateView loading={loading} error={error} onRetry={reload} />
      </Screen>
    );
  const top = [...snapshot.assets]
    .sort((a, b) =>
      Number(
        (snapshot.balances.find((x) => x.assetId === b.id)?.estimatedUsdMinor ?? 0n) -
          (snapshot.balances.find((x) => x.assetId === a.id)?.estimatedUsdMinor ?? 0n),
      ),
    )
    .slice(0, 3);
  return (
    <Screen>
      <PageTitle
        eyebrow="Wallet overview"
        title={`Hello, ${snapshot.user.displayName.split(' ')[0]}`}
        subtitle="All your financial spaces, understood at a glance."
      />
      <View style={s.balance}>
        <View>
          <Text style={s.label}>Total estimated value</Text>
          <Text style={s.value}>{formatUsd(totalEstimatedUsd(snapshot), balancesHidden)}</Text>
        </View>
        <Pressable onPress={toggleBalances} style={s.eye}>
          <Text>{balancesHidden ? 'Reveal' : 'Hide'}</Text>
        </Pressable>
      </View>
      <ActionGrid onAction={setAction} />
      <SectionHeader
        title="Accounts"
        action={
          <Pressable onPress={() => router.push('/accounts')}>
            <Text style={s.link}>View all</Text>
          </Pressable>
        }
      />
      {snapshot.accounts.map((a) => (
        <Row
          key={a.id}
          title={a.name}
          subtitle={`${a.subaccountIds.length} subaccounts · ${a.subtitle}`}
          value={formatUsd(accountEstimatedUsd(snapshot, a.id), balancesHidden)}
          leading={<AssetMark symbol={a.name} />}
          onPress={() => router.push(`/account/${a.id}`)}
        />
      ))}
      <SectionHeader title="Top assets" />
      {top.map((a) => (
        <Row
          key={a.id}
          title={a.name}
          subtitle={a.symbol}
          value={formatUsd(
            snapshot.balances.find((x) => x.assetId === a.id)?.estimatedUsdMinor ?? 0n,
            balancesHidden,
          )}
          leading={<AssetMark symbol={a.symbol} />}
          onPress={() => router.push(`/asset/${a.id}`)}
        />
      ))}
      <SectionHeader
        title="Recent activity"
        action={
          <Pressable onPress={() => router.push('/transactions')}>
            <Text style={s.link}>Full history</Text>
          </Pressable>
        }
      />
      {snapshot.transactions.slice(0, 3).map((t) => (
        <TransactionRow key={t.id} transaction={t} asset={snapshot.assets.find((a) => a.id === t.assetId)} />
      ))}
      <ActionSheet action={action} onClose={() => setAction(undefined)} />
    </Screen>
  );
}
const s = StyleSheet.create({
  balance: {
    backgroundColor: '#111B2E',
    borderRadius: 20,
    padding: 22,
    minHeight: 132,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  label: { fontSize: 13, color: '#BFC6D2', fontWeight: '700' },
  value: { fontSize: 32, lineHeight: 42, color: '#fff', fontWeight: '800', marginTop: 10 },
  eye: { backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  link: { fontWeight: '800', color: '#2C5D4B' },
});
