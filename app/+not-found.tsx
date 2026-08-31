import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { colors, typography } from '@/src/design/tokens';
export default function NotFound() {
  return (
    <View style={s.root}>
      <Text style={s.title}>This page is unavailable.</Text>
      <Link href="/" style={s.link}>
        Return to Wallet Home
      </Link>
    </View>
  );
}
const s = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, backgroundColor: colors.canvas },
  title: { ...typography.title, color: colors.white },
  link: { ...typography.text, color: colors.blueBright },
});
