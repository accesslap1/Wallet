import { colors, spacing } from '@/src/design/tokens';
import { TransactionStatus } from '@/src/domain/models';
import { PropsWithChildren, ReactNode } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
export function Screen({ children }: PropsWithChildren) {
  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.screen}>{children}</ScrollView>
    </SafeAreaView>
  );
}
export function PageTitle({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={s.titleBlock}>
      {eyebrow && <Text style={s.eyebrow}>{eyebrow}</Text>}
      <Text style={s.title}>{title}</Text>
      {subtitle && <Text style={s.subtitle}>{subtitle}</Text>}
    </View>
  );
}
export function SectionHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <View style={s.sectionHeader}>
      <Text style={s.sectionTitle}>{title}</Text>
      {action}
    </View>
  );
}
export function Row({
  title,
  subtitle,
  value,
  leading,
  onPress,
  accessibilityLabel,
}: {
  title: string;
  subtitle?: string;
  value?: string;
  leading?: ReactNode;
  onPress?: () => void;
  accessibilityLabel?: string;
}) {
  const content = (
    <>
      <View>{leading}</View>
      <View style={s.rowCopy}>
        <Text numberOfLines={1} style={s.rowTitle}>
          {title}
        </Text>
        {subtitle && (
          <Text numberOfLines={2} style={s.rowSubtitle}>
            {subtitle}
          </Text>
        )}
      </View>
      {value && <Text style={s.rowValue}>{value}</Text>}
      {onPress && <Text style={s.chevron}>›</Text>}
    </>
  );
  return onPress ? (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      onPress={onPress}
      style={({ pressed }) => [s.row, pressed && s.pressed]}
    >
      {content}
    </Pressable>
  ) : (
    <View style={s.row}>{content}</View>
  );
}
export function AssetMark({ symbol }: { symbol: string }) {
  return (
    <View style={s.mark}>
      <Text style={s.markText}>{symbol.slice(0, 2)}</Text>
    </View>
  );
}
export function Status({ value }: { value: TransactionStatus }) {
  const tone =
    value === 'completed'
      ? s.good
      : value === 'pending'
        ? s.pending
        : value === 'failed'
          ? s.failed
          : s.cancelled;
  return (
    <View style={[s.status, tone]}>
      <Text style={s.statusText}>{value}</Text>
    </View>
  );
}
export function StateView({
  loading,
  error,
  empty,
  onRetry,
}: {
  loading?: boolean;
  error?: string;
  empty?: string;
  onRetry?: () => void;
}) {
  if (loading)
    return (
      <View style={s.state}>
        <ActivityIndicator color={colors.accent} />
        <Text style={s.rowSubtitle}>Loading wallet information…</Text>
      </View>
    );
  if (error)
    return (
      <View style={s.state}>
        <Text style={s.stateTitle}>Unable to load</Text>
        <Text style={s.rowSubtitle}>{error}</Text>
        {onRetry && (
          <Pressable onPress={onRetry} style={s.retry}>
            <Text style={s.retryText}>Try again</Text>
          </Pressable>
        )}
      </View>
    );
  if (empty)
    return (
      <View style={s.state}>
        <Text style={s.stateTitle}>Nothing here yet</Text>
        <Text style={s.rowSubtitle}>{empty}</Text>
      </View>
    );
  return null;
}
export function ActionSheet({ action, onClose }: { action?: string; onClose(): void }) {
  return (
    <Modal transparent animationType="slide" visible={!!action} onRequestClose={onClose}>
      <Pressable style={s.scrim} onPress={onClose} />
      <SafeAreaView style={s.sheet}>
        <View style={s.handle} />
        <Text style={s.sheetTitle}>{action} is coming next</Text>
        <Text style={s.sheetBody}>
          This first delivery focuses on viewing and understanding your Wallet. The {action} execution flow
          will be added in a following implementation phase.
        </Text>
        <Pressable onPress={onClose} style={s.primary}>
          <Text style={s.primaryText}>Got it</Text>
        </Pressable>
      </SafeAreaView>
    </Modal>
  );
}
export function KeyValue({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.kv}>
      <Text style={s.kvLabel}>{label}</Text>
      <Text selectable style={s.kvValue}>
        {value}
      </Text>
    </View>
  );
}
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.canvas },
  screen: { padding: spacing.lg, paddingBottom: 48, gap: spacing.lg },
  titleBlock: { gap: 6 },
  eyebrow: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: colors.accent,
    textTransform: 'uppercase',
  },
  title: { fontSize: 30, lineHeight: 36, fontWeight: '800', color: colors.ink, letterSpacing: -0.7 },
  subtitle: { fontSize: 15, lineHeight: 22, color: colors.muted },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.ink },
  row: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    gap: 12,
  },
  pressed: { opacity: 0.58 },
  rowCopy: { flex: 1, gap: 4 },
  rowTitle: { fontSize: 16, fontWeight: '700', color: colors.ink },
  rowSubtitle: { fontSize: 13, lineHeight: 18, color: colors.muted },
  rowValue: { fontSize: 15, fontWeight: '800', color: colors.ink, maxWidth: 118, textAlign: 'right' },
  chevron: { fontSize: 28, color: colors.muted },
  mark: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markText: { fontSize: 12, fontWeight: '900', color: colors.accent },
  status: { paddingHorizontal: 9, paddingVertical: 5, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: '800', textTransform: 'capitalize', color: colors.ink },
  good: { backgroundColor: colors.accentSoft },
  pending: { backgroundColor: colors.pendingSoft },
  failed: { backgroundColor: colors.dangerSoft },
  cancelled: { backgroundColor: colors.cancelledSoft },
  state: { minHeight: 240, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  stateTitle: { fontSize: 18, fontWeight: '800', color: colors.ink },
  retry: { padding: 12 },
  retryText: { fontWeight: '800', color: colors.accent },
  scrim: { position: 'absolute', inset: 0, backgroundColor: 'rgba(17,27,46,.35)' },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    gap: 16,
  },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', backgroundColor: colors.line },
  sheetTitle: { fontSize: 22, fontWeight: '800', color: colors.ink },
  sheetBody: { fontSize: 15, lineHeight: 23, color: colors.muted },
  primary: {
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  kv: { gap: 5, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  kvLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    color: colors.muted,
  },
  kvValue: { fontSize: 15, lineHeight: 21, fontWeight: '600', color: colors.ink },
});
