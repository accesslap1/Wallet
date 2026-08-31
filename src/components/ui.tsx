import { colors, radius, spacing, typography } from '@/src/design/tokens';
import { TransactionStatus } from '@/src/domain/models';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PropsWithChildren, ReactNode } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function Screen({ children }: PropsWithChildren) {
  return (
    <SafeAreaView style={s.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.screen}>
        {children}
      </ScrollView>
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
      <View style={s.sectionLead}>
        <Text style={s.sectionTitle}>{title}</Text>
        <View style={s.sectionLine} />
      </View>
      {action}
    </View>
  );
}
export function Panel({ children }: PropsWithChildren) {
  return <View style={s.panel}>{children}</View>;
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
      {value && (
        <Text numberOfLines={2} style={s.rowValue}>
          {value}
        </Text>
      )}
      {onPress && <MaterialCommunityIcons name="chevron-right" size={22} color={colors.grey} />}
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
      <Text style={s.markText}>{symbol.slice(0, 2).toUpperCase()}</Text>
    </View>
  );
}
export function Status({ value }: { value: TransactionStatus }) {
  const config =
    value === 'completed'
      ? { icon: 'check-circle-outline' as const, color: colors.blueBright }
      : value === 'pending'
        ? { icon: 'clock-outline' as const, color: colors.warning }
        : value === 'failed'
          ? { icon: 'alert-circle-outline' as const, color: colors.red }
          : { icon: 'close-circle-outline' as const, color: colors.grey };
  return (
    <View style={[s.status, { borderColor: config.color }]}>
      <MaterialCommunityIcons name={config.icon} size={12} color={config.color} />
      <Text style={[s.statusText, { color: config.color }]}>{value}</Text>
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
        <ActivityIndicator color={colors.blue} />
        <Text style={s.rowSubtitle}>Loading wallet information...</Text>
      </View>
    );
  if (error)
    return (
      <View style={s.state}>
        <MaterialCommunityIcons name="alert-circle-outline" size={34} color={colors.red} />
        <Text style={s.stateTitle}>Unable to load</Text>
        <Text style={s.stateText}>{error}</Text>
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
        <MaterialCommunityIcons name="tray" size={34} color={colors.grey} />
        <Text style={s.stateTitle}>Nothing here yet</Text>
        <Text style={s.stateText}>{empty}</Text>
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
        <View style={s.sheetIcon}>
          <MaterialCommunityIcons name="progress-wrench" size={24} color={colors.blueBright} />
        </View>
        <Text style={s.sheetTitle}>{action} is coming next</Text>
        <Text style={s.sheetBody}>
          This release focuses on viewing and understanding your Wallet. The {action} execution flow will be
          added in a following implementation phase.
        </Text>
        <Pressable onPress={onClose} style={({ pressed }) => [s.primary, pressed && s.primaryPressed]}>
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
      <Text selectable style={label.toLowerCase().includes('address') ? s.address : s.kvValue}>
        {value}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.canvas },
  screen: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    padding: spacing.lg,
    paddingBottom: 54,
    gap: spacing.lg,
  },
  titleBlock: { gap: 5 },
  eyebrow: { ...typography.label, letterSpacing: 1.5, color: colors.blueBright, textTransform: 'uppercase' },
  title: { ...typography.title, color: colors.white },
  subtitle: { ...typography.text, color: colors.grey, maxWidth: 560 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  sectionLead: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  sectionTitle: {
    ...typography.label,
    color: colors.blueBright,
    textTransform: 'uppercase',
    letterSpacing: 1.25,
  },
  sectionLine: { height: 1, flex: 1, backgroundColor: colors.border },
  panel: {
    backgroundColor: colors.background,
    borderRadius: radius.medium,
    borderWidth: 1,
    borderColor: colors.divider,
    paddingHorizontal: spacing.md,
  },
  row: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.divider,
    gap: 12,
  },
  pressed: { backgroundColor: colors.blueSoft, opacity: 0.82 },
  rowCopy: { flex: 1, gap: 3 },
  rowTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 15, lineHeight: 20, color: colors.white },
  rowSubtitle: { ...typography.label, color: colors.grey },
  rowValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    lineHeight: 18,
    color: colors.white,
    maxWidth: 126,
    textAlign: 'right',
  },
  mark: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.white,
    borderWidth: 3,
    borderColor: colors.grey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markText: { ...typography.label, color: colors.background },
  status: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: radius.round,
    borderWidth: 1,
  },
  statusText: { fontFamily: 'Inter_600SemiBold', fontSize: 10, lineHeight: 13, textTransform: 'capitalize' },
  state: {
    minHeight: 220,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 24,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: radius.medium,
  },
  stateTitle: { ...typography.title, color: colors.white },
  stateText: { ...typography.text, color: colors.grey, textAlign: 'center' },
  retry: {
    minHeight: 42,
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.small,
    backgroundColor: colors.blue,
  },
  retryText: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors.black },
  scrim: { position: 'absolute', inset: 0, backgroundColor: colors.scrim },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderColor: colors.border,
    borderTopLeftRadius: radius.large,
    borderTopRightRadius: radius.large,
    padding: 24,
    gap: 14,
  },
  handle: { width: 44, height: 3, borderRadius: 2, alignSelf: 'center', backgroundColor: colors.grey },
  sheetIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blueSoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sheetTitle: { ...typography.title, color: colors.white },
  sheetBody: { ...typography.text, color: colors.grey },
  primary: {
    minHeight: 50,
    borderRadius: radius.round,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryPressed: { backgroundColor: colors.blueBright, transform: [{ scale: 0.99 }] },
  primaryText: { fontFamily: 'Inter_700Bold', color: colors.black, fontSize: 15 },
  kv: {
    gap: 6,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.divider,
  },
  kvLabel: { ...typography.label, textTransform: 'uppercase', letterSpacing: 0.7, color: colors.grey },
  kvValue: { ...typography.text, fontFamily: 'Inter_600SemiBold', color: colors.white },
  address: { ...typography.address, color: colors.white },
});
