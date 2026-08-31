import { colors, radius, typography } from '@/src/design/tokens';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
export const actions = ['Send', 'Receive', 'Transfer', 'Withdraw', 'Swap', 'E-Pay'];
const icons = [
  'send-outline',
  'tray-arrow-down',
  'swap-horizontal',
  'bank-transfer-out',
  'swap-vertical',
  'qrcode-scan',
] as const;
export function ActionGrid({ onAction }: { onAction: (action: string) => void }) {
  return (
    <View style={s.shell}>
      <View style={s.grid}>
        {actions.map((action, index) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={action}
            key={action}
            onPress={() => onAction(action)}
            style={({ pressed }) => [s.action, pressed && s.pressed]}
          >
            <View style={s.icon}>
              <MaterialCommunityIcons name={icons[index]} size={22} color={colors.white} />
            </View>
            <Text style={s.label}>{action}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  shell: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: radius.medium,
    paddingVertical: 8,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  action: { width: '33.333%', alignItems: 'center', gap: 8, paddingVertical: 10 },
  pressed: { opacity: 0.55 },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: colors.blueBright,
  },
  label: { ...typography.label, color: colors.white },
});
