import { colors } from '@/src/design/tokens';
import { Pressable, StyleSheet, Text, View } from 'react-native';
export const actions = ['Send', 'Receive', 'Transfer', 'Withdraw', 'Swap', 'E-Pay'];
export function ActionGrid({ onAction }: { onAction: (action: string) => void }) {
  return (
    <View style={s.grid}>
      {actions.map((action, index) => (
        <Pressable
          accessibilityRole="button"
          key={action}
          onPress={() => onAction(action)}
          style={({ pressed }) => [s.action, pressed && s.pressed]}
        >
          <Text style={s.icon}>{['↗', '↓', '⇄', '↙', '⌁', '▣'][index]}</Text>
          <Text style={s.label}>{action}</Text>
        </Pressable>
      ))}
    </View>
  );
}
const s = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -5 },
  action: { width: '33.333%', alignItems: 'center', gap: 8, paddingVertical: 12 },
  pressed: { opacity: 0.5 },
  icon: {
    width: 44,
    height: 44,
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 14,
    backgroundColor: colors.accentSoft,
    color: colors.accent,
    fontSize: 21,
    fontWeight: '700',
  },
  label: { fontSize: 13, fontWeight: '700', color: colors.ink },
});
