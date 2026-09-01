import { ActionGrid } from '@/src/components/actions';
import { TransactionRow } from '@/src/components/transactions';
import {
  ActionSheet,
  AssetMark,
  PageTitle,
  Panel,
  Row,
  Screen,
  SectionHeader,
  StateView,
} from '@/src/components/ui';
import { colors, radius, typography } from '@/src/design/tokens';
import { accountEstimatedUsd, formatUsd, totalEstimatedUsd } from '@/src/domain/money';
import { useWallet } from '@/src/state/wallet-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '@/src/features/auth/auth-context';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function Home() {
  const { session, signOut } = useAuth();
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
      <View style={s.header}>
        <View style={s.brand}>
          <View style={s.logo}>
            <MaterialCommunityIcons name="wallet" size={18} color={colors.black} />
          </View>
          <Text style={s.brandName}>Wallet</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Sign out"
          onPress={() => {
            signOut();
            router.replace('/');
          }}
          style={s.headerButton}
        >
          <MaterialCommunityIcons name="logout" size={21} color={colors.white} />
        </Pressable>
      </View>
      <PageTitle
        eyebrow="Wallet overview"
        title={`Hello, ${session?.profile.firstName ?? snapshot.user.displayName.split(' ')[0]}`}
        subtitle="All your financial spaces, understood at a glance."
      />
      <View style={s.balance}>
        <View style={s.balanceTop}>
          <Text style={s.balanceLabel}>TOTAL ESTIMATED VALUE</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={balancesHidden ? 'Reveal balances' : 'Hide balances'}
            onPress={toggleBalances}
            style={({ pressed }) => [s.eye, pressed && s.pressed]}
          >
            <MaterialCommunityIcons
              name={balancesHidden ? 'eye-outline' : 'eye-off-outline'}
              size={18}
              color={colors.white}
            />
          </Pressable>
        </View>
        <Text style={s.balanceValue}>{formatUsd(totalEstimatedUsd(snapshot), balancesHidden)}</Text>
        <View style={s.balanceFoot}>
          <View style={s.liveDot} />
          <Text style={s.balanceHint}>Calculated from all asset balances</Text>
        </View>
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
      <Panel>
        {snapshot.accounts.map((a) => (
          <Row
            key={a.id}
            title={a.name}
            subtitle={`${a.subaccountIds.length} sub-accounts · ${a.subtitle}`}
            value={formatUsd(accountEstimatedUsd(snapshot, a.id), balancesHidden)}
            leading={<AssetMark symbol={a.name} />}
            onPress={() => router.push(`/account/${a.id}`)}
          />
        ))}
      </Panel>
      <SectionHeader title="Top assets" />
      <Panel>
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
      </Panel>
      <SectionHeader
        title="Recent activity"
        action={
          <Pressable onPress={() => router.push('/transactions')}>
            <Text style={s.link}>Full history</Text>
          </Pressable>
        }
      />
      <Panel>
        {snapshot.transactions.slice(0, 3).map((t) => (
          <TransactionRow
            key={t.id}
            transaction={t}
            asset={snapshot.assets.find((a) => a.id === t.assetId)}
          />
        ))}
      </Panel>
      <ActionSheet action={action} onClose={() => setAction(undefined)} />
    </Screen>
  );
}
const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  logo: {
    width: 30,
    height: 30,
    borderRadius: 7,
    backgroundColor: colors.blueBright,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: { fontFamily: 'Inter_700Bold', fontSize: 15, color: colors.white },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  balance: {
    backgroundColor: colors.background,
    borderRadius: radius.large,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    gap: 10,
    overflow: 'hidden',
  },
  balanceTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  balanceLabel: { ...typography.label, letterSpacing: 1.1, color: colors.grey },
  balanceValue: { fontFamily: 'Inter_700Bold', fontSize: 30, lineHeight: 38, color: colors.white },
  balanceFoot: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.blueBright },
  balanceHint: { ...typography.label, color: colors.grey },
  eye: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.55 },
  link: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.blue,
  },
});
