import { AssetMark, Row, Status } from './ui';
import { formatMinor } from '@/src/domain/money';
import { Asset, Transaction } from '@/src/domain/models';
import { router } from 'expo-router';
import { View } from 'react-native';
export function TransactionRow({ transaction, asset }: { transaction: Transaction; asset?: Asset }) {
  return (
    <Row
      title={`${transaction.type.replace('-', ' ')} · ${asset?.symbol ?? 'Asset'}`}
      subtitle={new Date(transaction.occurredAt).toLocaleString()}
      value={formatMinor(transaction.amount)}
      leading={
        <View style={{ gap: 5 }}>
          <AssetMark symbol={asset?.symbol ?? '?'} />
          <Status value={transaction.status} />
        </View>
      }
      onPress={() => router.push(`/transaction/${transaction.id}`)}
      accessibilityLabel={`Open ${transaction.type} transaction, ${transaction.status}`}
    />
  );
}
